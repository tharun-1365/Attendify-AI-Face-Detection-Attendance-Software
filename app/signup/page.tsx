"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true);

    const { data: authData, error: authError } =
      await supabase.auth.signUp({
        email,
        password,
      });

    if (authError) {
      console.error("Auth Error:", authError.message);
      setLoading(false);
      return;
    }

    if (!authData.user) {
      console.error("No user returned");
      setLoading(false);
      return;
    }

    const userId = authData.user.id;

    const { data: schoolData, error: schoolError } =
      await supabase.from("schools").insert([
        { name: schoolName }
      ]).select();

    if (schoolError) {
      console.error("School Error:", schoolError.message);
      setLoading(false);
      return;
    }

    const schoolId = schoolData[0].id;

    const { error: userError } =
      await supabase.from("users").insert([
        {
          id: userId,
          role: "admin",
          school_id: schoolId,
        }
      ]);

    if (userError) {
      console.error("User Insert Error:", userError.message);
    } else {
      console.log("Signup Successful");
    }

    setLoading(false);
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">Admin Signup</h1>

      <input
        className="border p-2 mb-3 block"
        placeholder="School Name"
        value={schoolName}
        onChange={(e) => setSchoolName(e.target.value)}
      />

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
        onClick={handleSignup}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {loading ? "Creating..." : "Sign Up"}
      </button>
    </div>
  );
}