"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import { OrbitControls, Environment, useGLTF } from "@react-three/drei"
import { STLLoader } from "three/examples/jsm/loaders/STLLoader"
import type { Mesh } from "three"

interface ModelViewerProps {
  url?: string
  fileName?: string
}

function STLModel({ url }: { url: string }) {
  const meshRef = useRef<Mesh>(null)
  const geometry = useLoader(STLLoader, url)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005
    }
  })

  return (
    <mesh ref={meshRef} geometry={geometry} scale={0.1}>
      <meshStandardMaterial color="#ffffff" />
    </mesh>
  )
}

function GLTFModel({ url }: { url: string }) {
  const { scene } = useGLTF(url)
  const meshRef = useRef<Mesh>(null)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005
    }
  })

  return <primitive ref={meshRef} object={scene} scale={2} />
}

export function ModelViewer({ url, fileName }: ModelViewerProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <div className="w-full h-full bg-muted flex items-center justify-center">Loading model viewer...</div>
  }

  if (!url) {
    // Use the sample duck model if no URL is provided
    url = "/assets/3d/duck.glb"
  }

  const isSTL = (url && url.toLowerCase().endsWith(".stl")) || (fileName && fileName.toLowerCase().endsWith(".stl"))

  return (
    <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
      <pointLight position={[-10, -10, -10]} />

      {isSTL ? <STLModel url={url} /> : <GLTFModel url={url} />}

      <OrbitControls enableZoom={true} />
      <Environment preset="studio" />
    </Canvas>
  )
}
