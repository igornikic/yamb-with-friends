import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../../socket";
import { toast } from "react-toastify";

import "./AllLobbiesList.css";

interface User {
  _id: string;
  name: string;
  color: string;
}

interface Lobby {
  _id: string;
  name: string;
  lobbySize: number;
  currentLobbySize: number;
  users: User[];
}

const AllLobbiesList = () => {
  const navigate = useNavigate();
  const [lobbies, setLobbies] = useState<Lobby[]>([]);
  const user = JSON.parse(localStorage.getItem("user") || "");
  const userId = user._id || "";

  useEffect(() => {
    const handleUpdateLobbies = (lobbies: Lobby[]) => {
      console.log("Received lobbies:", lobbies);
      setLobbies(lobbies);
      console.log(lobbies);
    };

    socket.emit("getOnlineLobbies");
    socket.on("updateLobbies", handleUpdateLobbies);

    return () => {
      socket.off("updateLobbies");
    };
  }, []);

  const handleJoinLobby = (lobbyId: string) => {
    // If disconnected, go back
    if (!userId) {
      navigate("/");
      return;
    }

    socket.emit(
      "joinLobby",
      { userId, lobbyId },
      (response: { success: boolean; message?: string }) => {
        if (response.success) {
          navigate(`/game/${lobbyId}`);
          localStorage.setItem("JoinedLobby", JSON.stringify(lobbyId));
        } else {
          toast.error(`${response.message}`);
        }
      }
    );
  };

  return (
    <div>
      <h2>All Lobbies List</h2>
      <div className="lobby-container">
        {lobbies.map((lobby) => (
          <div key={lobby._id} className="lobby">
            {/* Lobby details */}
            <h3>
              {lobby.name}
              <div>
                {lobby.currentLobbySize}/{lobby.lobbySize}
              </div>
            </h3>
            <ol className="users-list">
              {/* List of users in lobby */}
              {lobby.users &&
                lobby.users.map((user) => (
                  <li key={user?._id} style={{ color: user.color }}>
                    {user.name}
                  </li>
                ))}
            </ol>
            <div className="join-container">
              {/* Join button */}
              <button onClick={() => handleJoinLobby(lobby._id)}>Join</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllLobbiesList;
