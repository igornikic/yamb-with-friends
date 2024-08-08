import { Server } from "socket.io";
import User from "../models/userModel";
import { IUser } from "../models/types";
import { customSocket, onlineUsers } from "../utils/constants";

type UserCallback = (response: {
  success: boolean;
  message: string;
  user?: IUser;
}) => void;

export const handleUserEvents = (socket: customSocket, io: Server) => {
  io.emit("updateUsers", Object.values(onlineUsers));

  const createUser = async (user: IUser, callback: UserCallback) => {
    try {
      let existingUser = (await User.findOne({ name: user.name })) as IUser;
      if (existingUser && onlineUsers[existingUser.id]) {
        callback({
          success: false,
          message: `User ${existingUser.name} is already connected.`,
        });
        return;
      }

      if (existingUser) {
        onlineUsers[existingUser.id] = existingUser;
        socket.userId = existingUser.id;
        callback({
          success: true,
          message: `Welcome back ${existingUser.name}`,
          user: existingUser,
        });
      } else {
        let newUser = (await User.create(user)) as IUser;
        onlineUsers[newUser.id] = newUser;
        socket.userId = newUser.id;
        callback({
          success: true,
          message: "User created successfully",
          user: newUser,
        });
      }

      io.emit("updateUsers", Object.values(onlineUsers));
    } catch (error) {
      console.error("Error creating or finding user:", error);
      callback({
        success: false,
        message: "Error occurred during user creation or lookup",
      });
    }
  };

  const getOnlineUsers = () => {
    io.emit("updateUsers", Object.values(onlineUsers));
  };

  socket.on("createUser", createUser);
  socket.on("getOnlineUsers", getOnlineUsers);
};

export const handleUserDisconnection = (socket: customSocket, io: Server) => {
  if (socket.userId) {
    delete onlineUsers[socket.userId];
    io.emit("updateUsers", Object.values(onlineUsers));
  }
};
