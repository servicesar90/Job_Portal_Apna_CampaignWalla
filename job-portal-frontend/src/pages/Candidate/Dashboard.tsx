import { useEffect, useState } from "react";
import { getMyApplications } from "../../services/applicationService";
import Card from "../../components/ui/Card";
import { Link } from "react-router-dom";

export default function CandidateDashboard() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    getMyApplications().then((res) => setApps(res.data.applications));
  }, []);

  return (
    <div>
      <h2 className="text-2xl mb-4 font-semibold">My Applications</h2>
      <Link to='/'><button>Browse More Jobs</button></Link>

      {apps.map((a: any) => (
        <Card key={a._id} className="mb-2">
          <p>{a.job.title}</p>
          <p className="text-sm">{a.status}</p>
        </Card>
      ))}
    </div>
  );
}
