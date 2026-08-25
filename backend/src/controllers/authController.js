import { authService } from "../services/authService.js";

async function login(request, response) {
  const session = await authService.login(request.body);

  return response.status(200).json(session);
}

const authController = Object.freeze({ login });

export { authController };
