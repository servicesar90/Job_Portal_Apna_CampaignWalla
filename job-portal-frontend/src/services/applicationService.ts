import API from "./api";

export const applyJob = (jobId: string, payload: any) =>
  API.post(`/applications/apply/${jobId}`, payload);

export const getMyApplications = () => API.get("/applications/me");

export const getEmployerApplications = () =>
  API.get("/applications/employer");
