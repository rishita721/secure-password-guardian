import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Eye, EyeOff, Shield, Check, X } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Password Strength Checker" },
      { name: "description", content: "Check your password strength against length, case, number, and symbol rules." },
      { property: "og:title", content: "Password Strength Checker" },
      { property: "og:description", content: "Check your password strength against length, case, number, and symbol rules." },
    ],
  }),
  component: Index,
});

type Check = { label: string; test: (p: string) => boolean };

const CHECKS: Check[] = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "Uppercase letter (A-Z)", test: (p) => /[A-Z]/.test(p) },
  { label: "Lowercase letter (a-z)", test: (p) => /[a-z]/.test(p) },
  { label: "Number (0-9)", test: (p) => /\d/.test(p) },
  { label: "Special character (!@#$…)", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

function Index() {
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const results = useMemo(() => CHECKS.map((c) => ({ ...c, pass: c.test(password) })), [password]);
  const score = results.filter((r) => r.pass).length;

  const verdict = !password
    ? { label: "—", tone: "muted", color: "var(--muted-foreground)" }
    : score <= 2
    ? { label: "Weak", tone: "weak", color: "oklch(0.68 0.21 25)" }
    : score <= 4
    ? { label: "Medium", tone: "medium", color: "oklch(0.82 0.17 85)" }
    : { label: "Strong", tone: "strong", color: "oklch(0.78 0.18 155)" };

  return (
    <main className="dark min-h-screen bg-background text-foreground relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(600px circle at 15% 10%, oklch(0.35 0.18 265 / 0.35), transparent 60%), radial-gradient(700px circle at 90% 90%, oklch(0.4 0.18 180 / 0.25), transparent 60%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-2xl flex-col px-6 py-12">
        <header className="mb-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card/60 backdrop-blur">
            <Shield className="h-5 w-5" style={{ color: "oklch(0.78 0.15 200)" }} />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Password Strength Checker</h1>
            <p className="text-xs text-muted-foreground font-mono">// auditing entropy in real time</p>
          </div>
        </header>

        <section className="rounded-2xl border border-border bg-card/70 p-6 backdrop-blur-xl shadow-2xl">
          <label htmlFor="pw" className="mb-2 block text-sm font-medium text-muted-foreground">
            Enter password
          </label>
          <div className="relative">
            <input
              id="pw"
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••"
              autoComplete="new-password"
              className="w-full rounded-xl border border-input bg-background/60 px-4 py-3 pr-12 font-mono text-base outline-none ring-0 transition focus:border-transparent focus:ring-2"
              style={{ ["--tw-ring-color" as never]: verdict.color }}
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? "Hide password" : "Show password"}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-muted-foreground transition hover:bg-accent hover:text-foreground"
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-xs font-mono">
              <span className="text-muted-foreground">strength</span>
              <span className="font-semibold tracking-wider uppercase" style={{ color: verdict.color }}>
                {verdict.label}
              </span>
            </div>
            <div className="flex gap-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-2 flex-1 rounded-full bg-secondary transition-all duration-300"
                  style={{
                    backgroundColor: i < score ? verdict.color : undefined,
                    boxShadow: i < score ? `0 0 12px ${verdict.color}` : undefined,
                  }}
                />
              ))}
            </div>
          </div>

          <ul className="mt-6 grid gap-2">
            {results.map((r) => (
              <li
                key={r.label}
                className="flex items-center gap-3 rounded-lg border border-border/60 bg-background/40 px-3 py-2 text-sm transition"
              >
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-md border"
                  style={{
                    borderColor: r.pass ? "oklch(0.78 0.18 155 / 0.5)" : "var(--border)",
                    backgroundColor: r.pass ? "oklch(0.78 0.18 155 / 0.15)" : "transparent",
                    color: r.pass ? "oklch(0.85 0.18 155)" : "var(--muted-foreground)",
                  }}
                >
                  {r.pass ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                </span>
                <span className={r.pass ? "text-foreground" : "text-muted-foreground"}>{r.label}</span>
              </li>
            ))}
          </ul>
        </section>

        <details className="mt-6 rounded-xl border border-border bg-card/40 p-4 text-sm backdrop-blur">
          <summary className="cursor-pointer font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Equivalent Bash script
          </summary>
          <pre className="mt-3 overflow-x-auto rounded-lg bg-background/70 p-4 text-xs leading-relaxed">
{`#!/usr/bin/env bash
# check_password.sh — usage: ./check_password.sh "yourPassword"
pw="\${1:-}"
score=0
[[ \${#pw} -ge 8 ]]              && ((score++))
[[ "$pw" =~ [A-Z] ]]            && ((score++))
[[ "$pw" =~ [a-z] ]]            && ((score++))
[[ "$pw" =~ [0-9] ]]            && ((score++))
[[ "$pw" =~ [^A-Za-z0-9] ]]     && ((score++))

if   (( score <= 2 )); then echo "Weak"
elif (( score <= 4 )); then echo "Medium"
else                        echo "Strong"
fi`}
          </pre>
        </details>

        <footer className="mt-auto pt-10 text-center text-xs text-muted-foreground font-mono">
          Checks run locally in your browser. Nothing is sent anywhere.
        </footer>
      </div>
    </main>
  );
}
