import API from "./api";

export const getJobs = (params?: any) =>
  API.get("/jobs/allJobs", { params });

export const getJob = (id: string) => API.get(`/jobs/jobById/${id}`);

export const createJob = (payload: any) => API.post("/jobs/", payload);

export const deleteJob = (id: string) => API.delete(`/jobs/deleteJob/${id}`);

export const updateJob = (id: string, payload: any) =>
  API.put(`/jobs/updateJob/${id}`, payload);
