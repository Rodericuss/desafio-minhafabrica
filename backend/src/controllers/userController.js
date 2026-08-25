import { userService } from "../services/userService.js";

async function listUsers(_request, response) {
  const users = await userService.listUsers();

  return response.status(200).json(users);
}

async function createUser(request, response) {
  const user = await userService.createUser(request.body);

  return response.status(201).json(user);
}

async function updateUser(request, response) {
  const user = await userService.updateUser(request.params.id, request.body);

  return response.status(200).json(user);
}

async function deleteUser(request, response) {
  await userService.deleteUser(request.params.id);

  return response.status(204).send();
}

const userController = Object.freeze({
  listUsers,
  createUser,
  updateUser,
  deleteUser,
});

export { userController };
