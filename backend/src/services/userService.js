import bcrypt from "bcryptjs";
import { ApplicationError, ERROR_CODES } from "../errors/applicationError.js";
import { userRepository } from "../repositories/userRepository.js";

const BCRYPT_ROUNDS = 12;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USER_PROFILES = ["admin", "user"];

function validationError(message) {
  return new ApplicationError(ERROR_CODES.validation, message);
}

function normalizeName(name) {
  if (typeof name !== "string" || !name.trim()) {
    throw validationError("Name is required");
  }

  const normalizedName = name.trim();

  if (normalizedName.length > 100) {
    throw validationError("Name must have at most 100 characters");
  }

  return normalizedName;
}

function normalizeEmail(email) {
  if (typeof email !== "string" || !email.trim()) {
    throw validationError("Email is required");
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (normalizedEmail.length > 254 || !EMAIL_PATTERN.test(normalizedEmail)) {
    throw validationError("Email must be valid");
  }

  return normalizedEmail;
}

function validatePassword(password) {
  if (typeof password !== "string" || Array.from(password).length < 8) {
    throw validationError("Password must have at least 8 characters");
  }

  if (bcrypt.truncates(password)) {
    throw validationError("Password must have at most 72 bytes");
  }

  return password;
}

function validateProfile(profile) {
  if (!USER_PROFILES.includes(profile)) {
    throw validationError("Profile must be admin or user");
  }

  return profile;
}

function ensureInputObject(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw validationError("User data must be an object");
  }
}

function isDuplicateKeyError(error) {
  return error && typeof error === "object" && error.code === 11_000;
}

function isInvalidObjectIdError(error) {
  return error instanceof Error && error.name === "CastError";
}

function conflictError() {
  return new ApplicationError(ERROR_CODES.conflict, "Email is already in use");
}

function notFoundError() {
  return new ApplicationError(ERROR_CODES.notFound, "User not found");
}

async function listUsers() {
  return userRepository.findAll();
}

async function createUser(data) {
  ensureInputObject(data);

  const name = normalizeName(data.name);
  const email = normalizeEmail(data.email);
  const password = validatePassword(data.password);
  const profile = validateProfile(data.profile ?? "user");

  const existingUser = await userRepository.findByEmail(email);

  if (existingUser) {
    throw conflictError();
  }

  const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

  try {
    return await userRepository.create({
      name,
      email,
      passwordHash,
      profile,
    });
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw conflictError();
    }

    throw error;
  }
}

async function updateUser(id, data) {
  ensureInputObject(data);

  let currentUser;

  try {
    currentUser = await userRepository.findById(id);
  } catch (error) {
    if (isInvalidObjectIdError(error)) {
      throw validationError("User id must be valid");
    }

    throw error;
  }

  if (!currentUser) {
    throw notFoundError();
  }

  const updates = {};

  if (Object.hasOwn(data, "name")) {
    updates.name = normalizeName(data.name);
  }

  if (Object.hasOwn(data, "email")) {
    updates.email = normalizeEmail(data.email);

    if (updates.email !== currentUser.email) {
      const existingUser = await userRepository.findByEmail(updates.email);

      if (existingUser && !existingUser._id.equals(currentUser._id)) {
        throw conflictError();
      }
    }
  }

  if (Object.hasOwn(data, "password")) {
    const password = validatePassword(data.password);
    updates.passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
  }

  if (Object.hasOwn(data, "profile")) {
    updates.profile = validateProfile(data.profile);
  }

  if (Object.keys(updates).length === 0) {
    throw validationError("At least one user field must be provided");
  }

  try {
    const updatedUser = await userRepository.updateById(id, updates);

    if (!updatedUser) {
      throw notFoundError();
    }

    return updatedUser;
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw conflictError();
    }

    throw error;
  }
}

async function deleteUser(id) {
  let deletedUser;

  try {
    deletedUser = await userRepository.deleteById(id);
  } catch (error) {
    if (isInvalidObjectIdError(error)) {
      throw validationError("User id must be valid");
    }

    throw error;
  }

  if (!deletedUser) {
    throw notFoundError();
  }

  return deletedUser;
}

const userService = Object.freeze({
  listUsers,
  createUser,
  updateUser,
  deleteUser,
});

export { userService };
