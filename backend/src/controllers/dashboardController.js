import { dashboardService } from "../services/dashboardService.js";

async function getSummary(_request, response) {
  const summary = await dashboardService.getSummary();

  return response.status(200).json(summary);
}

const dashboardController = Object.freeze({ getSummary });

export { dashboardController };
