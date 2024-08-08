import { Server } from "socket.io";
import Lobby from "../models/lobbyModel";
import { IUser, ILobby } from "../models/types";
import {
  customSocket,
  onlineLobbies,
  setOnlineLobbies,
  onlineUsers,
  gameStates,
} from "../utils/constants";

type LobbyCallback = (response: {
  success: boolean;
  message?: string;
  lobby?: ILobby;
}) => void;

import { nextTurn } from "./gameHandler";

export const handleLobbyEvents = (socket: customSocket, io: Server) => {
  const createLobby = async (lobby: ILobby, callback: LobbyCallback) => {
    try {
      const newLobby = await Lobby.create(lobby);
      onlineLobbies[newLobby.id] = newLobby;
      callback({
        success: true,
        message: "Lobby created successfully",
        lobby: newLobby,
      });
      io.emit("updateLobbies", Object.values(onlineLobbies));
    } catch (error) {
      console.error("Error creating lobby:", error);
      callback({
        success: false,
        message: "Error occurred during lobby creation",
      });
    }
  };

  const getOnlineLobbies = async () => {
    try {
      const lobbies = await Lobby.find();
      const lobbyMap: { [key: string]: ILobby } = {};
      lobbies.forEach((lobby) => {
        lobbyMap[lobby.id] = lobby;
      });
      setOnlineLobbies(lobbyMap);
      io.emit("updateLobbies", Object.values(onlineLobbies));
    } catch (error) {
      console.error("Error fetching lobbies:", error);
      io.emit("updateLobbies", []);
    }
  };

  const joinLobby = async (
    { userId, lobbyId }: { userId: string; lobbyId: string },
    callback: LobbyCallback
  ) => {
    try {
      const selectedLobby = onlineLobbies[lobbyId];
      const userToAdd = onlineUsers[userId];
      if (
        selectedLobby &&
        selectedLobby.currentLobbySize < selectedLobby.lobbySize
      ) {
        if (!selectedLobby.turnOrder) {
          selectedLobby.turnOrder = [];
        }
        selectedLobby.users.push(userToAdd);
        selectedLobby.currentLobbySize = selectedLobby.users.length;
        selectedLobby.turnOrder.push(userId);

        if (selectedLobby.currentLobbySize === 1) {
          selectedLobby.currentTurnIndex = 0;
        }

        await Lobby.findByIdAndUpdate(lobbyId, {
          $addToSet: { users: userToAdd },
          $set: { currentLobbySize: selectedLobby.currentLobbySize },
        });

        onlineLobbies[lobbyId] = selectedLobby;
        io.emit("updateLobbies", Object.values(onlineLobbies));

        if (!gameStates[lobbyId]) {
          gameStates[lobbyId] = {};
        }
        gameStates[lobbyId][userId] = {
          diceStates: [],
          rollCount: 0,
        };

        callback({ success: true });
      } else {
        callback({
          success: false,
          message: "Lobby is full or does not exist.",
        });
      }
    } catch (error) {
      callback({ success: false, message: "Error occurred" });
    }
  };

  const getLobbyDetails = (lobbyId: string) => {
    const lobby: ILobby = onlineLobbies[lobbyId];
    socket.join(lobbyId);
    io.to(lobbyId).emit("lobbyDetails", lobby);
    io.to(lobbyId).emit("turnChange", {
      currentTurn: lobby.turnOrder[lobby.currentTurnIndex],
    });
  };

  const leaveRoom = async ({
    lobbyId,
    userId,
  }: {
    lobbyId: string;
    userId: string;
  }) => {
    try {
      const selectedLobby = onlineLobbies[lobbyId];
      if (selectedLobby) {
        selectedLobby.users = selectedLobby.users.filter(
          (user) => user._id !== userId
        );
        selectedLobby.currentLobbySize = selectedLobby.users.length;
        selectedLobby.turnOrder = selectedLobby.turnOrder.filter(
          (id) => id !== userId
        );

        const currentTurnUserId =
          selectedLobby.turnOrder[selectedLobby.currentTurnIndex];
        if (
          currentTurnUserId &&
          currentTurnUserId.toString() === userId &&
          selectedLobby.currentLobbySize !== 0
        ) {
          nextTurn(selectedLobby, io);
        }

        if (selectedLobby.currentLobbySize === 0) {
          delete onlineLobbies[lobbyId];
        }
      }

      const foundLobby = await Lobby.findById(lobbyId);

      if (foundLobby) {
        foundLobby.users = foundLobby.users.filter(
          (user: IUser) => user._id.toString() !== userId.toString()
        );

        foundLobby.currentLobbySize = foundLobby.users.length;

        if (foundLobby.currentLobbySize === 0) {
          await Lobby.deleteOne({ _id: lobbyId });
        } else {
          await foundLobby.save();
        }
      } else {
        console.log("Lobby not found.");
      }

      socket.leave(lobbyId);
      const lobbies = await Lobby.find();
      const lobbyMap: { [key: string]: ILobby } = {};
      lobbies.forEach((lobby) => {
        lobbyMap[lobby.id] = lobby;
      });
      setOnlineLobbies(lobbyMap);
      io.emit("updateLobbies", Object.values(onlineLobbies));
      socket.to(lobbyId).emit("userLeft", userId);
    } catch (error) {
      console.error("Error removing user from lobby:", error);
    }
  };

  socket.on("createLobby", createLobby);
  socket.on("getOnlineLobbies", getOnlineLobbies);
  socket.on("joinLobby", joinLobby);
  socket.on("getLobbyDetails", getLobbyDetails);
  socket.on("leaveRoom", leaveRoom);
};
