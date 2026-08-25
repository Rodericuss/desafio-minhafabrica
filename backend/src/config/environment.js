import dotenv from "dotenv";

dotenv.config({ quiet: true });

const DEFAULT_PORT = 3001;
const DEFAULT_FRONTEND_URL = "http://localhost:3000";

function readRequiredVariable(name) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`${name} is required`);
  }

  return value;
}

function readPort(value) {
  if (value === undefined) {
    return DEFAULT_PORT;
  }

  const port = Number(value);

  if (!Number.isInteger(port) || port < 1 || port > 65_535) {
    throw new Error("PORT must be an integer between 1 and 65535");
  }

  return port;
}

const env = Object.freeze({
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: readPort(process.env.PORT),
  mongodbUri: readRequiredVariable("MONGODB_URI"),
  frontendUrl: process.env.FRONTEND_URL?.trim() || DEFAULT_FRONTEND_URL,
});

export { env };
