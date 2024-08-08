import mongoose, { Schema, Model } from "mongoose";
import { ILobby } from "./types.js";

const lobbySchema: Schema<ILobby> = new Schema({
  name: {
    type: String,
    required: true,
  },
  users: [],
  lobbySize: {
    type: Number,
    required: true,
  },
  currentLobbySize: {
    type: Number,
    default: 0,
  },
  turnOrder: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  currentTurnIndex: {
    type: Number,
    default: 0,
  },
});

const LobbyModel: Model<ILobby> = mongoose.model<ILobby>("Lobby", lobbySchema);

export default LobbyModel;
