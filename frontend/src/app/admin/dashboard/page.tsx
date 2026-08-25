"use client";

import { useEffect, useState } from "react";
import { api, getApiErrorMessage } from "@/services/api";
import type { DashboardSummary } from "@/types";

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadSummary() {
      try {
        const { data } = await api.get<DashboardSummary>("/dashboard");

        if (active) {
          setSummary(data);
        }
      } catch (requestError) {
        if (active) {
          setError(getApiErrorMessage(requestError, "Não foi possível carregar o dashboard."));
        }
      }
    }

    void loadSummary();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <header>
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">Visão geral</p>
        <h2 className="mt-2 text-3xl font-bold text-slate-900">Dashboard</h2>
        <p className="mt-2 text-slate-500">Indicadores atualizados diretamente da API.</p>
      </header>

      {error ? <p className="mt-8 rounded-2xl bg-red-50 p-5 text-red-700">{error}</p> : null}

      <section className="mt-8 grid gap-5 sm:grid-cols-2">
        {[
          { label: "Usuários cadastrados", value: summary?.totalUsers, accent: "bg-orange-500" },
          { label: "Produtos cadastrados", value: summary?.totalProducts, accent: "bg-slate-900" },
        ].map((card) => (
          <article className="overflow-hidden rounded-2xl bg-white shadow-sm" key={card.label}>
            <div className={`h-2 ${card.accent}`} />
            <div className="p-7">
              <p className="text-sm font-semibold text-slate-500">{card.label}</p>
              <p className="mt-3 text-5xl font-black text-slate-900">
                {card.value ?? <span className="text-slate-300">—</span>}
              </p>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
