import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Settings from "./components/settings/Settings";
import Game from "./components/game/Game";
import Lobby from "./components/lobby/Lobby";
import CreateUser from "./components/user/CreateUser";

function App() {
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      const message =
        "You have unsaved changes. Are you sure you want to leave?";
      event.returnValue = message;
      return message;
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);
  return (
    <Router>
      <Settings />
      <Routes>
        <Route path="/" element={<CreateUser />} />
        <Route path="/game/:id" element={<Game />} />
        <Route path="/lobbys" element={<Lobby />} />
      </Routes>
    </Router>
  );
}

export default App;
