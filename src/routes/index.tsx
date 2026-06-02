import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import denimBg from "@/assets/denim-navy.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "M Hotels — Login" },
      { name: "description", content: "Sign in to the M Hotels admin panel." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/dashboard" });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Denim wave header */}
      <div className="relative h-[38vh] min-h-[260px] w-full overflow-hidden">
        <img
          src={denimBg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          width={1920}
          height={800}
        />
        <svg
          className="absolute -bottom-px left-0 w-full"
          viewBox="0 0 1440 140"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0,80 C320,140 520,0 820,40 C1080,75 1260,130 1440,70 L1440,140 L0,140 Z"
            fill="var(--color-background)"
          />
        </svg>
      </div>

      <main className="flex-1 flex flex-col items-center px-6 pb-12">
        <Logo />

        <form
          onSubmit={onSubmit}
          className="w-full max-w-md mt-12 space-y-10"
        >
          <Field
            label="Username"
            value={username}
            onChange={setUsername}
            icon={<UserIcon />}
            type="text"
          />
          <Field
            label="Password"
            value={password}
            onChange={setPassword}
            icon={<KeyIcon />}
            type="password"
          />

          <div className="flex justify-center pt-6">
            <button
              type="submit"
              className="font-display text-2xl bg-navy text-navy-foreground rounded-xl px-14 py-3 shadow-lg hover:opacity-95 transition"
            >
              Login
            </button>
          </div>
        </form>

        <Link
          to="/dashboard"
          className="mt-8 text-xs text-muted-foreground hover:text-navy"
        >
          Skip to dashboard →
        </Link>
      </main>
    </div>
  );
}

function Logo() {
  return (
    <div className="flex flex-col items-center -mt-4">
      <span className="font-display text-7xl text-gold leading-none">M</span>
      <span className="tracking-[0.4em] text-navy text-sm mt-2">HOTELS</span>
      <div className="flex items-center gap-2 mt-2">
        <span className="block h-px w-12 bg-gold" />
        <span className="block h-2 w-2 rotate-45 bg-gold" />
        <span className="block h-px w-12 bg-gold" />
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  icon,
  type,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  icon: React.ReactNode;
  type: string;
}) {
  return (
    <div className="relative">
      <div className="flex items-end justify-between border-b border-gold pb-2 relative">
        <input
          id={label}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={label}
          className="w-full bg-transparent outline-none text-navy placeholder:text-navy/80 text-lg pr-8"
        />
        <span className="absolute right-0 bottom-2 text-gold">{icon}</span>
      </div>
      <span className="absolute -left-1 -bottom-[5px] block h-2 w-2 rounded-full bg-gold" />
      <span className="absolute -right-1 -bottom-[5px] block h-2 w-2 rounded-full bg-gold" />
    </div>
  );
}

function UserIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6" />
    </svg>
  );
}
function KeyIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="8" cy="15" r="4" />
      <path d="M11 13l9-9m-3 3l2 2m-4 0l2 2" />
    </svg>
  );
}
