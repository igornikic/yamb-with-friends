import OnlineUsers from "../user/OnlineUsers";
import CreateLobby from "./CreateLobby";
import AllLobbiesList from "./AllLobbiesList";

const Lobby = () => {
  return (
    <div>
      <h1>🎲 Lobby 🎲</h1>
      <CreateLobby />
      <AllLobbiesList />
      <OnlineUsers />
    </div>
  );
};

export default Lobby;
