import { Link } from "react-router-dom";
import { MapPin, Building2, Users } from "lucide-react";

export default function JobCard({ job }: any) {
  return (
    <div className="flex justify-center">
      <div
        className="
          w-[60%] 
          bg-white 
          rounded-xl 
          shadow 
          hover:shadow-lg 
          transition-all 
          duration-200 
          border 
          border-[#E5F4FF]
        "
      >
        
        <div className="flex justify-between items-center px-4 py-2 bg-[#E5F4FF] rounded-t-xl text-xs">
          <span className="flex items-center gap-1 text-[#0784C9] font-semibold">
            {job.isPremium ? (
              <>
                ⭐ Premium Job
              </>
            ) : (
              <> Normal Job</>
            )}
          </span>

          <span className="flex items-center gap-1 text-[#22C55E] font-medium">
            <span className="w-2 h-2 bg-[#22C55E] rounded-full"></span>
            Active
          </span>
        </div>

        
        <div className="p-4">
          {/* Title + company */}
          <h2 className=" text-xl  font-bold text-[#1D2939] leading-tight">
            {job.title}
          </h2>

          <div className="mt-1 flex items-center gap-2 text-sm text-[#475467]">
            <Building2 className="w-4 h-4 text-[#0784C9]" />
            {job.company}
          </div>

          <div className="mt-1 flex items-center gap-2 text-sm text-[#475467]">
            <MapPin className="w-4 h-4 text-[#0784C9]" />
            {job.location}
          </div>

          {/* Salary Box */}
          <div className="mt-4 bg-[#E5F4FF] rounded-lg px-4 py-3 flex justify-between items-center text-sm">
            <span className="font-medium text-[#475467]">₹ Monthly Salary</span>
            <span className="font-bold text-[#0784C9]">
              ₹{job.salary}
            </span>
          </div>

          {/* Chips */}
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="px-3 py-1 rounded-full bg-[#E5F4FF] border border-[#0784C9] text-[#0784C9] text-xs">
              remote
            </span>
            <span className="px-3 py-1 rounded-full bg-[#E5F4FF] border border-[#0784C9] text-[#0784C9] text-xs">
              Full-Time
            </span>
            <span className="px-3 py-1 rounded-full bg-[#E5F4FF] border border-[#0784C9] text-[#0784C9] text-xs">
              Fixed-only
            </span>
          </div>

          {/* Applicants */}
          <p className="flex items-center gap-1 text-xs text-[#475467] mt-4">
            <Users className="w-3 h-3 text-[#0784C9]" />
            {job.applicationCount || 0} applicants
          </p>

          {/* Footer button */}
          <div className="flex justify-end mt-4">
            <Link
              to={`/jobs/${job._id}`}
              className="
                bg-[#0784C9] 
                text-white 
                px-4 
                py-2 
                rounded-md 
                text-sm 
                font-semibold 
                hover:bg-[#0670A8] 
                transition-all
              "
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
