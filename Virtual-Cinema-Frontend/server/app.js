// NODE JS
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const users = {};
const socketToRoom = {};

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: ["http://localhost:3000", "https://vc.hojaeyoon.com"] },
});

const playBack = io.of("/playback");
const videoCall = io.of("/videoCall");

// socket session id middleware
io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.username = username;
  next();
});

playBack.on("connection", (socket) => {
  console.log("[connection]\t", socket.id);

  socket.on("join-group", (groupID) => {
    socket.join(groupID);
    console.log("[join]\t", groupID);
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("leave", { message: `USER ${socket.id} left` });
  });

  socket.on("video-control", (req) => {
    socket.broadcast.to(req.groupId).emit("video-sync", req);
  });

  socket.on("reaction", (req) => {
    socket.broadcast.to(req.groupId).emit('reaction-sync', req);
  });
});

videoCall.on("connection", (socket) => {
  socket.on("join room", (roomID) => {
    if (users[roomID]) {
      const length = users[roomID].length;
      if (length === 4) {
        socket.emit("room full");
        return;
      }
      users[roomID].push(socket.id);
    } else {
      users[roomID] = [socket.id];
    }
    socketToRoom[socket.id] = roomID;
    const usersInThisRoom = users[roomID].filter((id) => id !== socket.id);
    socket.emit("all users", usersInThisRoom);
  });

  socket.on("sending signal", (payload) => {
    videoCall.to(payload.userToSignal).emit("user joined", {
      signal: payload.signal,
      callerID: payload.callerID,
    });
  });

  socket.on("returning signal", (payload) => {
    videoCall.to(payload.callerID).emit("receiving returned signal", {
      signal: payload.signal,
      id: socket.id,
    });
  });

  socket.on("disconnect", () => {
    const roomID = socketToRoom[socket.id];
    let room = users[roomID];
    if (room) {
      room = room.filter((id) => id !== socket.id);
      users[roomID] = room;
    }
  });
});

server.listen(4000, () => {
  console.log("listening on *:4000");
});
