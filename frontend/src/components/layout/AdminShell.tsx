"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { clearToken, getToken } from "@/services/authStorage";

const navigation = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/usuarios", label: "Usuários" },
  { href: "/admin/produtos", label: "Produtos" },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.replace("/login");
      return;
    }

    setReady(true);
  }, [router]);

  function logout() {
    clearToken();
    router.replace("/login");
  }

  if (!ready) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm font-semibold text-slate-500">Verificando autenticação...</p>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      <aside className="bg-slate-900 px-5 py-5 text-white lg:fixed lg:inset-y-0 lg:w-64 lg:px-6 lg:py-8">
        <div className="flex items-center justify-between lg:block">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-orange-400">
              MinhaFabrica
            </p>
            <h1 className="mt-1 text-xl font-bold">Painel de gestão</h1>
          </div>
          <button
            className="rounded-lg border border-slate-700 px-3 py-2 text-sm hover:bg-slate-800 lg:hidden"
            onClick={logout}
            type="button"
          >
            Sair
          </button>
        </div>

        <nav className="mt-5 flex gap-2 overflow-x-auto lg:mt-10 lg:block lg:space-y-2">
          {navigation.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                className={`block shrink-0 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  active ? "bg-orange-500 text-white" : "text-slate-300 hover:bg-slate-800"
                }`}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          className="mt-10 hidden w-full rounded-xl border border-slate-700 px-4 py-3 text-left text-sm font-semibold text-slate-300 hover:bg-slate-800 lg:block"
          onClick={logout}
          type="button"
        >
          Encerrar sessão
        </button>
      </aside>

      <main className="min-w-0 flex-1 p-5 sm:p-8 lg:ml-64 lg:p-10">{children}</main>
    </div>
  );
}
