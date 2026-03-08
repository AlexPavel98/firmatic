"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Mail, Lock, Loader2, CheckCircle } from "lucide-react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Parolele nu se potrivesc.");
      return;
    }

    if (password.length < 6) {
      setError("Parola trebuie să aibă minimum 6 caractere.");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight">
          Verifică-ți email-ul
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Am trimis un link de confirmare la{" "}
          <span className="font-semibold text-foreground">{email}</span>.
          <br />
          Verifică inbox-ul (și folderul spam) pentru a-ți activa contul.
        </p>
        <Link href="/login">
          <Button
            variant="outline"
            className="btn-hover mt-6 rounded-full"
          >
            Înapoi la conectare
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight">
          Creează cont
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Începe gratuit — fără card bancar
        </p>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
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
              placeholder="Minimum 6 caractere"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-11 pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="confirm-password"
            className="text-sm font-medium text-foreground"
          >
            Confirmă parola
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="confirm-password"
              type="password"
              placeholder="Repetă parola"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            <UserPlus className="mr-2 h-4 w-4" />
          )}
          {loading ? "Se creează contul..." : "Creează cont"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Ai deja cont?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          Conectează-te
        </Link>
      </p>
    </div>
  );
}
