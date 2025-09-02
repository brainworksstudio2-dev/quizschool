"use client";

import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { AlertCircle, Video, VideoOff } from 'lucide-react';

export function ProctoringWindow() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;
    const enableCamera = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            setError("Camera access is not supported by your browser.");
            return;
        }
        stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsCameraOn(true);
        }
      } catch (err) {
        console.error("Error accessing camera: ", err);
        setError("Camera access denied. Please allow camera access to continue.");
        setIsCameraOn(false);
      }
    };

    enableCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <Card className="w-48 h-36 overflow-hidden relative shadow-md bg-card">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover transition-opacity duration-500 ${isCameraOn ? 'opacity-100' : 'opacity-0'}`}
      />
      <div className="absolute inset-0 flex items-center justify-center bg-card/50">
        {error ? (
          <div className="p-2 text-center text-destructive-foreground bg-destructive/80 rounded-md">
            <AlertCircle className="w-6 h-6 mx-auto mb-1" />
            <p className="text-xs">{error}</p>
          </div>
        ) : !isCameraOn ? (
           <div className="text-center text-muted-foreground">
            <Video className="w-8 h-8 mx-auto animate-pulse" />
            <p className="text-xs mt-1">Starting camera...</p>
           </div>
        ) : null}
      </div>
      <div className={`absolute top-2 right-2 p-1 rounded-full ${isCameraOn ? 'bg-green-500/80' : 'bg-red-500/80'}`}>
        {isCameraOn ? <Video className="w-3 h-3 text-white" /> : <VideoOff className="w-3 h-3 text-white" />}
      </div>
    </Card>
  );
}
