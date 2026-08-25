"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import { api, getApiErrorMessage } from "@/services/api";
import { getToken, setToken } from "@/services/authStorage";
import type { LoginResponse } from "@/types";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (getToken()) {
      router.replace("/admin/dashboard");
    }
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Informe e-mail e senha.");
      return;
    }

    setSubmitting(true);

    try {
      const { data } = await api.post<LoginResponse>("/auth/login", { email, password });
      setToken(data.token);
      router.replace("/admin/dashboard");
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Não foi possível entrar. Tente novamente."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-slate-950 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="hidden bg-[radial-gradient(circle_at_top_left,_#fb923c,_#c2410c_45%,_#172033_100%)] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-orange-100">
            MinhaFabrica
          </p>
          <h1 className="mt-8 max-w-xl text-5xl font-bold leading-tight">
            Gestão simples para decisões que movem a fábrica.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-orange-50/85">
            Acompanhe usuários, produtos e indicadores em um painel direto e responsivo.
          </p>
        </div>
        <p className="text-sm text-orange-100/70">Desafio técnico full stack</p>
      </section>

      <section className="flex items-center justify-center bg-slate-100 p-5 sm:p-10">
        <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl sm:p-10">
          <div className="mb-8">
            <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500 text-lg font-black text-white">
              MF
            </div>
            <p className="text-sm font-semibold text-orange-600">Bem-vindo de volta</p>
            <h2 className="mt-1 text-3xl font-bold text-slate-900">Acesse sua conta</h2>
            <p className="mt-2 text-sm text-slate-500">Use as credenciais do administrador.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="block text-sm font-semibold text-slate-700">
              E-mail
              <input
                autoComplete="email"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@example.com"
                required
                type="email"
                value={email}
              />
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              Senha
              <input
                autoComplete="current-password"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                minLength={8}
                onChange={(event) => setPassword(event.target.value)}
                required
                type="password"
                value={password}
              />
            </label>

            {error ? (
              <p aria-live="polite" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            <button
              className="w-full rounded-xl bg-orange-500 px-4 py-3 font-bold text-white transition hover:bg-orange-600"
              disabled={submitting}
              type="submit"
            >
              {submitting ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
