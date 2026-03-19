"use client";

import { type FormEvent, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LockKeyhole, Sprout, Leaf } from "lucide-react";

interface AuthGateProps {
  hasPassword: boolean;
  onSetupPassword: (value: string) => void;
  onUnlock: (value: string) => boolean;
}

export function AuthGate({
  hasPassword,
  onSetupPassword,
  onUnlock,
}: AuthGateProps) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const heading = useMemo(
    () => (hasPassword ? "Unlock AgriVerse" : "Set Demo Password"),
    [hasPassword],
  );

  const subheading = useMemo(
    () =>
      hasPassword
        ? "Welcome back. Enter your demo password to access the intelligent agriculture assistant."
        : "Welcome to AgriVerse. Set a simple password for this demo. Security is intentionally basic.",
    [hasPassword],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!password.trim()) {
      setError("Password cannot be empty.");
      return;
    }

    if (!hasPassword) {
      if (password !== confirm) {
        setError("Passwords do not match.");
        return;
      }

      onSetupPassword(password);
      return;
    }

    const unlocked = onUnlock(password);
    if (!unlocked) {
      setError("Incorrect password.");
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden auth-mesh-bg px-6 py-10 flex items-center justify-center">
      {/* Decorative floating elements */}
      <div className="absolute top-[15%] left-[10%] w-32 h-32 bg-primary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: "0s" }} />
      <div className="absolute bottom-[20%] right-[15%] w-40 h-40 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />

      <section className="relative w-full max-w-md chat-reveal" style={{ animationDelay: "100ms" }}>
        <div className="glass-panel rounded-[2rem] p-8 md:p-10 relative overflow-hidden">
          {/* Subtle inner gradient top right */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

          <div className="mb-8 flex flex-col items-center text-center">
            <div className="relative mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-emerald-700 text-white shadow-lg shadow-primary/30 animate-float">
              <Sprout className="h-8 w-8" strokeWidth={2.5} />
              <div className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-primary shadow-sm dark:bg-slate-800">
                <Leaf className="h-4 w-4" />
              </div>
            </div>

            <p className="font-display text-xs font-bold uppercase tracking-[0.2em] text-primary/80 mb-2">
              AgriVerse Demo
            </p>
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
              {heading}
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground/90 balanced">
              {subheading}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground/80 pl-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                  <LockKeyhole className="h-4 w-4" />
                </div>
                <Input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter password"
                  autoFocus
                  className="h-12 pl-10 rounded-xl bg-background/50 border-white/20 dark:border-white/10 shadow-sm focus-visible:ring-primary/50 focus-visible:bg-background/80 transition-all font-medium backdrop-blur-sm"
                />
              </div>
            </div>

            {!hasPassword && (
              <div className="space-y-2 chat-reveal" style={{ animationDelay: "200ms" }}>
                <label className="text-sm font-semibold text-foreground/80 pl-1">
                  Confirm Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
                    <LockKeyhole className="h-4 w-4" />
                  </div>
                  <Input
                    type="password"
                    value={confirm}
                    onChange={(event) => setConfirm(event.target.value)}
                    placeholder="Re-enter password"
                    className="h-12 pl-10 rounded-xl bg-background/50 border-white/20 dark:border-white/10 shadow-sm focus-visible:ring-primary/50 focus-visible:bg-background/80 transition-all font-medium backdrop-blur-sm"
                  />
                </div>
              </div>
            )}

            {error && (
              <p className="chat-reveal text-[13px] font-medium text-destructive bg-destructive/10 px-3 py-2 rounded-lg border border-destructive/20 text-center">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="h-12 w-full rounded-xl bg-gradient-to-r from-primary to-emerald-600 text-white font-semibold tracking-wide shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] hover:shadow-primary/40 active:scale-[0.98]"
            >
              {hasPassword ? "Access AgriVerse" : "Save & Continue"}
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}
