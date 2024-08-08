import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import socket from "../../socket";
import "./CreateUser.css";

interface LocalUser {
  name: string;
  color: string;
}

interface User {
  _id: string;
  name: string;
  color: string;
}

const CreateUser = () => {
  const clickEffect = new Audio("/button-click-effect.mp3");
  const navigate = useNavigate();
  const [localUser, setLocalUser] = useState<LocalUser>({
    name: "",
    color: "#0000ff",
  });

  useEffect(() => {
    if (socket.connected) {
      socket.disconnect();
      socket.connect();
    }
  }, []);

  const handleCreateUser = () => {
    // Sound effect
    clickEffect.play().catch((error) => {
      console.error("Error playing sound:", error);
    });

    socket.emit(
      "createUser",
      localUser,
      (response: { success: boolean; message?: string; user: User }) => {
        if (response.success) {
          localStorage.setItem("user", JSON.stringify(response.user));

          toast.success(`${response.message}`);
          navigate("/lobbys");
        } else {
          toast.error(`${response.message}`);
        }
      }
    );
  };

  return (
    <div className="create-user-container">
      {/* Name input */}
      <input
        type="text"
        id="name"
        value={localUser.name}
        onChange={(e) => setLocalUser({ ...localUser, name: e.target.value })}
        placeholder="Enter Username"
        autoComplete="username"
        required
      />
      {/* Color input */}
      <input
        type="color"
        id="color"
        value={localUser.color}
        onChange={(e) => setLocalUser({ ...localUser, color: e.target.value })}
      />
      {/* Start button */}
      <button onClick={handleCreateUser}>Start</button>
    </div>
  );
};

export default CreateUser;
