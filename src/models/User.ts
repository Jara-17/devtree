import mongoose, { Schema } from "mongoose";

export interface IUser {
  name: string;
  lastname: string;
  handle: string;
  email: string;
  password: string;
}

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },

  lastname: {
    type: String,
    required: true,
    trim: true,
  },

  handle: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },

  password: {
    type: String,
    required: true,
    minlength: 8,
    trim: true,
  },
});

const User = mongoose.model<IUser>("User", userSchema);
export default User;
