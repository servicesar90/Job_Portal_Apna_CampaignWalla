import { useState, useContext } from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { loginUser } from "../../services/authService";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const nav = useNavigate();
  const { loginUser: loginCtx } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e: any) => {
    e.preventDefault();

    const res = await loginUser({ email, password });
    const { user, token } = res.data;

    loginCtx(user, token);

    if (user.role === "employer") nav("/employer/dashboard");
    else nav("/candidate/dashboard");
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl mb-3 font-semibold">Login</h2>

      <form onSubmit={submit} className="space-y-3">
        <Input placeholder="Email" value={email} onChange={(e:any) => setEmail(e.target.value)} />
        <Input placeholder="Password" type="password" value={password} onChange={(e:any) => setPassword(e.target.value)} />
        <Button type="submit">Login</Button>
      </form>
    </div>
  );
}
