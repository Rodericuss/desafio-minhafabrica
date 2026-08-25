import { env } from "../config/environment.js";
import { dashboardService } from "../services/dashboardService.js";

async function getSummary(_request, response) {
  try {
    const summary = await dashboardService.getSummary();

    return response.status(200).json(summary);
  } catch (error) {
    console.error("Unexpected error while processing a dashboard request");

    if (env.nodeEnv !== "production" && error instanceof Error) {
      console.error(error);
    }

    return response.status(500).json({ message: "Internal server error" });
  }
}

const dashboardController = Object.freeze({ getSummary });

export { dashboardController };
