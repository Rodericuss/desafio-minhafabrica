import { env } from "../config/environment.js";
import { ApplicationError, ERROR_CODES } from "../errors/applicationError.js";
import { authService } from "../services/authService.js";

const HTTP_STATUS_BY_ERROR_CODE = Object.freeze({
  [ERROR_CODES.validation]: 400,
  [ERROR_CODES.unauthorized]: 401,
});

async function login(request, response) {
  try {
    const session = await authService.login(request.body);

    return response.status(200).json(session);
  } catch (error) {
    if (error instanceof ApplicationError) {
      const status = HTTP_STATUS_BY_ERROR_CODE[error.code] ?? 500;

      return response.status(status).json({ message: error.message });
    }

    console.error("Unexpected error while processing a login request");

    if (env.nodeEnv !== "production" && error instanceof Error) {
      console.error(error);
    }

    return response.status(500).json({ message: "Internal server error" });
  }
}

const authController = Object.freeze({ login });

export { authController };
