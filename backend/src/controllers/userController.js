import { env } from "../config/environment.js";
import { ApplicationError, ERROR_CODES } from "../errors/applicationError.js";
import { userService } from "../services/userService.js";

const HTTP_STATUS_BY_ERROR_CODE = Object.freeze({
  [ERROR_CODES.validation]: 400,
  [ERROR_CODES.notFound]: 404,
  [ERROR_CODES.conflict]: 409,
});

function sendErrorResponse(error, response) {
  if (error instanceof ApplicationError) {
    const status = HTTP_STATUS_BY_ERROR_CODE[error.code] ?? 500;

    return response.status(status).json({ message: error.message });
  }

  console.error("Unexpected error while processing a user request");

  if (env.nodeEnv !== "production" && error instanceof Error) {
    console.error(error);
  }

  return response.status(500).json({ message: "Internal server error" });
}

async function listUsers(_request, response) {
  try {
    const users = await userService.listUsers();

    return response.status(200).json(users);
  } catch (error) {
    return sendErrorResponse(error, response);
  }
}

async function createUser(request, response) {
  try {
    const user = await userService.createUser(request.body);

    return response.status(201).json(user);
  } catch (error) {
    return sendErrorResponse(error, response);
  }
}

async function updateUser(request, response) {
  try {
    const user = await userService.updateUser(request.params.id, request.body);

    return response.status(200).json(user);
  } catch (error) {
    return sendErrorResponse(error, response);
  }
}

async function deleteUser(request, response) {
  try {
    await userService.deleteUser(request.params.id);

    return response.status(204).send();
  } catch (error) {
    return sendErrorResponse(error, response);
  }
}

const userController = Object.freeze({
  listUsers,
  createUser,
  updateUser,
  deleteUser,
});

export { userController };
