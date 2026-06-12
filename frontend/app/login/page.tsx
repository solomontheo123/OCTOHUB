"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { apiFetch } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleLogin(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setLoading(true);

    try {
      const data =
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

      // Save JWT
      localStorage.setItem(
        "token",
        data.access
      );

      // Optional refresh storage
      if (data.refresh) {
        localStorage.setItem(
          "refresh",
          data.refresh
        );
      }

      // Redirect
      router.push(
        "/dashboard"
      );

    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Invalid credentials"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className="
      flex
      min-h-screen
      items-center
      justify-center
      bg-[#0d1117]
      px-4
      "
    >
      <div
        className="
        w-full
        max-w-sm
        rounded-md
        border
        border-[#30363d]
        bg-[#161b22]
        p-6
        "
      >
        <div
          className="
          mb-6
          text-center
          "
        >
          <h1
            className="
            text-2xl
            font-semibold
            text-green-500
            "
          >
            OCTOHUB
          </h1>

          <p
            className="
            mt-2
            text-sm
            text-gray-400
            "
          >
            Sign in to your account
          </p>
        </div>

        <form
          onSubmit={
            handleLogin
          }
          className="
          space-y-4
          "
        >

          <div>
            <label
              className="
              mb-2
              block
              text-sm
              "
            >
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e)=>
                setEmail(
                  e.target.value
                )
              }
              required
              className="
              w-full
              rounded-md
              border
              border-[#30363d]
              bg-[#0d1117]
              px-3
              py-2
              "
            />
          </div>

          <div>
            <label
              className="
              mb-2
              block
              text-sm
              "
            >
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e)=>
                setPassword(
                  e.target.value
                )
              }
              required
              className="
              w-full
              rounded-md
              border
              border-[#30363d]
              bg-[#0d1117]
              px-3
              py-2
              "
            />
          </div>

          <button
            type="submit"
            disabled={
              loading
            }
            className="
            w-full
            rounded-md
            bg-green-600
            py-2
            text-white
            hover:bg-green-700
            "
          >
            {
              loading
              ? "Signing in..."
              : "Sign in"
            }
          </button>

        </form>

        <div
          className="
          mt-6
          border
          border-[#30363d]
          rounded-md
          p-4
          text-center
          text-sm
          "
        >
          New to OCTOHUB?{" "}

          <Link
            href="/register"
            className="
            text-blue-400
            hover:underline
            "
          >
            Create an account
          </Link>

        </div>

      </div>
    </main>
  );
}