import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Admin Panel — M Hotels" },
      { name: "description", content: "Manage all users and system logs." },
    ],
  }),
  component: DashboardPage,
});

type User = {
  id: string;
  username: string;
  deviceId: string;
  area: string;
  lastLogin: string;
};

const SEED: User[] = [
  { id: "1", username: "Ahmed Hassan",  deviceId: "00:1A:2B:3C:4D:5E", area: "Pool",       lastLogin: "2026-05-14 10:30 AM" },
  { id: "2", username: "Sara Mohamed",  deviceId: "00:1A:2B:3C:4D:5E", area: "Restaurant", lastLogin: "2026-05-14 09:15 AM" },
  { id: "3", username: "Khaled Ali",    deviceId: "00:1A:2B:3C:4D:5E", area: "Club",       lastLogin: "2026-05-13 11:45 PM" },
  { id: "4", username: "Nour Ibrahim",  deviceId: "00:1A:2B:3C:4D:5E", area: "Aquapark",   lastLogin: "2026-05-14 08:20 AM" },
  { id: "5", username: "Ahmed Mahmoud", deviceId: "00:1A:2B:3C:4D:5E", area: "Cafe",       lastLogin: "2026-05-13 07:30 PM" },
  { id: "6", username: "Layla Mahmoud", deviceId: "00:1A:2B:3C:4D:5E", area: "Beach",      lastLogin: "2026-05-14 11:00 AM" },
];

function DashboardPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>(SEED);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return users;
    return users.filter(
      (u) => u.username.toLowerCase().includes(q) || u.area.toLowerCase().includes(q),
    );
  }, [users, query]);

  const toggle = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const bulkDelete = () => {
    setUsers((u) => u.filter((x) => !selected.has(x.id)));
    setSelected(new Set());
  };

  const remove = (id: string) => setUsers((u) => u.filter((x) => x.id !== id));

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div>
            <h1 className="font-display text-5xl md:text-6xl text-navy tracking-tight">
              Admin Panel
            </h1>
            <p className="text-muted-foreground mt-2 text-base">
              Manage all users and system logs
            </p>
          </div>

          <div className="flex-1 max-w-md md:mx-8">
            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search areas or users"
                className="w-full rounded-xl border border-border bg-card px-4 py-3 pr-10 text-sm shadow-sm outline-none focus:border-gold focus:ring-1 focus:ring-gold transition"
              />
              <SearchIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-xl bg-navy text-navy-foreground px-4 py-2.5 text-sm font-medium hover:opacity-90 transition">
              <AddUserIcon /> Add User
            </button>
            <button
              onClick={bulkDelete}
              disabled={selected.size === 0}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-destructive text-destructive px-4 py-2.5 text-sm font-medium hover:bg-destructive hover:text-destructive-foreground transition disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-destructive"
            >
              <TrashIcon /> Bulk delete
            </button>
            <button
              onClick={() => navigate({ to: "/" })}
              aria-label="Sign out"
              className="rounded-lg p-2 text-navy hover:bg-muted transition"
            >
              <LogoutIcon />
            </button>
          </div>
        </header>

        <div className="mt-6 h-px w-full bg-gold/70" />

        {/* Table */}
        <section className="mt-6 rounded-2xl border-2 border-gold overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-navy">
                  <th className="px-6 py-4 font-semibold text-base">Username</th>
                  <th className="px-6 py-4 font-semibold text-base">Device ID</th>
                  <th className="px-6 py-4 font-semibold text-base">Area</th>
                  <th className="px-6 py-4 font-semibold text-base">Last Login</th>
                  <th className="px-6 py-4 font-semibold text-base">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <tr
                    key={u.id}
                    className={
                      "border-t border-border " +
                      (selected.has(u.id) ? "bg-gold/10" : i % 2 ? "bg-muted/40" : "bg-card")
                    }
                    onClick={() => toggle(u.id)}
                  >
                    <td className="px-6 py-4 font-medium text-navy">{u.username}</td>
                    <td className="px-6 py-4 text-foreground/80 font-mono text-sm">{u.deviceId}</td>
                    <td className="px-6 py-4 text-foreground/80">{u.area}</td>
                    <td className="px-6 py-4 text-muted-foreground">{u.lastLogin}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <ActionBtn tone="gold"><EyeIcon /> Logs</ActionBtn>
                        <ActionBtn tone="navy"><ResetIcon /> Reset</ActionBtn>
                        <ActionBtn tone="red" onClick={() => remove(u.id)}>
                          <TrashIcon /> Delete
                        </ActionBtn>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      No users match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

function ActionBtn({
  children,
  tone,
  onClick,
}: {
  children: React.ReactNode;
  tone: "gold" | "navy" | "red";
  onClick?: () => void;
}) {
  const styles: Record<string, string> = {
    gold: "border-gold text-gold hover:bg-gold/10",
    navy: "border-navy text-navy hover:bg-navy/5",
    red: "border-destructive bg-destructive text-destructive-foreground hover:opacity-90",
  };
  return (
    <button
      onClick={onClick}
      className={
        "inline-flex items-center gap-1.5 rounded-lg border-2 px-3 py-1.5 text-sm font-medium transition " +
        styles[tone]
      }
    >
      {children}
    </button>
  );
}

/* Icons */
function SearchIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
    </svg>
  );
}
function AddUserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="9" cy="8" r="4" /><path d="M2 21c1-4 4-6 7-6s6 2 7 6" /><path d="M19 8v6M16 11h6" />
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 6h18M8 6V4h8v2m-9 0v14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V6" />
    </svg>
  );
}
function EyeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" /><circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function ResetIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" />
    </svg>
  );
}
function LogoutIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="11" height="18" rx="2" /><path d="M16 12h6m0 0-3-3m3 3-3 3" />
    </svg>
  );
}
