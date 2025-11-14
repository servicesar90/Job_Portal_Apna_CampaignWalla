import API from "./api";

export const createOrder = (amount: number) =>
  API.post("/payments/create-order", { amount });

export const verifyPayment = (payload: any) =>
  API.post("/payments/verify", payload);
