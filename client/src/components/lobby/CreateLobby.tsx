import { useState } from "react";
import socket from "../../socket";
import { toast } from "react-toastify";

interface User {
  id: string;
  name: string;
  color: string;
}

interface Lobby {
  name: string;
  lobbySize: number;
  currentTurnIndex: number;
  currentLobbySize: number;
  users: User[];
}

const CreateLobby = () => {
  const initialLobyState = {
    name: "",
    lobbySize: 1,
    currentTurnIndex: 0,
    currentLobbySize: 0,
    users: [],
  };
  const [lobby, setLobby] = useState<Lobby>(initialLobyState);

  const handleCreateLobby = () => {
    socket.emit(
      "createLobby",
      lobby,
      (response: { success: boolean; message?: string }) => {
        if (response.success) {
          toast.success(`${response.message}`);
          setLobby(initialLobyState);
        } else {
          toast.error(`${response.message}`);
        }
      }
    );
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const size = parseInt(e.target.value, 10);
    setLobby((prevLobby) => ({ ...prevLobby, lobbySize: size }));
  };

  return (
    <div>
      <div>
        {/* Lobby name input */}
        <input
          type="text"
          name="lobbyName"
          value={lobby.name}
          onChange={(e) => setLobby({ ...lobby, name: e.target.value })}
          placeholder="Enter lobby name"
          required
        />
      </div>
      <div>
        {/* Lobby size input */}
        <input
          type="number"
          name="lobbySize"
          value={lobby.lobbySize}
          onChange={handleSizeChange}
          min="1"
          max="100"
          placeholder="Enter lobby size"
          required
        />
      </div>
      {/* Create button */}
      <button onClick={handleCreateLobby}>Create Lobby</button>
    </div>
  );
};

export default CreateLobby;
