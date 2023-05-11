import { Server } from "socket.io";

const io = new Server(3001, {
  cors: true,
});

const rooms = {};

io.on("connection", (socket) => {
  socket.on("user:join", ({ room, name }) => {
    const user = { name };
    // creating if not exixt
    if (!rooms[room]) rooms[room] = {};

    socket.emit("user:join", { roomData: rooms[room] });
    rooms[room][socket.id] = user;
    // setting these value to broadcast in room
    socket.join(room);
    socket.room = room;
    socket.name = name;
  });

  socket.on("offer", ({ to, offer }) => {
    io.to(to).emit("offer", { from: socket.id, offer, name: socket.name });
  });

  socket.on("candidate", ({ to, candidate }) => {
    io.to(to).emit("candidate", { from: socket.id, candidate });
  });

  socket.on("answer", ({ to, answer }) => {
    io.to(to).emit("answer", { from: socket.id, answer });
  });

  socket.on("mute", ({ enabledObj }) => {
    io.to(socket.room).emit("mute", { from: socket.id, enabledObj });
  });

  socket.on("message", ({ time, text }) => {
    io.to(socket.room).emit("message", {
      from: socket.id,
      name: socket.name,
      text,
      time,
    });
  });
  socket.on("disconnect", () => {
    try {
      delete rooms[socket.room][socket.id];
      io.to(socket.room).emit("user:leave", { socketId: socket.id });

      if (rooms[socket.room].keys === 0) delete rooms[socket.room];
    } catch (e) {}
  });
});

console.log("SEVER STARTED!");
