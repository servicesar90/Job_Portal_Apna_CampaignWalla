import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { getJob } from "../../services/jobService";
import { applyJob } from "../../services/applicationService";
import { AuthContext } from "../../context/AuthContext";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Button from "../../components/ui/Button";

export default function JobDetails() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [job, setJob] = useState<any>(null);
  const [resumeLink, setResumeLink] = useState("");
  const [coverLetter, setCoverLetter] = useState("");

  useEffect(() => {
    if (id) getJob(id).then((res) => setJob(res.data.job));
  }, [id]);

  const apply = async () => {
    if (!user) return alert("Login first");

    await applyJob(id!, { resumeLink, coverLetter });
    alert("Application submitted");
  };

  if (!job) return <div>Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-bold">{job.title}</h2>
      <p>{job.company} • {job.location}</p>

      <p className="mt-4">{job.description}</p>

      <div className="mt-6">
        <h3 className="font-semibold mb-2">Apply Now</h3>

        <Input placeholder="Resume Link" value={resumeLink} onChange={(e:any) => setResumeLink(e.target.value)} />
        <Textarea placeholder="Cover Letter" value={coverLetter} onChange={(e:any) => setCoverLetter(e.target.value)} />
        <Button onClick={apply}>Apply</Button>
      </div>
    </div>
  );
}
