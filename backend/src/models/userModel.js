import mongoose from "mongoose";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USER_PROFILES = ["admin", "user"];

function transformUser(_document, returnedObject) {
  returnedObject.id = returnedObject._id.toString();

  delete returnedObject._id;
  delete returnedObject.__v;
  delete returnedObject.passwordHash;

  return returnedObject;
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxLength: [100, "Name must have at most 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      maxLength: [254, "Email must have at most 254 characters"],
      match: [EMAIL_PATTERN, "Email must be valid"],
      unique: true,
    },
    passwordHash: {
      type: String,
      required: [true, "Password hash is required"],
      select: false,
    },
    profile: {
      type: String,
      required: [true, "Profile is required"],
      enum: {
        values: USER_PROFILES,
        message: "Profile must be admin or user",
      },
      default: "user",
    },
  },
  {
    timestamps: true,
    toJSON: { transform: transformUser },
    toObject: { transform: transformUser },
  },
);

const User = mongoose.model("User", userSchema);

export { User };
