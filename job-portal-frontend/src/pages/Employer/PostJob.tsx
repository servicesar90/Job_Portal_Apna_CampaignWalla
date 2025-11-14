import { useState } from "react";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Button from "../../components/ui/Button";
import { createJob } from "../../services/jobService";
import { createOrder, verifyPayment } from "../../services/paymentService";

export default function PostJob() {
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
    isPremium: false,
  });

  const submit = async (e: any) => {
    e.preventDefault();

    if (!form.isPremium) {
      await createJob(form);
      alert("Job posted");
      return;
    }

    const order = await createOrder(100);
    const options = {
      key: import.meta.env.VITE_RAZORPAY_ID,
      amount: order.data.amount,
      currency: "INR",
      order_id: order.data.id,
      handler: async (response: any) => {
        await verifyPayment(response);
        await createJob({ ...form, isPremium: true });
        alert("Premium job posted");
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-xl font-semibold">Post Job</h2>

      <form onSubmit={submit} className="space-y-3 mt-3">
        <Input placeholder="Title" value={form.title} onChange={(e:any) => setForm({ ...form, title: e.target.value })} />
        <Input placeholder="Company" value={form.company} onChange={(e:any) => setForm({ ...form, company: e.target.value })} />
        <Input placeholder="Location" value={form.location} onChange={(e:any) => setForm({ ...form, location: e.target.value })} />
        <Input placeholder="Salary" value={form.salary} onChange={(e:any) => setForm({ ...form, salary: e.target.value })} />
        <Textarea placeholder="Description" value={form.description} onChange={(e:any) => setForm({ ...form, description: e.target.value })} />

        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.isPremium} onChange={(e) => setForm({ ...form, isPremium: e.target.checked })} />
          Premium Post
        </label>

        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}
