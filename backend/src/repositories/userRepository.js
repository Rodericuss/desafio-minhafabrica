import { User } from "../models/userModel.js";

async function findAll() {
  return User.find().sort({ createdAt: -1 });
}

async function findById(id) {
  return User.findById(id);
}

async function findByEmail(email) {
  return User.findOne({ email });
}

async function findByEmailWithPassword(email) {
  return User.findOne({ email }).select("+passwordHash");
}

async function create(userData) {
  return User.create(userData);
}

async function updateById(id, userData) {
  return User.findByIdAndUpdate(id, userData, {
    returnDocument: "after",
    runValidators: true,
  });
}

async function deleteById(id) {
  return User.findByIdAndDelete(id);
}

async function count() {
  return User.countDocuments();
}

const userRepository = Object.freeze({
  findAll,
  findById,
  findByEmail,
  findByEmailWithPassword,
  create,
  updateById,
  deleteById,
  count,
});

export { userRepository };
