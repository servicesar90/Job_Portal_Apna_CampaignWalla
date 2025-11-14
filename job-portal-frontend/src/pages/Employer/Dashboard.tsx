import { useEffect, useState } from "react";
import { getEmployerApplications } from "../../services/applicationService";
import Card from "../../components/ui/Card";

export default function EmployerDashboard() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    getEmployerApplications().then((res) => setApps(res.data.applications));
  }, []);

  return (
    <div>
      <h2 className="text-2xl mb-4 font-semibold">Employer Dashboard</h2>

      {apps.map((a: any) => (
        <Card key={a._id} className="mb-2">
          <div className="flex justify-between">
            <div>
              <p className="font-bold">{a.candidate.name}</p>
              <p>{a.job.title}</p>
            </div>
            <p className="text-sm">{a.status}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
