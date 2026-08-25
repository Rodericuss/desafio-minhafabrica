import { connectToDatabase, disconnectFromDatabase } from "../config/database.js";
import { env } from "../config/environment.js";
import { ApplicationError, ERROR_CODES } from "../errors/applicationError.js";
import { userService } from "../services/userService.js";

function readSeedVariable(name, { trim = true } = {}) {
  const value = process.env[name];

  if (!value?.trim()) {
    throw new Error(`${name} is required`);
  }

  return trim ? value.trim() : value;
}

async function seedAdmin() {
  try {
    await connectToDatabase(env.mongodbUri);

    try {
      await userService.createUser({
        name: readSeedVariable("ADMIN_NAME"),
        email: readSeedVariable("ADMIN_EMAIL"),
        password: readSeedVariable("ADMIN_PASSWORD", { trim: false }),
        profile: "admin",
      });

      console.log("Admin user created");
    } catch (error) {
      if (error instanceof ApplicationError && error.code === ERROR_CODES.conflict) {
        console.log("Admin user already exists; no changes were made");
        return;
      }

      throw error;
    }
  } catch (error) {
    console.error("Unable to seed the admin user");

    if (env.nodeEnv !== "production" && error instanceof Error) {
      console.error(error.message);
    }

    process.exitCode = 1;
  } finally {
    await disconnectFromDatabase();
  }
}

await seedAdmin();
