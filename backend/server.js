import app from "./app.js";
import { connect } from "./db/index.js";
import { Server } from "socket.io";
import http from "http";

const httpApp = http.createServer(app);

const io = new Server(httpApp, {
  cors: {
    origin: true,
    methods: ["GET", "POST"],
  },
});

const rooms = {};

io.on("connection", (socket) => {
  socket.on("user:join", ({ user, room }) => {
    console.log("new user join!");
    // creating if not exixt
    if (!rooms[room])
      rooms[room] = {
        presenterId: "",
        messages: [],
      };

    socket.emit("user:join", { roomData: rooms[room], socketId: socket.id });
    rooms[room][socket.id] = { ...user, socketId: socket.id };
    // setting these value to broadcast in room
    socket.join(room);
    socket.room = room;
    socket.user = { ...user, socketId: socket.id };
  });

  socket.on("user:board:sharing", () => {
    const room = rooms[socket.room];
    room.presenterId = socket.id;
    room[socket.id].isBoardSharing = true;
    io.to(socket.room).emit("user:board:sharing", { user: socket.user });
    // updating server room
    rooms[socket.room] = room;
  });

  socket.on("user:board:sharing:stop", () => {
    const room = rooms[socket.room];
    room.presenterId = "";
    room[socket.id].isBoardSharing = false;
    io.to(socket.room).emit("user:board:sharing:stop", { user: socket.user });
    // updating server room
    rooms[socket.room] = room;
  });

  socket.on("user:screen:sharing", () => {
    const room = rooms[socket.room];
    room.presenterId = socket.id;
    room[socket.id].isScreenSharing = true;
    io.to(socket.room).emit("user:screen:sharing", { user: socket.user });
    // updating server room
    rooms[socket.room] = room;
  });

  socket.on("user:screen:sharing:stop", () => {
    const room = rooms[socket.room];
    room.presenterId = "";
    room[socket.id].isScreenSharing = false;
    io.to(socket.room).emit("user:screen:sharing:stop", { user: socket.user });
    // updating server room
    rooms[socket.room] = room;
  });

  socket.on("user:video:TurnOn", () => {
    const room = rooms[socket.room];
    room[socket.id].isVideoTurnOn = true;
    io.to(socket.room).emit("user:video:TurnOn", { user: socket.user });
    // updating server room
    rooms[socket.room] = room;
  });

  socket.on("user:video:TurnOff", () => {
    const room = rooms[socket.room];
    room[socket.id].isVideoTurnOn = false;
    io.to(socket.room).emit("user:video:TurnOff", { user: socket.user });
    // updating server room
    rooms[socket.room] = room;
  });

  socket.on("user:audio:TurnOn", () => {
    const room = rooms[socket.room];
    room[socket.id].isAudioTurnOn = true;
    io.to(socket.room).emit("user:audio:TurnOn", { user: socket.user });
    // updating server room
    rooms[socket.room] = room;
  });

  socket.on("user:audio:TurnOff", () => {
    const room = rooms[socket.room];
    room[socket.id].isAudioTurnOn = false;
    io.to(socket.room).emit("user:audio:TurnOff", { user: socket.user });
    // updating server room
    rooms[socket.room] = room;
  });

  socket.on("user:speech:notAvailable", () => {
    const room = rooms[socket.room];
    room[socket.id].isCaptionAvailable = false;
    // updating server room
    rooms[socket.room] = room;
  });

  socket.on("user:transcript", ({ transcript }) => {
    console.log("send captions");
    io.to(socket.room).emit("user:transcript", {
      user: socket.user,
      transcript,
    });
  });

  socket.on("disconnect", () => {
    const room = rooms[socket.room];
    room[socket.id] && delete room[socket.id];
    io.to(socket.room).emit("user:room:leave", { user: socket.user });
    // updating server room
    rooms[socket.room] = room;
    // removing room if all user leave
  });

  // socket.on("offer", ({ to, offer }) => {
  //   io.to(to).emit("offer", { from: socket.id, offer });
  // });

  // socket.on("candidate", ({ to, candidate }) => {
  //   io.to(to).emit("candidate", { from: socket.id, candidate });
  // });

  // socket.on("answer", ({ to, answer }) => {
  //   io.to(to).emit("answer", { from: socket.id, answer });
  // });

  // socket.on("mute", ({ enabledObj }) => {
  //   io.to(socket.room).emit("mute", { from: socket.id, enabledObj });
  // });

  // socket.on("message", ({ time, text }) => {
  //   io.to(socket.room).emit("message", {
  //     from: socket.id,
  //     name: socket.name,
  //     text,
  //     time,
  //   });
  // });

  // socket.on("disconnect", () => {
  //   try {
  //     console.log("user Disconnet");
  //   } catch (e) {}
  // });
});

// port
const port = process.env.PORT || 3002;
httpApp.listen(port, (err) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(`Server listening on ${port}`);
  connect();
});
