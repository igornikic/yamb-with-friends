import { io, Socket } from "socket.io-client";

const socket: Socket = io(import.meta.env.VITE_API_URL, {
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});

export default socket;
