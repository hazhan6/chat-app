const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connect", (socket) => {
  socket.on("room", (data) => {
    socket.join(data);
  });

  socket.on("message", (data) => {
    socket.to(data.room).emit("messageReturn", data);
  });
});

server.listen(5000, () => {
  console.log("Server is running on port:5000");
});
