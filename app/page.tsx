"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

function HomeContent() {
  const [username, setUsername] = useState("");
  const [roomId, setRoomId] = useState("");

  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get("id");

    if (id) {
      setRoomId(id);
    }
  }, [searchParams]);

  const createRoom = () => {
    if (!username.trim()) {
      alert("Please enter your name.");
      return;
    }

    const id = Math.random().toString(36).substring(2, 8);

    window.location.href = `/room?id=${id}&username=${encodeURIComponent(
      username
    )}`;
  };

  const joinRoom = () => {
    if (!username.trim()) {
      alert("Please enter your name.");
      return;
    }

    if (!roomId.trim()) {
      alert("Please enter a room ID.");
      return;
    }

    window.location.href = `/room?id=${roomId}&username=${encodeURIComponent(
      username
    )}`;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-100 flex items-center justify-center px-6">
      <Card>
        <div className="w-[360px] space-y-6">

          <div className="text-center">
            <h1 className="text-4xl font-bold text-sky-600">
              💙 TogetherFrame
            </h1>

            <p className="mt-2 text-slate-600">
              One moment. Two hearts. One photo.
            </p>
          </div>

          <Input
            label="Your Name"
            placeholder="e.g. Julia"
            value={username}
            onChange={setUsername}
          />

          <Button onClick={createRoom}>
            Create Room
          </Button>

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-sky-200" />
            <span className="text-sm text-slate-500">
              OR
            </span>
            <div className="h-px flex-1 bg-sky-200" />
          </div>

          <Input
            label="Room ID"
            placeholder="Enter room ID"
            value={roomId}
            onChange={setRoomId}
          />

          <Button
            variant="secondary"
            onClick={joinRoom}
          >
            Join Room
          </Button>

          <p className="text-center text-xs text-slate-500">
            Works on Windows • macOS • Android • iPhone • Tablets
          </p>

        </div>
      </Card>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}