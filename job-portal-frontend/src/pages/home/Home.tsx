import { useEffect, useState } from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import JobCard from "../../components/jobs/JobCard";
import { getJobs } from "../../services/jobService";
import { useSocket } from "../../hooks/useSocket";

export default function Home() {
  const socket = useSocket();
  const [jobs, setJobs] = useState([]);
  const [q, setQ] = useState("");

  const loadJobs = async () => {
    const res = await getJobs({ q });
    console.log("get jobs",res);
    
    setJobs(res.data.jobs);
  };

  useEffect(() => {
    loadJobs();
  }, []);

   useEffect(() => {
  if (!socket) return;

  socket.on("notifyCandidate", (data) => {
    console.log("Real-time job posted:", data);
    alert(data.message);
  });

  return () => socket.off("notifyEmployer");
}, [socket]);

  return (
    <div>
      <div className="flex gap-3 mb-6">
        <Input value={q} onChange={(e:any) => setQ(e.target.value)} placeholder="Search jobs…" />
        <Button onClick={loadJobs}>Search</Button>
      </div>

      <div className="grid gap-4">
        {jobs.map((job: any) => (
          <JobCard job={job} key={job._id} />
        ))}
      </div>
    </div>
  );
}
