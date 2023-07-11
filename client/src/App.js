import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { io } from "socket.io-client";
import Login from "./views/Login";
import ChatRoom from "./views/ChatRoom";

const socket = io.connect("http://localhost:5000");

function App() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const roomId = 1223334444;

  return (
    <Router>
      <Routes>
        {isUserLoggedIn ? (
          <Route
            exact
            path="/"
            element={
              <ChatRoom socket={socket} roomId={roomId} userName={userName} />
            }
          />
        ) : (
          <Route
            exact
            path="/"
            element={
              <Login
                setIsUserLoggedIn={setIsUserLoggedIn}
                socket={socket}
                roomId={roomId}
                userName={userName}
                setUserName={setUserName}
              />
            }
          />
        )}
      </Routes>
    </Router>
  );
}

export default App;
