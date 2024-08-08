import { Socket } from "socket.io";
import { IUser, ILobby } from "../models/types";

export let onlineUsers: { [key: string]: IUser } = {};
export let onlineLobbies: { [key: string]: ILobby } = {};
export const setOnlineLobbies = (lobbies: { [key: string]: ILobby }) => {
  onlineLobbies = lobbies;
};

export let gameStates: { [key: string]: { [userId: string]: any } } = {};

export interface customSocket extends Socket {
  userId?: string;
}
