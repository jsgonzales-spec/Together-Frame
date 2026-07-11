"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getSocket } from "@/lib/socket";
import Camera, { CameraHandle } from "@/components/camera/Camera";
import PhotoStrip from "../../components/photostrip/PhotoStrip";

type User = {
  id: string;
  username: string;
  ready: boolean;
};

function RoomContent() {
  const searchParams = useSearchParams();

  const roomId = searchParams.get("id");
  const username = searchParams.get("username") || "Guest";

  const cameraRef = useRef<CameraHandle>(null);

  const [users, setUsers] = useState<User[]>([]);
  const [countdown, setCountdown] = useState<number | null>(null);

  const [myPhoto, setMyPhoto] = useState<string | null>(null);
  const [partnerPhoto, setPartnerPhoto] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const partner = users.find((user) => user.username !== username);
  const partnerUsername = partner?.username ?? "Partner";


  useEffect(() => {
    if (!roomId) return;

    const socket = getSocket();


    socket.emit("join-room", {
      roomId,
      username,
    });


    const handleUsers = (list: User[]) => {
      setUsers(list);
    };


    const handleCountdown = () => {

      let count = 5;

      setCountdown(count);


      const timer = setInterval(() => {

        count--;


        if (count <= 0) {

          clearInterval(timer);

          setCountdown(null);


          const image = cameraRef.current?.capture();


          if (image) {

            setMyPhoto(image);


            socket.emit(
              "photo-captured",
              {
                roomId,
                image,
              }
            );

          }


          return;
        }


        setCountdown(count);


      }, 1000);

    };


    const handlePartnerPhoto = ({
      image,
    }: {
      image: string;
    }) => {

      setPartnerPhoto(image);

    };


    socket.on(
      "room-users",
      handleUsers
    );


    socket.on(
      "start-countdown",
      handleCountdown
    );


    socket.on(
      "partner-photo",
      handlePartnerPhoto
    );


    return () => {

      socket.off(
        "room-users",
        handleUsers
      );


      socket.off(
        "start-countdown",
        handleCountdown
      );


      socket.off(
        "partner-photo",
        handlePartnerPhoto
      );

    };


  }, [roomId, username]);



  const copyRoomId = async () => {
    if (!roomId) return;

    try {
      await navigator.clipboard.writeText(roomId);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      alert("Failed to copy Room ID.");
    }
  };

  const copyInviteLink = async () => {
    if (!roomId) return;

    const inviteLink = `${window.location.origin}/?id=${roomId}`;

    try {
      await navigator.clipboard.writeText(inviteLink);

      setLinkCopied(true);

      setTimeout(() => {
        setLinkCopied(false);
      }, 2000);
    } catch {
      alert("Failed to copy invite link.");
    }
  };






  const toggleReady = () => {

    if (!roomId) return;


    const socket = getSocket();


    const me = users.find(
      (u) => u.username === username
    );


    socket.emit(
      "set-ready",
      {
        roomId,
        ready: !(me?.ready ?? false),
      }
    );

  };



  return (

    <main className="min-h-screen bg-gradient-to-br from-sky-100 via-blue-50 to-cyan-100 px-6 py-10">


      {countdown !== null && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">

          <h1 className="animate-pulse text-9xl font-bold text-white">

            {countdown}

          </h1>

        </div>

      )}



      <div className="mx-auto max-w-5xl">

        <div className="text-center">

          <h1 className="text-5xl font-bold text-sky-600">
            💙 TogetherFrame
          </h1>

          <p className="mt-2 text-slate-600">
            One moment. Two hearts. One memory.
          </p>

          <div className="mt-4 flex flex-col items-center gap-3">

            <p className="text-sm text-slate-500">
              Room ID:
              <span className="ml-2 font-semibold text-sky-600">
                {roomId}
              </span>
            </p>

            <div className="flex gap-3">

              <button
                onClick={copyRoomId}
                className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600"
              >
                📋 Copy ID
              </button>

              <button
                onClick={copyInviteLink}
                className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-600"
              >
                🔗 Invite Link
              </button>

            </div>

            {copied && (
              <p className="text-sm font-medium text-green-600">
                ✅ Room ID copied!
              </p>
            )}

            {linkCopied && (
              <p className="text-sm font-medium text-green-600">
                ✅ Invite link copied!
              </p>
            )}

          </div>

        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">

          <div className="rounded-3xl bg-white p-6 shadow-xl">

            <h2 className="mb-4 text-xl font-bold text-sky-600">
              📷 Camera
            </h2>

            <Camera ref={cameraRef} />

          </div>

          <div className="rounded-3xl bg-white p-6 shadow-xl">

            <h2 className="text-xl font-bold text-sky-600">
              💙 Participants
            </h2>

            <div className="mt-4 space-y-3">

              {users.map((user) => (

                <div
                  key={user.id}
                  className="flex justify-between rounded-xl border border-sky-200 bg-sky-50 px-4 py-3"
                >

                  <span className="font-medium text-slate-800">
                    💙 {user.username}
                  </span>

                  <span>
                    {user.ready
                      ? "🟢 Ready"
                      : "🔴 Not Ready"}
                  </span>

                </div>

              ))}

            </div>

            <button
              onClick={toggleReady}
              className="mt-6 w-full rounded-2xl bg-sky-500 py-3 font-semibold text-white hover:bg-sky-600"
            >
              💙 I'm Ready
            </button>

          </div>

        </div>




        {myPhoto && partnerPhoto && (
          <div className="mt-10 flex justify-center">
            <PhotoStrip
              myPhoto={myPhoto}
              partnerPhoto={partnerPhoto}
              username={username}
              partnerName={partnerUsername}
            />
          </div>
        )}



      </div>


    </main>
  );
}

export default function RoomPage() {
  return (
    <Suspense fallback={null}>
      <RoomContent />
    </Suspense>
  );
}