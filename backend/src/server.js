import { app } from "./app.js";
import { connectToDatabase } from "./config/database.js";
import { env } from "./config/environment.js";

async function startServer() {
  try {
    await connectToDatabase(env.mongodbUri);

    app.listen(env.port, "0.0.0.0", () => {
      console.log(`Backend running on port ${env.port}`);
    });
  } catch (error) {
    console.error("Unable to start the backend");

    if (env.nodeEnv !== "production" && error instanceof Error) {
      console.error(error.message);
    }

    process.exitCode = 1;
  }
}

await startServer();
