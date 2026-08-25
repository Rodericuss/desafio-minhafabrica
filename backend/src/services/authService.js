import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/environment.js";
import { ApplicationError, ERROR_CODES } from "../errors/applicationError.js";
import { userRepository } from "../repositories/userRepository.js";

function invalidCredentialsError() {
  return new ApplicationError(ERROR_CODES.unauthorized, "Invalid email or password");
}

function validationError(message) {
  return new ApplicationError(ERROR_CODES.validation, message);
}

function normalizeLoginEmail(email) {
  if (typeof email !== "string" || !email.trim()) {
    throw validationError("Email is required");
  }

  return email.trim().toLowerCase();
}

function validateLoginPassword(password) {
  if (typeof password !== "string" || !password) {
    throw validationError("Password is required");
  }

  return password;
}

async function login(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw validationError("Login data must be an object");
  }

  const email = normalizeLoginEmail(data.email);
  const password = validateLoginPassword(data.password);
  const user = await userRepository.findByEmailWithPassword(email);

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw invalidCredentialsError();
  }

  const token = jwt.sign({}, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
    subject: user.id,
  });

  return {
    token,
    user: user.toJSON(),
  };
}

const authService = Object.freeze({ login });

export { authService };
