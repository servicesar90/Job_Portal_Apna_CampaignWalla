import { useEffect, useState } from "react";
import { getMyApplications } from "../../services/applicationService";
import Card from "../../components/ui/Card";
import { Link } from "react-router-dom";
import { Briefcase, Clock, ArrowRight } from "lucide-react";
import Button from "../../components/ui/Button";

export default function CandidateDashboard() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    getMyApplications().then((res) => setApps(res.data.applications));
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#1D2939]">My Applications</h2>

        <Link
          to="/"
          className="text-[#0670A8] font-medium flex items-center gap-1 hover:underline"
        >
          <Button className="bg-[#0670A8] text-white" >Browse More Jobs <ArrowRight className="h-4 w-4" /></Button>
         
        </Link>
      </div>

      {apps.length === 0 && (
        <div className="text-center py-10 bg-[#F7FBFF] border border-[#DCEBFF] rounded-xl">
          <p className="text-[#475467]">You haven't applied to any jobs yet.</p>
        </div>
      )}

      <div className="space-y-3">
        {apps.map((a: any) => (
          <Link to={`/jobs/${a.job._id}`} key={a._id}>
            <Card className="border  bg-white shadow-sm p-4 hover:shadow-md transition rounded-xl mb-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 text-[#1D2939] font-semibold">
                    <Briefcase className="h-4 w-4 text-[#0670A8]" />
                    {a.job.title}
                  </div>

                  <div className="flex items-center gap-2 mt-1 text-sm text-[#475467]">
                    <Clock className="h-4 w-4 text-[#0670A8]" />
                    {a.status}
                  </div>
                </div>

                <ArrowRight className="h-5 w-5 text-[#0670A8]" />
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
