import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === "admin" && password === "admin123") {
      alert("Login successful!");
      navigate("/"); // redirect to homepage
    } else {
      alert("Invalid username or password");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Sign In</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          className="border p-2 w-full mb-3"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          className="border p-2 w-full mb-3"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="bg-blue-600 text-white p-2 w-full rounded">
          Login
        </button>
      </form>
    </div>
  );
}
