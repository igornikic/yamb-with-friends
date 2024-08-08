import { Document } from "mongoose";

export interface IUser extends Document {
  _id: string;
  name: string;
  color: string;
}

export interface ILobby extends Document {
  name: string;
  users: IUser[];
  lobbySize: number;
  currentLobbySize: number;
  turnOrder: string[];
  currentTurnIndex: number;
}
