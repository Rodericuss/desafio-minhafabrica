import { env } from "../config/environment.js";
import { ApplicationError, ERROR_CODES } from "../errors/applicationError.js";
import { productService } from "../services/productService.js";

const HTTP_STATUS_BY_ERROR_CODE = Object.freeze({
  [ERROR_CODES.validation]: 400,
  [ERROR_CODES.notFound]: 404,
});

function sendErrorResponse(error, response) {
  if (error instanceof ApplicationError) {
    const status = HTTP_STATUS_BY_ERROR_CODE[error.code] ?? 500;

    return response.status(status).json({ message: error.message });
  }

  console.error("Unexpected error while processing a product request");

  if (env.nodeEnv !== "production" && error instanceof Error) {
    console.error(error);
  }

  return response.status(500).json({ message: "Internal server error" });
}

async function listProducts(_request, response) {
  try {
    const products = await productService.listProducts();

    return response.status(200).json(products);
  } catch (error) {
    return sendErrorResponse(error, response);
  }
}

async function createProduct(request, response) {
  try {
    const product = await productService.createProduct(request.body);

    return response.status(201).json(product);
  } catch (error) {
    return sendErrorResponse(error, response);
  }
}

async function updateProduct(request, response) {
  try {
    const product = await productService.updateProduct(request.params.id, request.body);

    return response.status(200).json(product);
  } catch (error) {
    return sendErrorResponse(error, response);
  }
}

async function deleteProduct(request, response) {
  try {
    await productService.deleteProduct(request.params.id);

    return response.status(204).send();
  } catch (error) {
    return sendErrorResponse(error, response);
  }
}

const productController = Object.freeze({
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
});

export { productController };
