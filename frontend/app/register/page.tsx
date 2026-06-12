"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";

export default function RegisterPage() {
  const [email,setEmail]=useState("");
  const [username,setUsername]=useState("");
  const [password,setPassword]=useState("");

  async function handleSubmit(
  e: React.FormEvent
) {
  e.preventDefault();

  try {
    // Create account
    await apiFetch(
      "/api/auth/register/",
      {
        method: "POST",
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      }
    );

    // Auto login immediately
    const loginData =
      await apiFetch(
        "/api/auth/login/",
        {
          method: "POST",
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

    // Store JWT
    localStorage.setItem(
      "token",
      loginData.access
    );

    // Go directly to dashboard
    window.location.href =
      "/dashboard";

  } catch (err) {
    console.error(err);

    alert(
      err instanceof Error
        ? err.message
        : "Registration failed"
    );
  }
}

  return (
    <main
      className="
      min-h-screen
      bg-[#0d1117]
      flex
      items-center
      justify-center
      "
    >
      <div
        className="
        w-full
        max-w-md
        bg-[#161b22]
        border
        border-[#30363d]
        rounded-xl
        p-8
        "
      >
        <h1
          className="
          text-3xl
          text-green-500
          mb-6
          text-center
          font-bold
          "
        >
          OCTOHUB
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            className="w-full p-3 rounded bg-[#0d1117]"
            placeholder="Username"
            value={username}
            onChange={(e)=>
              setUsername(e.target.value)
            }
          />

          <input
            className="w-full p-3 rounded bg-[#0d1117]"
            placeholder="Email"
            value={email}
            onChange={(e)=>
              setEmail(e.target.value)
            }
          />

          <input
            type="password"
            className="w-full p-3 rounded bg-[#0d1117]"
            placeholder="Password"
            value={password}
            onChange={(e)=>
              setPassword(e.target.value)
            }
          />

          <button
            className="
            w-full
            bg-green-600
            p-3
            rounded
            "
          >
            Create account
          </button>
        </form>
      </div>
    </main>
  );
}