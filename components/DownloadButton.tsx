'use client';

import { Button } from "@/components/ui/button";
import { Download } from 'lucide-react';
import { useState } from 'react';

interface DownloadButtonProps {
  orderId: number;
}

export function DownloadButton({ orderId }: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(`/api/download/${orderId}`);
      
      if (!response.ok) {
        throw new Error('Download failed');
      }

      // Get the filename from the response headers
      const contentDisposition = response.headers.get('content-disposition');
      const filename = contentDisposition?.match(/filename="(.+)"/)?.[1] || `order-${orderId}.stl`;

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={isDownloading}
      size="sm"
      variant="outline"
      className="flex items-center gap-2"
    >
      <Download className="h-4 w-4" />
      {isDownloading ? 'Downloading...' : 'Download STL'}
    </Button>
  );
}