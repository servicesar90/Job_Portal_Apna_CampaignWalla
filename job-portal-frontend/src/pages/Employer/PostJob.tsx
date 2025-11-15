import { useEffect, useState } from "react";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Button from "../../components/ui/Button";
import { createJob, getJob, updateJob } from "../../services/jobService";
import { useParams, useNavigate } from "react-router-dom";
import { createOrder, verifyPayment } from "../../services/paymentService";
import { useSocket } from "../../hooks/useSocket";

interface PostJobProps {
  isEdit?: boolean;
}

export default function PostJob({ isEdit = false }: PostJobProps) {
  const socket = useSocket();
  const { id } = useParams();
  const navigate = useNavigate();

   

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
    isPremium: false,
  });

  // ---------- Prefill job when editing ----------
  useEffect(() => {
    if (isEdit && id) {
      getJob(id!).then((res:any) => {
        setForm({
          title: res.data.job.title,
          company: res.data.job.company,
          location: res.data.job.location,
          salary: res.data.job.salary,
          description: res.data.job.description,
          isPremium: res.data.job.isPremium,
        });
      });
    }
  }, [id]);

  const submit = async (e: any) => {
    e.preventDefault();

    // ----------------- UPDATE JOB -----------------
    if (isEdit) {
      await updateJob(id!, form);
      alert("Job updated successfully!");
      navigate("/"); // redirect to home
      return;
    }

    // ----------------- CREATE JOB -----------------
    if (!form.isPremium) {
      await createJob(form);
      socket?.emit("jobPosted", {
        success: true,
        message: "New job posted: " + form.title,
      });
      alert("Job posted");
      navigate("/");
      return;
    }

    // ------------ PREMIUM PAYMENT LOGIC ------------
    const order = await createOrder(100);
    const options = {
      key: "rzp_test_3gHC9NkJgGTL2w",
      amount: order.data.order.amount,
      currency: "INR",
      order_id: order.data.order.id,
      handler: async (response: any) => {
        verifyPayment({
          ...response,
          transactionId: order.data.transactionId,
        });

        await createJob({ ...form, isPremium: true });
        alert("Premium job posted!");
        navigate("/");
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-xl font-semibold">
        {isEdit ? "Update Job" : "Post Job"}
      </h2>

      <form onSubmit={submit} className="space-y-3 mt-3">
        <Input
          placeholder="Title"
          value={form.title}
          onChange={(e: any) => setForm({ ...form, title: e.target.value })}
        />

        <Input
          placeholder="Company"
          value={form.company}
          onChange={(e: any) =>
            setForm({ ...form, company: e.target.value })
          }
        />

        <Input
          placeholder="Location"
          value={form.location}
          onChange={(e: any) =>
            setForm({ ...form, location: e.target.value })
          }
        />

        <Input
          placeholder="Salary"
          value={form.salary}
          onChange={(e: any) =>
            setForm({ ...form, salary: e.target.value })
          }
        />

        <Textarea
          placeholder="Description"
          value={form.description}
          onChange={(e: any) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        {!isEdit && (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isPremium}
              onChange={(e) =>
                setForm({ ...form, isPremium: e.target.checked })
              }
            />
            Premium Post
          </label>
        )}

        <Button type="submit">
          {isEdit ? "Update" : "Submit"}
        </Button>
      </form>
    </div>
  );
}
