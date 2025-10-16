// Browser-compatible performance API
const getPerformanceNow = (): number => {
  if (typeof performance !== 'undefined' && performance.now) {
    return performance.now();
  }
  return Date.now();
};

type Vertex = { x: number; y: number; z: number };
type Triangle = [Vertex, Vertex, Vertex];
type ProcessParams = {
  density: number;
  layerHeight?: number;
  printSpeed?: number;
  nozzleDiameter?: number;
  infillPercentage?: number;
  wallThickness?: number;
  topBottomThickness?: number;
};
type CalculationResult = {
  dimensions: Vertex;
  geometricVolume: number;
  printedVolume: number;
  surfaceArea: number;
  weight: number;
  printTime: number;
  processingTime: number;
};

/**
 * Processes an STL file and calculates its properties
 * @param {ArrayBuffer} stlData - Binary STL file data
 * @param {ProcessParams} params - Calculation parameters
 * @returns {Promise<CalculationResult>} Calculated properties
 */
export default async function processSTLFile(
  stlData: ArrayBuffer,
  params: ProcessParams
): Promise<CalculationResult> {
  const startTime = getPerformanceNow();
  
  // Parse STL and validate
  const triangles = parseSTL(stlData);
  if (triangles.length === 0) {
    throw new Error('No valid triangles found in STL file');
  }

  // Perform calculations
  const geometricVolume = calculateVolume(triangles);
  const surfaceArea = calculateSurfaceArea(triangles);
  const bbox = calculateBoundingBox(triangles);
  
  // Calculate printed volume and weight
  const printedVolume = calculatePrintedVolume(
    geometricVolume,
    surfaceArea,
    bbox,
    params
  );
  const weight = printedVolume * params.density;
  
  // Estimate print time
  const printTime = estimatePrintTime(printedVolume, params);
  
  return {
    dimensions: bbox.size,
    geometricVolume,
    printedVolume,
    surfaceArea,
    weight,
    printTime,
    processingTime: getPerformanceNow() - startTime
  };
}

// Helper functions
function parseSTL(data: ArrayBuffer): Triangle[] {
  try {
    return parseBinarySTL(data);
  } catch (e) {
    return parseASCIISTL(data);
  }
}

function parseBinarySTL(data: ArrayBuffer): Triangle[] {
  if (data.byteLength < 84) throw new Error('Invalid binary STL: File too small');
  
  const dv = new DataView(data);
  const triangleCount = dv.getUint32(80, true);
  
  // Validate file size
  const expectedSize = 84 + triangleCount * 50;
  if (data.byteLength < expectedSize) {
    throw new Error(
      `Invalid binary STL: Expected ${expectedSize} bytes, got ${data.byteLength}`
    );
  }

  const triangles: Triangle[] = [];
  let offset = 84;

  for (let i = 0; i < triangleCount; i++) {
    offset += 12;  // Skip normal
    
    const vertices: Vertex[] = [];
    for (let j = 0; j < 3; j++) {
      vertices.push({
        x: dv.getFloat32(offset, true),
        y: dv.getFloat32(offset + 4, true),
        z: dv.getFloat32(offset + 8, true)
      });
      offset += 12;
    }
    
    offset += 2;  // Skip attributes
    triangles.push(vertices as Triangle);
  }
  
  return triangles;
}

function parseASCIISTL(data: ArrayBuffer): Triangle[] {
  const text = new TextDecoder().decode(data);
  const triangles: Triangle[] = [];
  const vertexRegex = /vertex\s+([\d\.\-+eE]+)\s+([\d\.\-+eE]+)\s+([\d\.\-+eE]+)/g;
  let triangleVertices: Vertex[] = [];
  let match;

  while ((match = vertexRegex.exec(text)) !== null) {
    const vertex = {
      x: parseFloat(match[1]),
      y: parseFloat(match[2]),
      z: parseFloat(match[3])
    };
    
    if (isNaN(vertex.x) || isNaN(vertex.y) || isNaN(vertex.z)) {
      throw new Error(`Invalid vertex data: ${match[0]}`);
    }
    
    triangleVertices.push(vertex);
    
    if (triangleVertices.length === 3) {
      triangles.push(triangleVertices as Triangle);
      triangleVertices = [];
    }
  }
  
  return triangles;
}

function calculateVolume(triangles: Triangle[]): number {
  let volume = 0;
  for (const [v0, v1, v2] of triangles) {
    volume += (-v2.x * v1.y * v0.z + 
              v1.x * v2.y * v0.z + 
              v2.x * v0.y * v1.z - 
              v0.x * v2.y * v1.z - 
              v1.x * v0.y * v2.z + 
              v0.x * v1.y * v2.z);
  }
  return Math.abs(volume) / 6000;  // Convert mm³ to cm³
}

function calculateSurfaceArea(triangles: Triangle[]): number {
  let surfaceArea = 0;
  for (const [v0, v1, v2] of triangles) {
    // Calculate vectors for the triangle edges
    const ux = v1.x - v0.x;
    const uy = v1.y - v0.y;
    const uz = v1.z - v0.z;
    
    const vx = v2.x - v0.x;
    const vy = v2.y - v0.y;
    const vz = v2.z - v0.z;
    
    // Calculate cross product
    const cx = uy * vz - uz * vy;
    const cy = uz * vx - ux * vz;
    const cz = ux * vy - uy * vx;
    
    // Area is half the magnitude of the cross product
    surfaceArea += Math.sqrt(cx*cx + cy*cy + cz*cz) / 2;
  }
  return surfaceArea;  // in mm²
}

function calculateBoundingBox(triangles: Triangle[]): { min: Vertex; max: Vertex; size: Vertex } {
  const min: Vertex = { x: Infinity, y: Infinity, z: Infinity };
  const max: Vertex = { x: -Infinity, y: -Infinity, z: -Infinity };

  for (const triangle of triangles) {
    for (const vertex of triangle) {
      min.x = Math.min(min.x, vertex.x);
      min.y = Math.min(min.y, vertex.y);
      min.z = Math.min(min.z, vertex.z);
      max.x = Math.max(max.x, vertex.x);
      max.y = Math.max(max.y, vertex.y);
      max.z = Math.max(max.z, vertex.z);
    }
  }

  return {
    min,
    max,
    size: {
      x: max.x - min.x,
      y: max.y - min.y,
      z: max.z - min.z
    }
  };
}

function calculatePrintedVolume(
  geometricVolume: number,  // in cm³
  surfaceArea: number,      // in mm²
  bbox: { size: Vertex },
  params: ProcessParams
): number {
  // Set defaults
  const wallThickness = params.wallThickness ?? 0.8;         // mm (2 perimeters)
  const topBottomThickness = params.topBottomThickness ?? 0.8; // mm (4 layers)
  const infillPercentage = params.infillPercentage ?? 0.2;

  // Validate parameters
  if (wallThickness <= 0) throw new Error('Wall thickness must be positive');
  if (topBottomThickness <= 0) throw new Error('Top/bottom thickness must be positive');
  if (infillPercentage < 0 || infillPercentage > 1) {
    throw new Error('Infill percentage must be between 0 and 1');
  }

  // Calculate shell volumes (convert to cm³)
  const wallVolume = (surfaceArea * wallThickness) / 1000;  // mm³ → cm³
  const topBottomArea = bbox.size.x * bbox.size.y;          // mm²
  const topBottomVolume = (topBottomArea * topBottomThickness) / 1000; // mm³ → cm³

  // Calculate core volume (excluding walls and top/bottom)
  const coreVolume = Math.max(0, geometricVolume - wallVolume - topBottomVolume);
  const infillVolume = coreVolume * infillPercentage;

  return wallVolume + topBottomVolume + infillVolume;
}

function estimatePrintTime(
  printedVolume: number,  // in cm³
  params: ProcessParams
): number {
  // Set defaults
  const layerHeight = params.layerHeight ?? 0.2;    // mm
  const printSpeed = params.printSpeed ?? 50;       // mm/s
  const nozzleDiameter = params.nozzleDiameter ?? 0.4; // mm

  // Validate parameters
  if (layerHeight <= 0) throw new Error('Layer height must be positive');
  if (printSpeed <= 0) throw new Error('Print speed must be positive');
  if (nozzleDiameter <= 0) throw new Error('Nozzle diameter must be positive');

  // Volumetric flow rate (mm³/s)
  const flowRate = nozzleDiameter * layerHeight * printSpeed;
  
  // Convert printed volume to mm³ and calculate time
  return (printedVolume * 1000) / flowRate;  // seconds
}
