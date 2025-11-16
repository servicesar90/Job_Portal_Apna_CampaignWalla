import JobCard from "./JobCard";
import Spinner from "../ui/Spinner";

interface JobListProps {
  jobs: any[];
  loading?: boolean;
}

export default function JobList({ jobs, loading }: JobListProps) {
  if (loading) return <Spinner />;

  if (!jobs.length)
    return (
      <p className="text-center text-gray-500 dark:text-gray-400 mt-6">
        No jobs found.
      </p>
    );

  return (
    <div className="grid gap-4 ">
      {jobs.map((job) => (
        <JobCard className='mb-5' key={job._id} job={job} />
      ))}
    </div>
  );
}
