export interface User {
  _id: string;
  name: string;
  email: string;
  role: "candidate" | "employer";
}

export interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary: string;
  isPremium: boolean;
  createdAt: string;
  applicationCount?: number;
}

export interface Application {
  _id: string;
  status: string;
  resumeLink: string;
  coverLetter: string;
  createdAt: string;

 
  candidate?: User;
  job?: Job;
}
