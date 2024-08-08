import { Server } from "socket.io";
import { customSocket } from "../utils/constants";
import { handleUserEvents, handleUserDisconnection } from "./userHandler";
import { handleLobbyEvents } from "./lobbyHandler";
import { handleGameEvents } from "./gameHandler";
import { IUser } from "../models/types";

interface MessagePayload {
  lobbyId: string;
  message: string;
  user: IUser;
}

const initializeSocket = (server: any): Server => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket: customSocket) => {
    handleUserEvents(socket, io);
    handleLobbyEvents(socket, io);
    handleGameEvents(socket, io);

    const sendMessage = ({ lobbyId, message, user }: MessagePayload) => {
      io.to(lobbyId).emit("receiveMessage", { message, user });
    };

    socket.on("sendMessage", sendMessage);

    socket.on("disconnect", () => handleUserDisconnection(socket, io));
  });

  return io;
};

export default initializeSocket;
