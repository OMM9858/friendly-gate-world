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
  {
    id: "1",
    username: "Ahmed Hassan",
    deviceId: "00:1A:2B:3C:4D:5E",
    area: "Pool",
    lastLogin: "2026-05-14 10:30 AM",
  },
  {
    id: "2",
    username: "Sara Mohamed",
    deviceId: "00:1A:2B:3C:4D:5E",
    area: "Restaurant",
    lastLogin: "2026-05-14 09:15 AM",
  },
  {
    id: "3",
    username: "Khaled Ali",
    deviceId: "00:1A:2B:3C:4D:5E",
    area: "Club",
    lastLogin: "2026-05-13 11:45 PM",
  },
  {
    id: "4",
    username: "Nour Ibrahim",
    deviceId: "00:1A:2B:3C:4D:5E",
    area: "Aquapark",
    lastLogin: "2026-05-14 08:20 AM",
  },
  {
    id: "5",
    username: "Ahmed Mahmoud",
    deviceId: "00:1A:2B:3C:4D:5E",
    area: "Cafe",
    lastLogin: "2026-05-13 07:30 PM",
  },
  {
    id: "6",
    username: "Layla Mahmoud",
    deviceId: "00:1A:2B:3C:4D:5E",
    area: "Beach",
    lastLogin: "2026-05-14 11:00 AM",
  },
];

function DashboardPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>(SEED);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [showAddUser, setShowAddUser] = useState(false);
  const [logsUser, setLogsUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);
  const [resetUser, setResetUser] = useState<User | null>(null);
  const [resetConfirmUser, setResetConfirmUser] = useState<User | null>(null);
  const [showLogout, setShowLogout] = useState(false);

  const addUser = (username: string) => {
    setUsers((u) => [
      ...u,
      {
        id: crypto.randomUUID(),
        username,
        deviceId: "00:1A:2B:3C:4D:5E",
        area: "—",
        lastLogin: "Never",
      },
    ]);
    setShowAddUser(false);
  };

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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 py-6 sm:py-10">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-start md:justify-between gap-5 md:gap-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1
                style={{
                  fontFamily: "'Avenir LT Std', Avenir, ui-sans-serif, system-ui, sans-serif",
                }}
                className="font-medium text-[48px] leading-[72px] tracking-[0px] text-[#131E30]"
              >
                Admin Panel
              </h1>
              <p className="text-muted-foreground mt-1.5 sm:mt-2 text-sm sm:text-base">
                Manage all users and system logs
              </p>
            </div>
            {/* Sign out — visible on mobile next to the title */}
            <button
              onClick={() => setShowLogout(true)}
              aria-label="Sign out"
              className="md:hidden rounded-lg p-2 text-navy hover:bg-muted transition shrink-0"
            >
              <LogoutIcon />
            </button>
          </div>

          <div className="flex-1 md:max-w-md md:mx-8 md:mt-11">
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

          <div className="flex flex-wrap items-center gap-3 md:mt-11">
            <button
              onClick={() => setShowAddUser(true)}
              className="inline-flex flex-1 md:flex-none items-center justify-center gap-2 rounded-xl bg-navy text-navy-foreground px-4 py-2.5 text-sm font-medium hover:opacity-90 transition"
            >
              <AddUserIcon /> Add User
            </button>
            <button
              onClick={bulkDelete}
              disabled={selected.size === 0}
              className="inline-flex flex-1 md:flex-none items-center justify-center gap-2 rounded-xl border-2 border-destructive text-destructive px-4 py-2.5 text-sm font-medium hover:bg-destructive hover:text-destructive-foreground transition disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-destructive"
            >
              <TrashIcon /> Bulk delete
            </button>
            <button
              onClick={() => setShowLogout(true)}
              aria-label="Sign out"
              className="hidden md:inline-flex rounded-lg p-2 text-navy hover:bg-muted transition"
            >
              <LogoutIcon />
            </button>
          </div>
        </header>

        <div className="mt-6 h-px w-full bg-gold/70" />

        {/* Table — tablet & desktop */}
        <section className="mt-6 hidden md:block rounded-2xl border-2 border-gold overflow-hidden">
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
                      (selected.has(u.id) ? "bg-gold/20" : i % 2 ? "bg-muted/40" : "bg-card")
                    }
                    onClick={() => toggle(u.id)}
                  >
                    <td className="px-6 py-4 font-medium text-navy">{u.username}</td>
                    <td className="px-6 py-4 text-foreground/80 font-mono text-sm">{u.deviceId}</td>
                    <td className="px-6 py-4 text-foreground/80">{u.area}</td>
                    <td className="px-6 py-4 text-muted-foreground">{u.lastLogin}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        <ActionBtn tone="gold" onClick={() => setLogsUser(u)}>
                          <EyeIcon /> Logs
                        </ActionBtn>
                        <ActionBtn tone="navy" onClick={() => setResetUser(u)}>
                          <ResetIcon /> Reset
                        </ActionBtn>
                        <ActionBtn tone="red" onClick={() => setDeleteUser(u)}>
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

        {/* Cards — mobile */}
        <section className="mt-6 space-y-4 md:hidden">
          {filtered.map((u) => (
            <article
              key={u.id}
              onClick={() => toggle(u.id)}
              className={
                "rounded-2xl border-2 p-4 transition " +
                (selected.has(u.id) ? "border-gold bg-gold/20" : "border-border bg-card")
              }
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-medium text-navy text-lg">{u.username}</h3>
                <span className="text-xs text-muted-foreground text-right shrink-0">
                  {u.lastLogin}
                </span>
              </div>

              <dl className="mt-3 space-y-1.5 text-sm">
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Device ID</dt>
                  <dd className="font-mono text-foreground/80 text-right break-all">
                    {u.deviceId}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted-foreground">Area</dt>
                  <dd className="text-foreground/80 text-right">{u.area}</dd>
                </div>
              </dl>

              <div className="mt-4 flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
                <ActionBtn tone="gold" onClick={() => setLogsUser(u)}>
                  <EyeIcon /> Logs
                </ActionBtn>
                <ActionBtn tone="navy" onClick={() => setResetUser(u)}>
                  <ResetIcon /> Reset
                </ActionBtn>
                <ActionBtn tone="red" onClick={() => setDeleteUser(u)}>
                  <TrashIcon /> Delete
                </ActionBtn>
              </div>
            </article>
          ))}
          {filtered.length === 0 && (
            <div className="rounded-2xl border-2 border-gold px-6 py-12 text-center text-muted-foreground">
              No users match your search.
            </div>
          )}
        </section>
      </div>

      {showAddUser && <AddUserModal onClose={() => setShowAddUser(false)} onAdd={addUser} />}

      {logsUser && <LogsModal user={logsUser} onClose={() => setLogsUser(null)} />}

      {deleteUser && (
        <DeleteUserModal
          user={deleteUser}
          onClose={() => setDeleteUser(null)}
          onConfirm={() => {
            remove(deleteUser.id);
            setDeleteUser(null);
          }}
        />
      )}

      {resetUser && (
        <NewPasswordModal
          onClose={() => setResetUser(null)}
          onReset={() => {
            setResetConfirmUser(resetUser);
            setResetUser(null);
          }}
        />
      )}

      {resetConfirmUser && (
        <ResetPasswordModal
          user={resetConfirmUser}
          onClose={() => setResetConfirmUser(null)}
          onConfirm={() => setResetConfirmUser(null)}
        />
      )}

      {showLogout && (
        <SignOutModal
          onClose={() => setShowLogout(false)}
          onConfirm={() => navigate({ to: "/" })}
        />
      )}
    </div>
  );
}

function SignOutModal({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 p-4 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label="Sign out"
        onMouseDown={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-3xl bg-card p-6 sm:p-10 shadow-2xl"
      >
        <h2 className="font-display font-bold text-[28px] leading-none tracking-normal text-navy">
          Sign Out
        </h2>

        <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
          Are you sure you want to sign out? You will be returned to the login page.
        </p>

        <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-border bg-card px-7 py-3 text-lg font-medium text-foreground hover:bg-muted transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-xl bg-navy px-7 py-3 text-lg font-medium text-navy-foreground hover:opacity-90 transition"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

function NewPasswordModal({ onClose, onReset }: { onClose: () => void; onReset: () => void }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return setError("Password is required.");
    if (password !== confirm) return setError("Passwords do not match.");
    onReset();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 p-4 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="New Password"
        onMouseDown={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl bg-card p-6 sm:p-10 shadow-2xl"
      >
        <h2 className="font-display font-bold text-[28px] leading-[100%] tracking-[0%] text-[#131E30] text-center">
          New Password
        </h2>

        <form onSubmit={submit} className="mt-8 space-y-7">
          <UnderlineInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={(v) => {
              setPassword(v);
              setError("");
            }}
          />
          <UnderlineInput
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={(v) => {
              setConfirm(v);
              setError("");
            }}
          />

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-center pt-2">
            <button
              type="submit"
              className="rounded-xl bg-navy text-navy-foreground px-12 py-3.5 text-lg font-medium hover:opacity-90 transition"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ResetPasswordModal({
  user,
  onClose,
  onConfirm,
}: {
  user: User;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 p-4 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label={`Reset password for ${user.username}`}
        onMouseDown={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-3xl bg-card p-6 sm:p-10 shadow-2xl"
      >
        <h2 className="font-display font-bold text-[28px] leading-none tracking-normal text-navy">
          Reset Password
        </h2>

        <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
          Are you sure you want to reset the password for{" "}
          <span className="font-bold text-foreground">{user.username}</span>? A new temporary
          password will be sent to their registered email.
        </p>

        <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-border bg-card px-7 py-3 text-lg font-medium text-foreground hover:bg-muted transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-xl bg-navy px-7 py-3 text-lg font-medium text-gold hover:opacity-90 transition"
          >
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteUserModal({
  user,
  onClose,
  onConfirm,
}: {
  user: User;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 p-4 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label={`Delete ${user.username}`}
        onMouseDown={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-3xl bg-card p-6 sm:p-10 shadow-2xl"
      >
        <h2 className="font-avenir text-[24px] font-medium leading-[24px] tracking-normal text-destructive">
          Delete User
        </h2>

        <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
          Are you sure you want to delete{" "}
          <span className="font-bold text-foreground">{user.username}</span>? This action cannot be
          undone and all user data will be permanently removed.
        </p>

        <div className="mt-8 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-xl border border-border bg-card px-7 py-3 text-lg font-medium text-foreground hover:bg-muted transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-xl bg-destructive px-7 py-3 text-lg font-medium text-destructive-foreground hover:opacity-90 transition"
          >
            Delete User
          </button>
        </div>
      </div>
    </div>
  );
}

type LogEntry = {
  event: string;
  device: string;
  location: string;
  time: string;
};

function logsFor(user: User): LogEntry[] {
  const device = "iPad Pro";
  const loc = user.area;
  return [
    { event: "Login", device, location: loc, time: "2026-05-14 10:30 AM" },
    { event: "Failed Login Attempt", device, location: loc, time: "2026-05-14 10:25 AM" },
    { event: "Logout", device, location: loc, time: "2026-05-13 06:15 PM" },
    { event: "Login", device, location: loc, time: "2026-05-13 02:00 PM" },
  ];
}

function LogsModal({ user, onClose }: { user: User; onClose: () => void }) {
  const logs = logsFor(user);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 p-4 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`User Activity Logs - ${user.username}`}
        onMouseDown={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl bg-card p-6 sm:p-10 shadow-2xl"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-6 top-6 rounded-lg p-1.5 text-navy hover:bg-muted transition"
        >
          <CloseIcon />
        </button>

        <h2
          style={{ fontFamily: "'Avenir LT Std', Avenir, ui-sans-serif, system-ui, sans-serif" }}
          className="font-semibold text-[24px] leading-[24px] tracking-[0px] text-[#131E30] pr-10"
        >
          User Activity Logs - {user.username}
        </h2>
        <p className="text-muted-foreground mt-2 text-base">
          Complete activity history for this user
        </p>

        <div className="mt-6 space-y-4">
          {logs.map((log, i) => (
            <div key={i} className="rounded-xl border-l-4 border-gold bg-muted/40 px-6 py-4">
              <div className="flex items-start justify-between gap-4">
                <h3
                  style={{
                    fontFamily: "'Avenir LT Std', Avenir, ui-sans-serif, system-ui, sans-serif",
                  }}
                  className="text-[18px] font-medium leading-[24px] tracking-[0px] text-[#131E30]"
                >
                  {log.event}
                </h3>
                <span className="text-sm text-muted-foreground whitespace-nowrap mt-1">
                  {log.time}
                </span>
              </div>
              <p className="text-muted-foreground mt-2">Device: {log.device}</p>
              <p className="text-muted-foreground">Location: {log.location}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AddUserModal({
  onClose,
  onAdd,
}: {
  onClose: () => void;
  onAdd: (username: string) => void;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return setError("User name is required.");
    if (!password) return setError("Password is required.");
    if (password !== confirm) return setError("Passwords do not match.");
    onAdd(username.trim());
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 p-4 backdrop-blur-sm"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Add User"
        onMouseDown={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl bg-card p-6 sm:p-10 shadow-2xl"
      >
        <h2 className="font-display font-bold text-[28px] leading-[100%] tracking-[0%] text-[#131E30] text-center">
          Add User
        </h2>

        <form onSubmit={submit} className="mt-8 space-y-7">
          <UnderlineInput
            placeholder="User Name"
            value={username}
            onChange={(v) => {
              setUsername(v);
              setError("");
            }}
          />
          <UnderlineInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={(v) => {
              setPassword(v);
              setError("");
            }}
          />
          <UnderlineInput
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={(v) => {
              setConfirm(v);
              setError("");
            }}
          />

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-center pt-2">
            <button
              type="submit"
              className="rounded-xl bg-navy text-navy-foreground px-12 py-3.5 text-lg font-medium hover:opacity-90 transition"
            >
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function UnderlineInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full border-0 border-b border-gold bg-transparent px-1 pb-2 text-lg text-navy placeholder:text-muted-foreground outline-none focus:border-b-2 focus:border-gold transition"
    />
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
    gold: "border-gold text-gold hover:bg-gold/20",
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
    <svg
      className={className}
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
function AddUserIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="9" cy="8" r="4" />
      <path d="M2 21c1-4 4-6 7-6s6 2 7 6" />
      <path d="M19 8v6M16 11h6" />
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 6h18M8 6V4h8v2m-9 0v14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V6" />
    </svg>
  );
}
function EyeIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function ResetIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}
function LogoutIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <rect x="3" y="3" width="11" height="18" rx="2" />
      <path d="M16 12h6m0 0-3-3m3 3-3 3" />
    </svg>
  );
}
