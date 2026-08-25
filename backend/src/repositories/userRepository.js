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

const userRepository = Object.freeze({
  findAll,
  findById,
  findByEmail,
  create,
  updateById,
  deleteById,
});

export { userRepository };
