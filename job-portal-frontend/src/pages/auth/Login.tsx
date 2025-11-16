

import { useState, useContext } from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { loginUser } from "../../services/authService";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const nav = useNavigate();
  const { loginUser: loginCtx } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e: any) => {
    e.preventDefault();

    try {
      if (!email || !password) {
        toast.error("Please enter email & password");
        return;
      }

      const res = await loginUser({ email, password });

      if (!res || !res.data) {
        toast.error("Something went wrong!");
        return;
      }

      const { user, token } = res.data;

      toast.success("Login successful");

      loginCtx(user, token);

      if (user.role === "employer") nav("/employer/dashboard");
      else nav("/candidate/dashboard");
    } catch (err: any) {
      if (err?.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Invalid credentials or server error!");
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#131332]">
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12 lg:p-20 bg-white dark:bg-white">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-[#1D2939] mb-2">Sign In</h1>
          <p className="text-lg text-gray-500 mb-10">
            Enter your email and password to sign in!
          </p>

          <form onSubmit={submit} className="flex flex-col gap-7">
            <div>
              <label htmlFor="email" className="block text-lg font-medium mb-2">
                Email *
              </label>
              <Input
                id="email"
                placeholder="info@gmail.com"
                value={email}
                required
                onChange={(e: any) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-lg font-medium mb-2">
                Password *
              </label>

              <div className="relative">
                <Input
                  id="password"
                  placeholder="Enter your password"
                  type="password"
                  value={password}
                  required
                  onChange={(e: any) => setPassword(e.target.value)}
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

            <div className="flex items-center gap-2 mt-1">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-[#4F46E5] rounded border-gray-300"
              />
              <label htmlFor="remember-me" className="text-sm text-gray-900">
                Keep me logged in
              </label>
            </div>

            <div className="flex justify-center items-center">
              <Button
                type="submit"
                className="w-50 bg-[#4F46E5] hover:bg-[#3B30A3] text-white text-lg rounded-lg transition"
              >
                Sign In
              </Button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?
            <Link to="/auth/register">
              <span className="font-medium text-[#4F46E5] hover:text-[#3B30A3] ml-1">
                Sign Up
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


