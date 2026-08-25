import { env } from "../config/environment.js";
import { ApplicationError, ERROR_CODES } from "../errors/applicationError.js";

const HTTP_STATUS_BY_ERROR_CODE = Object.freeze({
  [ERROR_CODES.validation]: 400,
  [ERROR_CODES.unauthorized]: 401,
  [ERROR_CODES.notFound]: 404,
  [ERROR_CODES.conflict]: 409,
});

function notFoundHandler(_request, response) {
  return response.status(404).json({ message: "Route not found" });
}

function errorHandler(error, _request, response, _next) {
  if (error?.type === "entity.parse.failed") {
    return response.status(400).json({ message: "Request body must contain valid JSON" });
  }

  if (error instanceof ApplicationError) {
    const status = HTTP_STATUS_BY_ERROR_CODE[error.code] ?? 500;

    return response.status(status).json({ message: error.message });
  }

  console.error("Unexpected backend error");

  if (env.nodeEnv !== "production" && error instanceof Error) {
    console.error(error);
  }

  return response.status(500).json({ message: "Internal server error" });
}

export { errorHandler, notFoundHandler };
