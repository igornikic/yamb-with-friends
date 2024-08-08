import { Server } from "socket.io";
import { ILobby } from "../models/types";
import { customSocket, onlineLobbies, gameStates } from "../utils/constants";
import { data, suggestMove } from "../utils/rules";
import { countSums } from "../utils/countSums";

type GameCallback = (response: {
  success: boolean;
  message?: string;
  state?: { [key: string]: { [userId: string]: any } };
  boardState?: (number | null)[][];
}) => void;

interface DiceRolledArgs {
  lobbyId: string;
  userId: string;
  diceValues: number[];
  rollCount: number;
  boardData: (number | null)[][];
  clickedCell: [number | null, number | null];
}

interface PlayerActionArgs {
  lobbyId: string;
  userId: string;
  newBoardData: (number | null)[][];
}

// Function to rotate turns in a lobby
export const nextTurn = (lobby: ILobby, io: Server) => {
  const totalPlayers = lobby.turnOrder.length;
  if (totalPlayers > 0) {
    lobby.currentTurnIndex = (lobby.currentTurnIndex + 1) % totalPlayers;

    io.to(lobby.id).emit("turnChange", {
      currentTurn: lobby.turnOrder[lobby.currentTurnIndex],
    });
  }
};

export const handleGameEvents = (socket: customSocket, io: Server) => {
  const diceRolled = (
    {
      lobbyId,
      userId,
      diceValues,
      rollCount,
      boardData,
      clickedCell,
    }: DiceRolledArgs,
    callback: GameCallback
  ) => {
    try {
      const suggestedMoves = suggestMove(
        diceValues,
        boardData,
        rollCount,
        clickedCell
      );

      if (!gameStates[lobbyId]) {
        gameStates[lobbyId] = {};
      }
      if (!gameStates[lobbyId][userId]) {
        gameStates[lobbyId][userId] = {};
        gameStates[lobbyId][userId].data = data;
      }

      gameStates[lobbyId][userId].diceValues = diceValues;
      gameStates[lobbyId][userId].rollCount = rollCount;
      gameStates[lobbyId][userId].data = boardData;

      socket.emit("suggestions", suggestedMoves);

      callback({
        success: true,
        state: gameStates[lobbyId],
      });
    } catch (error) {
      callback({
        success: false,
        message: "Error occurred",
      });
    }
  };

  const getGameState = (
    { lobbyId, userId }: { lobbyId: string; userId: string },
    callback: GameCallback
  ) => {
    try {
      callback({
        success: true,
        boardState: gameStates[lobbyId][userId].data,
      });
    } catch (error) {
      callback({
        success: false,
        message: `Can't get ${userId} data`,
      });
    }
  };

  const playerAction = ({
    lobbyId,
    userId,
    newBoardData,
  }: PlayerActionArgs) => {
    const selectedLobby = onlineLobbies[lobbyId];
    for (let col = 0; col < 6; col++) {
      newBoardData[6][col] = countSums(newBoardData, 6, col);
      newBoardData[9][col] = countSums(newBoardData, 9, col);
      newBoardData[15][col] = countSums(newBoardData, 15, col);
    }

    gameStates[lobbyId][userId].data = newBoardData;
    socket.emit("boardDataUpdated", newBoardData);

    const currentTurnUserId =
      selectedLobby.turnOrder[selectedLobby.currentTurnIndex];
    if (currentTurnUserId && currentTurnUserId.toString() === userId) {
      nextTurn(selectedLobby, io);
    } else if (currentTurnUserId) {
      socket.emit("error", { message: "It's not your turn!" });
    } else {
      nextTurn(selectedLobby, io);
    }
  };

  socket.on("dicesRolled", diceRolled);
  socket.on("getGameState", getGameState);
  socket.on("playerAction", playerAction);
};
