import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getJob, deleteJob } from "../../services/jobService";
import { applyJob } from "../../services/applicationService";
import { AuthContext } from "../../context/AuthContext";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Button from "../../components/ui/Button";

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
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

  const handleDelete = async () => {
    const ok = confirm("Are you sure you want to delete this job?");
    if (!ok) return;

    await deleteJob(id!);
    alert("Job deleted");
    navigate("/");
  };

  if (!job) return <div>Loading...</div>;

  const isEmployer = user?.role === "employer"; // role check

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-bold">{job.title}</h2>
      <p>
        {job.company} • {job.location}
      </p>

      <p className="mt-4">{job.description}</p>

      {/* ---- EMPLOYER ACTION BUTTONS ---- */}
      {isEmployer && (
        <div className="flex gap-3 mt-6">
          <Button
            className="bg-blue-600 text-white"
            onClick={() => navigate(`/employer/update-job/${id}`)}
          >
            Update Job
          </Button>

          <Button className="bg-red-600 text-white" onClick={handleDelete}>
            Delete Job
          </Button>
        </div>
      )}

      {/* ---- APPLY SECTION (Only for candidates) ---- */}
      {user?.role === "candidate" && (
        <div className="mt-8">
          <h3 className="font-semibold mb-2">Apply Now</h3>

          <Input
            placeholder="Resume Link"
            value={resumeLink}
            onChange={(e: any) => setResumeLink(e.target.value)}
          />

          <Textarea
            placeholder="Cover Letter"
            value={coverLetter}
            onChange={(e: any) => setCoverLetter(e.target.value)}
          />

          <Button onClick={apply}>Apply</Button>
        </div>
      )}
    </div>
  );
}
