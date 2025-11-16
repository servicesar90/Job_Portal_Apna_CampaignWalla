import { useState, useEffect } from "react";
import { createJob, getJob, updateJob } from "../../services/jobService";
import { createOrder, verifyPayment } from "../../services/paymentService";
import { useParams, useNavigate } from "react-router-dom";
import { useSocket } from "../../hooks/useSocket";
import toast from "react-hot-toast";

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

  const [errors, setErrors] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
  });

  useEffect(() => {
    const loadJob = async () => {
      try {
        if (isEdit && id) {
          const res: any = await getJob(id);
          setForm({
            title: res.data.job.title,
            company: res.data.job.company,
            location: res.data.job.location,
            salary: res.data.job.salary,
            description: res.data.job.description,
            isPremium: res.data.job.isPremium,
          });
          toast.success("Job loaded successfully");
        }
      } catch (err: any) {
        toast.error(err?.response?.data?.message || "Failed to load job");
      }
    };
    loadJob();
  }, [id, isEdit]);

  const handleChange = (field: string, value: string) => {
    let newErrors = { ...errors };

    if (!value.trim()) {
      newErrors[field as keyof typeof errors] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    } else if (field === "salary" && !/^\d+$/.test(value)) {
      newErrors.salary = "Salary must be a number";
    } else {
      newErrors[field as keyof typeof errors] = "";
    }

    setErrors(newErrors);
    setForm({ ...form, [field]: value });
  };

  const validateForm = () => {
    let valid = true;
    let newErrors = { ...errors };

    Object.keys(form).forEach((key) => {
      if (key !== "isPremium" && !form[key as keyof typeof form].toString().trim()) {
        newErrors[key as keyof typeof errors] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
        valid = false;
      }
    });

    if (!/^\d+$/.test(form.salary)) {
      newErrors.salary = "Salary must be a number";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const submit = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix errors before submitting");
      return;
    }

    try {
      if (isEdit) {
        await updateJob(id!, form);
        toast.success("Job updated successfully");
        navigate("/");
        return;
      }

      if (!form.isPremium) {
        await createJob(form);
        socket?.emit("jobPosted", {
          success: true,
          message: "New job posted: " + form.title,
        });
        toast.success("Job posted successfully");
        navigate("/");
        return;
      }

      const order = await createOrder(100);

      const options = {
        key: "rzp_test_3gHC9NkJgGTL2w",
        amount: order.data.order.amount,
        currency: "INR",
        order_id: order.data.order.id,
        handler: async (response: any) => {
          try {
            await verifyPayment({
              ...response,
              transactionId: order.data.transactionId,
            });

            await createJob({ ...form, isPremium: true });

            toast.success("Premium job posted successfully!");
            navigate("/");
          } catch (err: any) {
            toast.error(err?.response?.data?.message || "Payment verification failed");
          }
        },
        modal: {
          ondismiss: () => {
            toast.error("Payment cancelled");
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <div className="bg-white shadow-xl rounded-xl border border-gray-200 p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          {isEdit ? "Update Job" : "Post a New Job"}
        </h2>

        <form onSubmit={submit} className="space-y-6">
          {["title", "company", "location", "salary"].map((field) => (
            <div key={field} className="relative">
              <input
                type="text"
                id={field}
                placeholder=" "
                value={form[field as keyof typeof form]}
                onChange={(e) => handleChange(field, e.target.value)}
                className={`peer block w-full rounded-md border px-3 pt-5 pb-2 text-gray-900 placeholder-transparent focus:ring-1 ${
                  errors[field as keyof typeof errors]
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                }`}
              />
              <label
                htmlFor={field}
                className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-gray-700 peer-focus:text-sm"
              >
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              {errors[field as keyof typeof errors] && (
                <p className="text-red-500 text-xs mt-1">{errors[field as keyof typeof errors]}</p>
              )}
            </div>
          ))}

          <div className="relative">
            <textarea
              id="description"
              placeholder=" "
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              className={`peer block w-full h-32 rounded-md border px-3 pt-5 pb-2 text-gray-900 placeholder-transparent focus:ring-1 ${
                errors.description
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              } resize-none`}
            />
            <label
              htmlFor="description"
              className="absolute left-3 top-2 text-gray-500 text-sm transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-gray-700 peer-focus:text-sm"
            >
              Job Description
            </label>
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          {!isEdit && (
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={form.isPremium}
                onChange={(e) => setForm({ ...form, isPremium: e.target.checked })}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label className="text-gray-700 text-sm font-medium">Premium Post</label>
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition-colors"
            >
              {isEdit ? "Update Job" : "Post Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
