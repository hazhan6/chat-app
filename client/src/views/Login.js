import React from "react";
import { Link } from "react-router-dom";
import "./Login.css";

const Login = ({
  setIsUserLoggedIn,
  socket,
  userName,
  setUserName,
  roomId,
}) => {
  const handleUserNameChange = (event) => {
    setUserName(event.target.value);
  };

  const handleStartChat = () => {
    socket.emit("room", roomId);
    setIsUserLoggedIn(true);
  };

  return (
    <div className="login-container">
      <div className="login-inner-container">
        <h1 className="title">Welcome to Chat App</h1>
        <input
          type="text"
          placeholder="Username"
          value={userName}
          onChange={handleUserNameChange}
          className="username-input-field"
        />
        <Link to="/" className="enter-chat-button" onClick={handleStartChat}>
          Lets Chat!
        </Link>
      </div>
    </div>
  );
};

export default Login;
