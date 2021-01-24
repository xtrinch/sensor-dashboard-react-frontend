import { UserId } from "types/User";

export const UserRoutes = {
  USERS: "/users",
  USER_LIST: "/users",
  USER: "/users/:id",
};

export const getUserRoute = (userId: UserId) => `/users/${userId}`;
