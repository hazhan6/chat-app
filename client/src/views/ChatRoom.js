import React, { useEffect, useState, useRef } from "react";
import "./ChatRoom.css";
import UserListPage from "./UserList";

const ChatRoom = ({ socket, roomId, userName }) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on("messageReturn", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("messageReturn");
    };
  }, [socket]);

  useEffect(() => {
    socket.on("chatHistory", (data) => {
      setChatHistory(data);
    });

    return () => {
      socket.off("chatHistory");
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, chatHistory]);

  const handleNewMessageChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = async () => {
    let hour = new Date().getHours();
    let minute = new Date().getMinutes();
    const messageContent = {
      userName: userName,
      message: newMessage,
      room: roomId,
      date:
        (hour < 10 ? "0" + hour : hour) +
        ":" +
        (minute < 10 ? "0" + minute : minute),
    };
    await socket.emit("message", messageContent);
    setMessages((prev) => [...prev, messageContent]);
    setNewMessage("");
  };

  const scrollToBottom = () => {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="chat-room-container">
      <div className="user-list-page">
        <UserListPage socket={socket} />
      </div>
      <div className="chat-room-inner-container">
        <div className="message-container-header">
          <div className="message-inner-container-header"></div>
          <div className="message-inner-container-title">Chat Room</div>
        </div>
        <div className="message-container">
          {chatHistory &&
            chatHistory.map((message, index) => (
              <div
                className={`${
                  message.userName === userName
                    ? "message-sent-container"
                    : "message-received"
                }`}
                key={index}
              >
                <div
                  className={`${
                    message.userName === userName ? "message-sent" : ""
                  }`}
                >
                  <div>{message.message}</div>
                  <div className="message-sender">
                    {(message.userName !== userName ? message.userName : "") +
                      " " +
                      message.date}
                  </div>
                </div>
              </div>
            ))}
          {messages &&
            messages.map((message, index) => (
              <div
                className={`${
                  message.userName === userName
                    ? "message-sent-container"
                    : "message-received"
                }`}
                key={index}
              >
                <div
                  className={`${
                    message.userName === userName ? "message-sent" : ""
                  }`}
                >
                  <div>{message.message}</div>
                  <div className="message-sender">
                    {(message.userName !== userName ? message.userName : "") +
                      " " +
                      message.date}
                  </div>
                </div>
              </div>
            ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="message-send-container">
          <input
            className="message-input"
            type="text"
            placeholder="Message"
            value={newMessage}
            onChange={handleNewMessageChange}
          />
          <button className="message-button" onClick={handleSendMessage}>
            SEND
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
