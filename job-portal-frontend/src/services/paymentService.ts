import API from "./api";

export const createOrder = (amount: number) =>
  API.post("/payments/create-order", { amount });

export const verifyPayment = (payload: any) =>{
  console.log("payload",payload);
  
  API.post("/payments/verify", payload);}

export const getTransactionHistory = () => API.get("/payments/history");
