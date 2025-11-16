import { useState, useContext } from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { registerUser } from "../../services/authService";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Register() {
  const nav = useNavigate();
  const { loginUser } = useContext(AuthContext);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "candidate",
  });

  const submit = async (e: any) => {
    e.preventDefault();

    try {
      if (!form.name || !form.email || !form.password || !form.role) {
        toast.error("All fields are required");
        return;
      }

      const res = await registerUser(form);

      if (!res || !res.data) {
        toast.error("Something went wrong");
        return;
      }

      const { user, token } = res.data;

      toast.success("Account created successfully");

      loginUser(user, token);

      if (user.role === "employer") nav("/employer/dashboard");
      else nav("/candidate/dashboard");
    } catch (err: any) {
      if (err?.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Registration failed");
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#131332]">
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 lg:p-20 bg-white dark:bg-white">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-[#1D2939] mb-2">
            Create an Account
          </h1>
          <p className="text-lg text-gray-500 mb-10">
            Enter your details to register!
          </p>

          <form onSubmit={submit} className="flex flex-col gap-7">
            <div>
              <label
                htmlFor="name"
                className="block text-lg font-medium mb-2"
              >
                Name *
              </label>
              <Input
                id="name"
                placeholder="Full Name"
                value={form.name}
                required
                onChange={(e: any) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-lg font-medium mb-2"
              >
                Email *
              </label>
              <Input
                id="email"
                placeholder="info@gmail.com"
                value={form.email}
                required
                onChange={(e: any) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-lg font-medium mb-2"
              >
                Password *
              </label>
              <div className="relative">
                <Input
                  id="password"
                  placeholder="Enter a secure password"
                  type="password"
                  value={form.password}
                  required
                  onChange={(e: any) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />

                <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 cursor-pointer">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.879 9.879a3 3 0 014.242 0M16.924 16.924a3.998 3.998 0 01-4.832.06M17.828 17.828l-1.414-1.414M17.828 17.828l1.414-1.414m-1.414 1.414l1.414 1.414"
                    ></path>
                  </svg>
                </span>
              </div>
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-lg font-medium mb-2"
              >
                Account Type *
              </label>
              <select
                id="role"
                value={form.role}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value })
                }
                className="w-full px-4 py-3.5 border border-gray-500 rounded-sm text-gray-900 focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5] transition-all duration-300 dark:bg-white dark:border-gray-600 dark:text-gray-900 appearance-none pr-8"
              >
                <option value="candidate">Candidate</option>
                <option value="employer">Employer</option>
              </select>
            </div>

            <div className="flex justify-center items-center mt-3">
              <Button
                type="submit"
                className="w-50 bg-[#4F46E5] hover:bg-[#3B30A3] text-white text-lg rounded-lg transition"
              >
                Register
              </Button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?
            <Link to="/auth/login">
              <span className="font-medium text-[#4F46E5] hover:text-[#3B30A3] ml-1">
                Sign In
              </span>
            </Link>
          </p>
        </div>
      </div>

      <div className="hidden md:flex w-1/2 bg-[#1C164D] p-10 lg:p-20 relative overflow-hidden text-white items-center justify-center">
        <div className="relative z-10 text-center">
          <div className="flex justify-center items-center mb-4">
            <span className="text-5xl mr-2">✨</span>
            <span className="text-4xl font-extrabold">HireFlow</span>
          </div>

          <h2 className="text-2xl font-semibold mt-4">
            Where Talent Meets Opportunity.
          </h2>

          <p className="text-lg mt-2 text-gray-300">
            Find your dream team or your next big career move, effortlessly.
          </p>
        </div>
      </div>
    </div>
  );
}
