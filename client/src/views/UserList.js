import React, { useState, useEffect } from "react";
import "./UserList.css";

const UserListPage = ({ socket }) => {
  const [activeUsers, setActiveUsers] = useState([]);
  const [previousUsers, setPreviousUsers] = useState([]);

  useEffect(() => {
    socket.on("activeUsers", (users) => {
      setActiveUsers(users);
    });

    socket.on("previousUsers", (users) => {
      setPreviousUsers(users);
    });

    return () => {
      socket.off("activeUsers");
      socket.off("previousUsers");
    };
  }, []);

  return (
    <div className="user-list-container">
      <div className="user-list-container-inner">
        <h1 className="title-users">Active Users</h1>
        <ul className="user-list active">
          {activeUsers.map((user) => (
            <li className="user-item" key={user.id}>
              {user.userId}
            </li>
          ))}
        </ul>
        <h1 className="title-users">Previous Users</h1>
        <ul className="user-list previous">
          {previousUsers.map((user) => (
            <li className="user-item" key={user.id}>
              {user.userId}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserListPage;
