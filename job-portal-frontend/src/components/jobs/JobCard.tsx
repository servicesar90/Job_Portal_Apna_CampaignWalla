

import Card from "../ui/Card";
import { Link } from "react-router-dom";

export default function JobCard({ job }: any) {
  return (
    <Card>
      <h3 className="text-lg font-bold">{job.title}</h3>
      <p className="text-sm">{job.company} • {job.location}</p>

      <p className="mt-3 text-sm">
        {job.description?.slice(0, 140)}...
      </p>

      <div className="mt-3 flex justify-between">
        <Link to={`/jobs/${job._id}`} className="text-indigo-600">
          View Details
        </Link>

        <span className="text-sm text-gray-400">
          {job.applicationCount || 0} applied
        </span>
      </div>
    </Card>
  );
}
