import API from "./api";

export const registerUser = (payload: any) =>
  API.post("/auth/register", payload);

export const loginUser = (payload: any) =>
  API.post("/auth/login", payload);
