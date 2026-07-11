"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

export type CameraHandle = {
  capture: () => string | null;
};

const Camera = forwardRef<CameraHandle>((_, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    let mounted = true;

    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
          },
          audio: false,
        });

        if (!mounted) return;

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Camera error:", err);
      }
    }

    startCamera();

    return () => {
      mounted = false;

      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useImperativeHandle(ref, () => ({
    capture() {
      if (!videoRef.current || !canvasRef.current) {
        return null;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");

      if (!ctx) return null;

      // Draw mirrored image so saved photo matches preview
      ctx.save();
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      ctx.restore();

      return canvas.toDataURL("image/png");
    },
  }));

  return (
    <>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="h-[420px] w-full rounded-3xl border-4 border-sky-200 bg-black object-cover shadow-lg"
        style={{
          transform: "scaleX(-1)",
        }}
      />

      <canvas
        ref={canvasRef}
        className="hidden"
      />
    </>
  );
});

Camera.displayName = "Camera";

export default Camera;