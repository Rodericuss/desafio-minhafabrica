import { productService } from "../services/productService.js";

async function listProducts(_request, response) {
  const products = await productService.listProducts();

  return response.status(200).json(products);
}

async function createProduct(request, response) {
  const product = await productService.createProduct(request.body);

  return response.status(201).json(product);
}

async function updateProduct(request, response) {
  const product = await productService.updateProduct(request.params.id, request.body);

  return response.status(200).json(product);
}

async function deleteProduct(request, response) {
  await productService.deleteProduct(request.params.id);

  return response.status(204).send();
}

const productController = Object.freeze({
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
});

export { productController };
