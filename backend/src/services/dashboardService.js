import { productRepository } from "../repositories/productRepository.js";
import { userRepository } from "../repositories/userRepository.js";

async function getSummary() {
  const [totalUsers, totalProducts] = await Promise.all([
    userRepository.count(),
    productRepository.count(),
  ]);

  return { totalUsers, totalProducts };
}

const dashboardService = Object.freeze({ getSummary });

export { dashboardService };
