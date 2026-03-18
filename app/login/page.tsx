"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login Error:", error.message);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">Login</h1>

      <input
        className="border p-2 mb-3 block"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="border p-2 mb-3 block"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleLogin}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Login
      </button>
    </div>
  );
}