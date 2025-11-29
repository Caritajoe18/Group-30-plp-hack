import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === "admin" && password === "admin123") {
      navigate("/"); // redirect to homepage
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="p-4">
      <h2>Sign In</h2>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="border p-2 mb-2 w-full"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 mb-2 w-full"
      />

      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white p-2 rounded mt-2"
      >
        Login
      </button>
    </div>
  );
}
