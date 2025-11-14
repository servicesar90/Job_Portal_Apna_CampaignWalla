import { useState, useContext } from "react";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { registerUser } from "../../services/authService";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const nav = useNavigate();
  const { loginUser } = useContext(AuthContext);

  const [form, setForm] = useState({ name: "", email: "", password: "", role: "candidate" });

  const submit = async (e: any) => {
    e.preventDefault();

    const res = await registerUser(form);
    const { user, token } = res.data;

    loginUser(user, token);
    nav("/");
  };

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl mb-3 font-semibold">Register</h2>

      <form onSubmit={submit} className="space-y-3">
        <Input placeholder="Name" value={form.name} onChange={(e:any) => setForm({ ...form, name: e.target.value })} />
        <Input placeholder="Email" value={form.email} onChange={(e:any) => setForm({ ...form, email: e.target.value })} />
        <Input placeholder="Password" type="password" value={form.password} onChange={(e:any) => setForm({ ...form, password: e.target.value })} />

        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="border p-2 rounded-md w-full"
        >
          <option value="candidate">Candidate</option>
          <option value="employer">Employer</option>
        </select>

        <Button type="submit">Register</Button>
      </form>
    </div>
  );
}
