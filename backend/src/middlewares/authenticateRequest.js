import jwt from "jsonwebtoken";
import { env } from "../config/environment.js";

function unauthorizedResponse(response) {
  return response.status(401).json({ message: "Authentication required" });
}

function authenticateRequest(request, response, next) {
  const authorization = request.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return unauthorizedResponse(response);
  }

  const token = authorization.slice("Bearer ".length).trim();

  if (!token) {
    return unauthorizedResponse(response);
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);

    if (typeof payload === "string" || typeof payload.sub !== "string") {
      return unauthorizedResponse(response);
    }

    request.auth = Object.freeze({ userId: payload.sub });

    return next();
  } catch {
    return unauthorizedResponse(response);
  }
}

export { authenticateRequest };
