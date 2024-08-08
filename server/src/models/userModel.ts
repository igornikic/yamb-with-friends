import mongoose, { Document, Schema, Model } from "mongoose";

interface IUser extends Document {
  name: string;
  color: string;
}

const userSchema: Schema<IUser> = new Schema({
  name: {
    type: String,
    required: [true, "Please enter your username"],
    minLength: [3, "Your username must be at least 3 characters long"],
    maxLength: [30, "Your username cannot exceed 30 characters"],
    index: true,
  },
  color: {
    type: String,
    required: true,
  },
});

const UserModel: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default UserModel;
