import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import Dice from "../dice/Dice";
import Board from "../board/Board";
import socket from "../../socket";
import { toast } from "react-toastify";
import "./Game.css";

interface IUser {
  _id: string;
  name: string;
  color?: string;
}

interface IMessage {
  user: IUser;
  message: string;
}

interface ILobbyStatus {
  currentLobbySize: number;
  currentTurnIndex: number;
  lobbySize: number;
  name: string;
  turnOrder: string[];
  users: IUser[];
  _id: string;
}

interface IChatState {
  toggleChat: boolean;
  messages: IMessage[];
  newMessage: string;
}

const initialLobbyStatus: ILobbyStatus = {
  currentLobbySize: 0,
  currentTurnIndex: 0,
  lobbySize: 0,
  name: "",
  turnOrder: [],
  users: [],
  _id: "",
};

const initialChatState: IChatState = {
  toggleChat: false,
  messages: [],
  newMessage: "",
};

interface GameStateRes {
  success: boolean;
  message?: string;
  state?: { [key: string]: { [userId: string]: any } };
  boardState?: any;
}

const Game: React.FC = () => {
  const lobbyId = JSON.parse(localStorage.getItem("JoinedLobby") || "");
  const user: IUser = JSON.parse(localStorage.getItem("user") || "");
  const userId = user._id || "";

  const [userGameState, setUserGameState] = useState<(number | null)[][]>([]);
  const [clickedCell, setClickedCell] = useState<
    [number | null, number | null]
  >([null, null]); // Lifted state

  const [chat, setChat] = useState<IChatState>(initialChatState);

  const { toggleChat, messages, newMessage } = chat;

  const [lobbyStatus, setLobbyStatus] = useState(initialLobbyStatus);
  const [diceStates, setDiceStates] = useState(
    Array(6).fill({ value: null, rolling: false, rotation: "", locked: false })
  );
  const [displayedRollCount, setDisplayedRollCount] = useState(0);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [boardData, setBoardData] = useState(
    Array(16)
      .fill({ length: 16 })
      .map(() => Array(6).fill(null))
  );

  const [suggestions, setSuggestions] = useState(
    Array(16)
      .fill({ length: 16 })
      .map(() => Array(6).fill(null))
  );

  const [waiting, setWaiting] = useState(true);
  const [playerTurn, setPlayerTurn] = useState("");

  const isMounting = useRef(true);

  useEffect(() => {
    if (isMounting.current) {
      isMounting.current = false;
      return;
    }

    const handleLobbyDetails = (lobby: ILobbyStatus) => {
      setLobbyStatus(lobby);
      if (lobby.currentLobbySize >= lobby.lobbySize) {
        setWaiting(false);
      }
    };

    const handleTurnChange = ({ currentTurn }: { currentTurn: string }) => {
      if (currentTurn === userId) {
        setIsMyTurn(true);
        toast("It's your turn !");
      } else {
        setIsMyTurn(false);
      }

      setLobbyStatus((prevState) => {
        const currentPlayer = prevState.users.find(
          (user) => user._id === currentTurn
        );
        setPlayerTurn(currentPlayer ? currentPlayer.name : "");
        return { ...prevState, currentTurn };
      });
    };

    const handleSuggestions = (suggestedMoves: (number | null)[][]) => {
      setSuggestions(suggestedMoves);
    };

    const handleReceiveMessage = (message: IMessage) => {
      console.log(message);
      setChat((prevChat) => ({
        ...prevChat,
        messages: [...prevChat.messages, message],
      }));
    };

    socket.on("lobbyDetails", handleLobbyDetails);
    socket.on("turnChange", handleTurnChange);
    socket.on("suggestions", handleSuggestions);
    socket.on("receiveMessage", handleReceiveMessage);

    socket.emit("getLobbyDetails", lobbyId);

    return () => {
      socket.off("lobbyDetails", handleLobbyDetails);
      socket.off("turnChange", handleTurnChange);
      socket.off("suggestions", handleSuggestions);
      socket.off("receiveMessage", handleReceiveMessage);
      socket.emit("leaveRoom", { lobbyId, userId });
    };
  }, [userId, lobbyId]);

  const getUserGameState = (userId: string) => {
    socket.emit(
      "getGameState",
      { userId, lobbyId },
      (response: GameStateRes) => {
        if (response.success) {
          console.log(response);
          setUserGameState(response.boardState);
        } else {
          toast.error(`${response.message}`);
        }
      }
    );
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== "") {
      socket.emit("sendMessage", {
        lobbyId: lobbyId,
        message: newMessage,
        user: user,
      });
      setChat((prevChat) => ({
        ...prevChat,
        newMessage: "",
      }));
    }
  };

  const toggleChatState = () => {
    setChat((prevChat) => ({
      ...prevChat,
      toggleChat: !prevChat.toggleChat,
    }));
  };

  const handleNewMessageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setChat((prevChat) => ({
      ...prevChat,
      newMessage: value,
    }));
  };
  return (
    <div className="game-container">
      {waiting ? (
        <div className="waiting-for-players">
          <h1>
            Waiting for players {lobbyStatus.currentLobbySize}/
            {lobbyStatus.lobbySize}
            <span className="dot-pulse"></span>
            <span className="dot-pulse"></span>
            <span className="dot-pulse"></span>
          </h1>
        </div>
      ) : (
        <>
          <Board
            boardData={boardData}
            setBoardData={setBoardData}
            isMyTurn={isMyTurn}
            suggestions={suggestions}
            displayedRollCount={displayedRollCount}
            clickedCell={clickedCell}
            setClickedCell={setClickedCell}
          />
          <Dice
            diceStates={diceStates}
            setDiceStates={setDiceStates}
            displayedRollCount={displayedRollCount}
            setDisplayedRollCount={setDisplayedRollCount}
            isMyTurn={isMyTurn}
            boardData={boardData}
            clickedCell={clickedCell}
          />

          <div>Turn: {playerTurn}</div>

          <div>Players:</div>
          <div>
            {lobbyStatus?.users.map((user) => (
              <button key={user._id} onClick={() => getUserGameState(user._id)}>
                {user.name}
              </button>
            ))}
          </div>

          {toggleChat ? (
            <div className="chat on">
              <div onClick={toggleChatState}>Chat</div>
              <div className="chat-container">
                <div className="messages">
                  {messages.map((msg, index) => (
                    <div key={index}>
                      <span style={{ color: msg.user.color }}>
                        {msg.user.name}:{" "}
                      </span>
                      {msg.message}
                    </div>
                  ))}
                </div>
                <div className="send-message">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={handleNewMessageChange}
                    placeholder="Enter Message"
                  />
                  <svg
                    onClick={handleSendMessage}
                    xmlns="http://www.w3.org/2000/svg"
                    width="42"
                    height="42"
                    fill="currentColor"
                    className="bi bi-arrow-right-circle-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M0 14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2a2 2 0 0 0-2 2zm4.5-6.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5a.5.5 0 0 1 0-1" />
                  </svg>
                </div>
              </div>
            </div>
          ) : (
            <div className="chat" onClick={toggleChatState}>
              Chat
            </div>
          )}
          <div>
            <h2>User Game State</h2>
            <table>
              <tbody>
                {userGameState.map(
                  (row: (number | null)[], rowIndex: number) => (
                    <tr key={rowIndex}>
                      {row.map((cell: number | null, cellIndex: number) => (
                        <td key={cellIndex}>{cell !== null ? cell : ""}</td>
                      ))}
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Game;
