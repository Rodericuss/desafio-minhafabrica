export type UserProfile = "admin" | "user";

export type User = {
  id: string;
  name: string;
  email: string;
  profile: UserProfile;
  createdAt: string;
  updatedAt: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  createdAt: string;
  updatedAt: string;
};

export type DashboardSummary = {
  totalUsers: number;
  totalProducts: number;
};

export type LoginResponse = {
  token: string;
  user: User;
};

export type ApiErrorBody = {
  message?: string;
};
