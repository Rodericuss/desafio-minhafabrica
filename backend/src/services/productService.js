import { ApplicationError, ERROR_CODES } from "../errors/applicationError.js";
import { productRepository } from "../repositories/productRepository.js";

function validationError(message) {
  return new ApplicationError(ERROR_CODES.validation, message);
}

function notFoundError() {
  return new ApplicationError(ERROR_CODES.notFound, "Product not found");
}

function ensureInputObject(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw validationError("Product data must be an object");
  }
}

function normalizeRequiredText(value, field, maxLength) {
  if (typeof value !== "string" || !value.trim()) {
    throw validationError(`${field} is required`);
  }

  const normalizedValue = value.trim();

  if (normalizedValue.length > maxLength) {
    throw validationError(`${field} must have at most ${maxLength} characters`);
  }

  return normalizedValue;
}

function validatePrice(price) {
  if (typeof price !== "number" || !Number.isFinite(price) || price <= 0) {
    throw validationError("Price must be a number greater than zero");
  }

  return price;
}

function validateStock(stock) {
  if (!Number.isInteger(stock) || stock < 0) {
    throw validationError("Stock must be an integer greater than or equal to zero");
  }

  return stock;
}

function isInvalidObjectIdError(error) {
  return error instanceof Error && error.name === "CastError";
}

async function listProducts() {
  return productRepository.findAll();
}

async function createProduct(data) {
  ensureInputObject(data);

  return productRepository.create({
    name: normalizeRequiredText(data.name, "Name", 120),
    description: normalizeRequiredText(data.description, "Description", 1_000),
    price: validatePrice(data.price),
    stock: validateStock(data.stock),
    category: normalizeRequiredText(data.category, "Category", 100),
  });
}

async function updateProduct(id, data) {
  ensureInputObject(data);

  const updates = {};

  if (Object.hasOwn(data, "name")) {
    updates.name = normalizeRequiredText(data.name, "Name", 120);
  }

  if (Object.hasOwn(data, "description")) {
    updates.description = normalizeRequiredText(data.description, "Description", 1_000);
  }

  if (Object.hasOwn(data, "price")) {
    updates.price = validatePrice(data.price);
  }

  if (Object.hasOwn(data, "stock")) {
    updates.stock = validateStock(data.stock);
  }

  if (Object.hasOwn(data, "category")) {
    updates.category = normalizeRequiredText(data.category, "Category", 100);
  }

  if (Object.keys(updates).length === 0) {
    throw validationError("At least one product field must be provided");
  }

  try {
    const updatedProduct = await productRepository.updateById(id, updates);

    if (!updatedProduct) {
      throw notFoundError();
    }

    return updatedProduct;
  } catch (error) {
    if (isInvalidObjectIdError(error)) {
      throw validationError("Product id must be valid");
    }

    throw error;
  }
}

async function deleteProduct(id) {
  try {
    const deletedProduct = await productRepository.deleteById(id);

    if (!deletedProduct) {
      throw notFoundError();
    }

    return deletedProduct;
  } catch (error) {
    if (isInvalidObjectIdError(error)) {
      throw validationError("Product id must be valid");
    }

    throw error;
  }
}

const productService = Object.freeze({
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
});

export { productService };
