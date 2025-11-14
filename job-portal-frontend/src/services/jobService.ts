import API from "./api";

export const getJobs = (params?: any) =>
  API.get("/jobs/allJobs", { params });

export const getJob = (id: string) => API.get(`/jobs/jobById/${id}`);

export const createJob = (payload: any) => API.post("/jobs/", payload);
