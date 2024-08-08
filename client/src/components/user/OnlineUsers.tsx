import { useEffect, useState } from "react";

import socket from "../../socket";

interface User {
  id: number;
  name: string;
  color: string;
}

const OnlineUsers = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const handleUpdateUsers = (users: User[]) => {
      setUsers(users);
    };

    socket.emit("getOnlineUsers");
    socket.on("updateUsers", handleUpdateUsers);

    return () => {
      socket.off("updateUsers");
    };
  }, []);

  return (
    <div>
      <h2>🟢 Online Users</h2>
      <ul>
        {/* Users list */}
        {users.map((user) => (
          <li key={user.name} style={{ color: `${user.color}` }}>
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OnlineUsers;
