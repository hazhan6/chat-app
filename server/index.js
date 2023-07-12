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

// Store user lists and chat history in memory
let activeUsers = [];
let previousUsers = [];
let chatHistory = [];

io.on("connect", (socket) => {
  // User logging
  socket.on("login", (userId) => {
    // Add the user to active users
    const user = { id: socket.id, userId };
    activeUsers.push(user);

    // Send the user the list of users
    socket.emit("chatHistory", chatHistory);

    // Send the user the previous user list
    socket.emit("previousUsers", previousUsers);

    // Notify all clients to update the list of active users
    io.emit("activeUsers", activeUsers);
  });

  // User joining room
  socket.on("room", (data) => {
    socket.join(data);
  });

  // Send a message
  socket.on("message", (data) => {
    // Send the message to all sockets in the room
    socket.to(data.room).emit("messageReturn", data);

    // Add the message to the chat history
    chatHistory.push(data);
  });

  // Disconnecting from the server
  socket.on("disconnect", () => {
    // Add the user to the previous users list
    const disconnectedUser = activeUsers.find((user) => user.id === socket.id);
    if (disconnectedUser && !previousUsers.includes(disconnectedUser.userId)) {
      previousUsers.push(disconnectedUser);
      io.emit("previousUsers", previousUsers);
    }

    // Remove the user from active users
    activeUsers = activeUsers.filter((user) => user.id !== socket.id);

    // Notify all clients to update the list of active users
    io.emit("activeUsers", activeUsers);
  });
});

server.listen(5000, () => {
  console.log("Server is running on port:5000");
});
