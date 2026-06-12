"use client";

import {
  Bell,
  Search,
  Menu,
  Plus,
  GitBranch,
  GitPullRequest,
  Rocket,
  Terminal,
  FolderGit2,
  Activity,
  Star,
  Settings,
  LogOut
} from "lucide-react";

import {
  useState,
  useEffect
} from "react";

import { useRouter } from "next/navigation";

import { apiFetch } from "@/lib/api";

interface User {
  username: string;
  email: string;
}

export default function DashboardPage() {
  const router =
    useRouter();

  const [user, setUser] =
    useState<User | null>(null);

  const [sidebarOpen,
    setSidebarOpen] =
    useState(false);

  const [loading,
    setLoading] =
    useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const data =
          await apiFetch(
            "/api/auth/me/"
          );

        setUser(data);

      } catch {

        localStorage.removeItem(
          "token"
        );

        router.push(
          "/login"
        );

      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, [router]);

  function logout() {
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "refresh"
    );

    router.push(
      "/login"
    );
  }

  const menu = [
    {
      icon: FolderGit2,
      label: "Repositories"
    },
    {
      icon: GitBranch,
      label: "Projects"
    },
    {
      icon: GitPullRequest,
      label: "Pull Requests"
    },
    {
      icon: Rocket,
      label: "Deployments"
    },
    {
      icon: Terminal,
      label: "Dev Console"
    },
    {
      icon: Settings,
      label: "Settings"
    }
  ];

  if (loading) {
    return (
      <main className="bg-[#0d1117] min-h-screen flex items-center justify-center text-white">
        Loading workspace...
      </main>
    );
  }

  return (
    <main className="bg-[#0d1117] text-white min-h-screen">

      {/* NAV */}

      <header className="h-16 border-b border-[#30363d] bg-[#161b22] sticky top-0 z-50">

        <div className="h-full px-6 flex items-center justify-between">

          <div className="flex items-center gap-4">

            <button
              onClick={() =>
                setSidebarOpen(
                  !sidebarOpen
                )
              }
              className="md:hidden"
            >
              <Menu />
            </button>

            <h1 className="text-green-500 font-bold text-xl">
              OCTOHUB
            </h1>

          </div>

          <div className="hidden md:flex items-center gap-3 border border-[#30363d] rounded-md px-4 py-2 w-[500px]">

            <Search size={18} />

            <input
              placeholder="Search repositories..."
              className="bg-transparent outline-none w-full"
            />

          </div>

          <div className="flex items-center gap-5">

            <Plus />

            <Bell />

            <div className="w-9 h-9 rounded-full bg-green-600 flex items-center justify-center">

              {user?.username?.[0]}

            </div>

          </div>

        </div>

      </header>

      <div className="flex">

        {/* SIDEBAR */}

        <aside
          className={`
          fixed
          md:relative
          h-screen
          w-[270px]
          bg-[#161b22]
          border-r
          border-[#30363d]
          transition-all
          ${
            sidebarOpen
              ? "left-0"
              : "-left-full md:left-0"
          }
          `}
        >

          <div className="p-5">

            {menu.map((m) => {

              const Icon =
                m.icon;

              return (
                <button
                  key={m.label}
                  className="
                  flex
                  items-center
                  gap-3
                  w-full
                  rounded-md
                  px-4
                  py-3
                  hover:bg-[#21262d]
                  mb-2
                  "
                >

                  <Icon size={18} />

                  {m.label}

                </button>
              );

            })}

            <button
              onClick={logout}
              className="
              mt-10
              flex
              items-center
              gap-3
              text-red-400
              "
            >

              <LogOut />

              Logout

            </button>

          </div>

        </aside>

        {/* CONTENT */}

        <section className="flex-1 p-8">

          {/* HERO */}

          <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-8">

            <p className="text-gray-400">
              Developer Workspace
            </p>

            <h2 className="text-4xl font-bold mt-2">

              Welcome back,
              {" "}
              {user?.username}

            </h2>

            <p className="mt-4 text-gray-400">

              Build, collaborate,
              deploy.

            </p>

          </div>

          {/* STATS */}

          <div className="grid md:grid-cols-4 gap-6 mt-8">

            {[
              "Repositories",
              "Commits",
              "Open PR",
              "Deployments"
            ].map((s) => (

              <div
                key={s}
                className="
                rounded-xl
                bg-[#161b22]
                border
                border-[#30363d]
                p-6
                "
              >

                <div className="text-gray-400">

                  {s}

                </div>

                <div className="text-3xl mt-2 font-bold">

                  0

                </div>

              </div>

            ))}

          </div>

          {/* GRID */}

          <div className="grid lg:grid-cols-2 gap-8 mt-8">

            {/* REPOS */}

            <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-6">

              <h3 className="font-semibold mb-5">

                Recent Repositories

              </h3>

              {[
                "octohub-ui",
                "auth-service",
                "cli"
              ].map((repo) => (

                <div
                  key={repo}
                  className="
                  flex
                  justify-between
                  py-4
                  border-b
                  border-[#222]
                  "
                >

                  <div>

                    <p>

                      {repo}

                    </p>

                    <p className="text-gray-500 text-sm">

                      Updated recently

                    </p>

                  </div>

                  <Star />

                </div>

              ))}

            </div>

            {/* CLI */}

            <div className="rounded-xl border border-[#30363d] bg-[#161b22] p-6">

              <h3 className="font-semibold mb-5">

                Quick Git CLI

              </h3>

              {[
                "octo clone repo",
                "octo review",
                "git push origin main",
                "octo deploy"
              ].map((cmd) => (

                <div
                  key={cmd}
                  className="
                  rounded
                  bg-black
                  p-3
                  mb-3
                  font-mono
                  "
                >

                  {cmd}

                </div>

              ))}

            </div>

          </div>

          {/* ACTIVITY */}

          <div className="mt-8 rounded-xl border border-[#30363d] bg-[#161b22] p-6">

            <h3 className="font-semibold mb-5">

              Activity Feed

            </h3>

            {[
              "Repository created",
              "Deployment completed",
              "PR opened"
            ].map((x) => (

              <div
                key={x}
                className="
                flex
                items-center
                gap-3
                py-4
                border-b
                border-[#222]
                "
              >

                <Activity />

                {x}

              </div>

            ))}

          </div>

                 {/* WORKSPACE FOOTER */}

        <footer
          className="
          mt-10
          rounded-xl
          border
          border-[#30363d]
          bg-[#161b22]
          px-6
          py-5
          "
        >

          <div
            className="
            flex
            flex-col
            md:flex-row
            md:items-center
            md:justify-between
            gap-6
            "
          >

            {/* LEFT */}

            <div>

              <h4
                className="
                text-sm
                font-semibold
                text-white
                "
              >
                OCTOHUB Workspace
              </h4>

              <p
                className="
                mt-1
                text-sm
                text-gray-400
                "
              >
                Build • Collaborate • Deploy
              </p>

            </div>

            {/* CENTER */}

            <div
              className="
              flex
              gap-8
              text-sm
              text-gray-400
              "
            >

              <button
                className="
                hover:text-white
                "
              >
                Documentation
              </button>

              <button
                className="
                hover:text-white
                "
              >
                CLI
              </button>

              <button
                className="
                hover:text-white
                "
              >
                API
              </button>

              <button
                className="
                hover:text-white
                "
              >
                Status
              </button>

            </div>

            {/* RIGHT */}

            <div
              className="
              text-sm
              text-gray-500
              "
            >

              v0.1.0 • Ready

            </div>

          </div>

        </footer>

        </section>

      </div>

    </main>
  );
}