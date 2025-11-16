import { useEffect, useState } from "react";
import { getEmployerApplications } from "../../services/applicationService";
import Card from "../../components/ui/Card";
import { Link } from "react-router-dom";
import { useSocket } from "../../hooks/useSocket";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button";

export default function EmployerDashboard() {
  const [apps, setApps] = useState([]);
  const socket = useSocket();


  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await getEmployerApplications();
        setApps(res.data.applications);
        toast.success("Applications loaded successfully");
      } catch (error: any) {
        console.error("Error fetching employer applications:", error);
        toast.error(
          error?.response?.data?.message ||
          "Failed to load applications"
        );
      }
    };

    loadData();
  }, []);

  
  useEffect(() => {
    if (!socket) return;

    socket.on("notifyEmployer", (data) => {
      console.log("Real-time applicant:", data);
      toast.success(data.message || "New application received!");
    });

    return () => socket.off("notifyEmployer");
  }, [socket]);

  return (
    <div className="max-w-3xl">
      <h2 className="text-2xl mb-4 font-semibold text-gray-900">Employer Dashboard</h2>

      <Link to="/employer/post-job">
        <Button className="px-4 py-2 bg-[#4F46E5] text-white text-xl rounded-md cursor-pointer hover:bg-[#3d36c7] transition shadow-sm">
          Post Job
        </Button>
      </Link>

      <div className="mt-6 space-y-3">
        {apps.length === 0 && (
          <p className="text-gray-500 mt-4 text-center">No applications yet</p>
        )}

        {apps.map((a: any) => (
          <Card
            key={a._id}
            className="p-4 border border-gray-200 rounded-2xl hover:shadow-md transition"
          >
            <div className="flex justify-between items-start">
              
              {/* LEFT SIDE */}
              <div>
                <p className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <span className="inline-block w-2 h-2 bg-[#4F46E5] rounded-full"></span>
                  {a.candidate.name}
                </p>

                <p className="text-gray-600 text-sm mt-1 flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4 text-[#4F46E5]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  {a.job.title}
                </p>
              </div>

              {/* RIGHT SIDE STATUS */}
              <p
                className={`text-sm font-medium px-3 py-1 rounded-full capitalize
                  ${
                    a.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : a.status === "accepted"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }
                `}
              >
                {a.status}
              </p>
            </div>
          </Card>
        ))}
      </div>
  </div>
  );
}
