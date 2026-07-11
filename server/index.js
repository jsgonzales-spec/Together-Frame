const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer();

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const PORT = process.env.PORT || 3001;

const rooms = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", ({ roomId, username }) => {
    socket.join(roomId);

    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }

    rooms[roomId] = rooms[roomId].filter(
      (user) => user.id !== socket.id
    );

    rooms[roomId].push({
      id: socket.id,
      username,
      ready: false,
    });

    console.log(`${username} joined room ${roomId}`);

    io.to(roomId).emit("room-users", rooms[roomId]);
  });

  socket.on("set-ready", ({ roomId, ready }) => {
    const room = rooms[roomId];

    if (!room) return;

    const user = room.find(
      (u) => u.id === socket.id
    );

    if (user) {
      user.ready = ready;
    }

    io.to(roomId).emit("room-users", room);

    const everyoneReady =
      room.length >= 2 &&
      room.every((u) => u.ready);

    if (everyoneReady) {
      io.to(roomId).emit("start-countdown");
    }
  });

  socket.on("photo-captured", ({ roomId, image }) => {
    socket.to(roomId).emit("partner-photo", {
      image,
    });
  });

  socket.on("disconnect", () => {
    for (const roomId in rooms) {
      rooms[roomId] = rooms[roomId].filter(
        (user) => user.id !== socket.id
      );

      io.to(roomId).emit("room-users", rooms[roomId]);

      if (rooms[roomId].length === 0) {
        delete rooms[roomId];
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`✅ Socket server running on port ${PORT}`);
});