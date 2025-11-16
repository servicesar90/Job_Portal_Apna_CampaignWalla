import { useEffect, useState, useCallback } from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import JobCard from "../../components/jobs/JobCard";
import { getJobs } from "../../services/jobService";
import { useSocket } from "../../hooks/useSocket";
import { toast } from "react-hot-toast";

export default function Home() {
  const socket = useSocket();
  const [jobs, setJobs] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const loadJobs = async (query = q, showToast = true) => {
    try {
      setLoading(true);

      const loadingToast = showToast
        ? toast.loading("Loading jobs…")
        : null;

      const res = await getJobs({ q: query });

      if (loadingToast) toast.dismiss(loadingToast);
      setLoading(false);

      if (!res.data.jobs.length) {
        setJobs([]);

        if (showToast) {
          toast("No jobs found", { icon: "😕" });
        }

        return;
      }

      setJobs(res.data.jobs);
      if (showToast) toast.success("Jobs loaded");
    } catch (err) {
      setLoading(false);
      showToast && toast.error("Failed to load jobs");
    }
  };

  useEffect(() => {
    loadJobs("", false);
  }, []);

  const debounceSearch = useCallback(() => {
    if (!hasSearched) return;

    const handler = setTimeout(() => {
      loadJobs(q, false);
    }, 400);

    return () => clearTimeout(handler);
  }, [q, hasSearched]);

  useEffect(() => {
    debounceSearch();
  }, [q]);

  useEffect(() => {
    if (!socket) return;

    socket.on("notifyCandidate", (data) => {
      toast.success(data.message || "New job notification!");
    });

    return () => socket.off("notifyCandidate");
  }, [socket]);

  const handleManualSearch = () => {
    setHasSearched(true);
    loadJobs(q, true);
  };

  return (
     <div className="w-full flex flex-col items-center mt-6">

  
    <div className="w-[50%] flex gap-3 mb-8">
      <Input
        value={q}
        onChange={(e: any) => setQ(e.target.value)}
        placeholder="Search jobs…"
        className=" text-sm rounded-lg border border-gary-500 shadow-sm focus:border-[#0784C9] focus:ring-[#0784C9]"
      />

      <Button
        onClick={handleManualSearch}
        disabled={loading}
        className="h-11 px-6 cursor-pointer text-sm font-semibold bg-[#0784C9] text-white rounded-lg hover:bg-[#0670A8] transition-all disabled:opacity-50"
      >
        {loading ? "Loading…" : "Search"}
      </Button>
    </div>

    <div className="w-full flex flex-col gap-4">
      {jobs.map((job: any) => (
        <JobCard key={job._id} job={job} />
      ))}

      {hasSearched && !jobs.length && (
        <p className="text-center text-[#475467] text-sm mt-4">
          No jobs found. Try another keyword.
        </p>
      )}
    </div>
  </div>
  );
}
