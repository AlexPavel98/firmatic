"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogIn, Mail, Lock, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight">
          Bine ai revenit
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Conectează-te la contul tău Firmatic
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-medium text-foreground"
          >
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="exemplu@firma.ro"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11 pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-medium text-foreground"
          >
            Parolă
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-11 pl-10"
            />
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="btn-hover glow-teal-sm h-11 w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <LogIn className="mr-2 h-4 w-4" />
          )}
          {loading ? "Se conectează..." : "Conectare"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Nu ai cont?{" "}
        <Link
          href="/register"
          className="font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          Creează cont gratuit
        </Link>
      </p>
    </div>
  );
}
