import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getJob, deleteJob } from "../../services/jobService";
import { applyJob } from "../../services/applicationService";
import { AuthContext } from "../../context/AuthContext";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Button from "../../components/ui/Button";
import { useSocket } from "../../hooks/useSocket";
import toast from "react-hot-toast";
import { Building2, MapPin, Wallet, FileText } from "lucide-react";

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [job, setJob] = useState<any>(null);
  const [resumeLink, setResumeLink] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(true);

  const socket = useSocket();

  useEffect(() => {
    if (!id) return toast.error("Invalid Job ID");

    getJob(id)
      .then((res) => setJob(res.data.job))
      .catch(() => toast.error("Failed to load job"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!socket) return;

    socket.on("notifyEmployer", (data) => {
      toast.success(data.message);
    });

    return () => socket.off("notifyEmployer");
  }, [socket]);

  const isValidResumeLink = (link: string) => {
  const patterns = [
    /drive\.google\.com/,
    /dropbox\.com/,
    /\.pdf$/,
    /\.docx?$/
  ];
  return patterns.some((p) => p.test(link.toLowerCase()));
};

  const apply = async () => {
    if (!user) return toast.error("Login first");
    if (!resumeLink) return toast.error("Resume link required");

     if (!isValidResumeLink(resumeLink)) {
    return toast.error("Please enter a valid resume link (PDF, DOCX, Google Drive, Dropbox)");
  }

    try {
      await applyJob(id!, { resumeLink, coverLetter });
      toast.success("Application submitted");
      setResumeLink("");
      setCoverLetter("");
    } catch (error: any) {
      if (error?.response?.status === 409) {
        return toast.error("You already applied to this job");
      }
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async () => {
    const ok = confirm("Are you sure you want to delete this job?");
    if (!ok) return;

    try {
      await deleteJob(id!);
      toast.success("Job deleted");
      navigate("/");
    } catch {
      toast.error("Error deleting job");
    }
  };

  if (loading) return <div className="text-center mt-10">Loading...</div>;
  if (!job) return <div className="text-center mt-10">Job not found</div>;

  const isEmployer = user?.role === "employer";

  return (
    <div className="max-w-2xl mx-auto mt-8 bg-white rounded-xl shadow-md border border-[#DCEBFF] p-6">
      <div className="bg-[#EAF4FF] px-4 py-2 rounded-lg mb-4 flex justify-between items-center text-sm">
        <span className="text-[#0670A8] font-medium">Job Details</span>
        <span className="text-[#16A34A] font-medium flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span> Active
        </span>
      </div>

      <h2 className="text-2xl font-bold text-[#1D2939]">{job.title}</h2>

      <div className="mt-3 space-y-2 text-sm">
        <div className="flex items-center gap-2 text-[#475467]">
          <Building2 className="h-4 w-4 text-[#0670A8]" />
          {job.company}
        </div>

        <div className="flex items-center gap-2 text-[#475467]">
          <MapPin className="h-4 w-4 text-[#0670A8]" />
          {job.location}
        </div>

        <div className="flex items-center gap-2 text-[#475467]">
          <Wallet className="h-4 w-4 text-[#0670A8]" />
          ₹{job.salary}
        </div>

        {job.category && (
          <div className="flex items-center gap-2 text-[#475467]">
            <FileText className="h-4 w-4 text-[#0670A8]" />
            {job.category}
          </div>
        )}
      </div>

      <p className="mt-5 text-[#475467] leading-relaxed text-sm">{job.description}</p>

      {isEmployer && (
        <div className="flex gap-3 mt-6">
          <Button
            className="bg-[#0670A8] text-white"
            onClick={() => navigate(`/employer/update-job/${id}`)}
          >
            Update Job
          </Button>

          <Button className="bg-red-600 text-white" onClick={handleDelete}>
            Delete Job
          </Button>
        </div>
      )}

      {user?.role === "candidate" && (
        <div className="mt-8 space-y-4 p-4 bg-[#F7FBFF] border border-[#DCEBFF] rounded-lg">
          <Input
            placeholder="Resume Link"
            value={resumeLink}
            onChange={(e: any) => setResumeLink(e.target.value)}
            className="border border-[#BBD7F5] rounded-md"
          />

          <Textarea
            placeholder="Cover Letter"
            value={coverLetter}
            onChange={(e: any) => setCoverLetter(e.target.value)}
            className="border border-[#BBD7F5]"
          />

          <Button className="bg-[#0670A8] text-white w-full" onClick={apply}>
            Apply
          </Button>
        </div>
      )}
    </div>
  );
}
