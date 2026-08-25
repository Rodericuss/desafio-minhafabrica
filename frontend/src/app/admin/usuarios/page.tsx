"use client";

import type { FormEvent } from "react";
import { useCallback, useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { api, getApiErrorMessage } from "@/services/api";
import type { User, UserProfile } from "@/types";

type UserFormState = {
  name: string;
  email: string;
  password: string;
  profile: UserProfile;
};

const emptyForm: UserFormState = {
  name: "",
  email: "",
  password: "",
  profile: "user",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "short" }).format(new Date(value));
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState<UserFormState>(emptyForm);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await api.get<User[]>("/users");
      setUsers(data);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Não foi possível carregar os usuários."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  function openCreateModal() {
    setEditingUser(null);
    setForm(emptyForm);
    setFormError("");
    setModalOpen(true);
  }

  function openEditModal(user: User) {
    setEditingUser(user);
    setForm({
      name: user.name,
      email: user.email,
      password: "",
      profile: user.profile,
    });
    setFormError("");
    setModalOpen(true);
  }

  function closeModal() {
    if (!saving) {
      setModalOpen(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    if (!form.name.trim() || !form.email.trim()) {
      setFormError("Nome e e-mail são obrigatórios.");
      return;
    }

    if (!editingUser && form.password.length < 8) {
      setFormError("A senha deve possuir pelo menos 8 caracteres.");
      return;
    }

    if (editingUser && form.password && form.password.length < 8) {
      setFormError("A nova senha deve possuir pelo menos 8 caracteres.");
      return;
    }

    setSaving(true);

    const payload: Record<string, string> = {
      name: form.name,
      email: form.email,
      profile: form.profile,
    };

    if (form.password) {
      payload.password = form.password;
    }

    try {
      if (editingUser) {
        await api.put(`/users/${editingUser.id}`, payload);
      } else {
        await api.post("/users", payload);
      }

      setModalOpen(false);
      await loadUsers();
    } catch (requestError) {
      setFormError(getApiErrorMessage(requestError, "Não foi possível salvar o usuário."));
    } finally {
      setSaving(false);
    }
  }

  async function deleteUser(user: User) {
    const confirmed = window.confirm(`Excluir o usuário “${user.name}”?`);

    if (!confirmed) {
      return;
    }

    setDeletingId(user.id);
    setError("");

    try {
      await api.delete(`/users/${user.id}`);
      setUsers((currentUsers) => currentUsers.filter((item) => item.id !== user.id));
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Não foi possível excluir o usuário."));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">Cadastros</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">Usuários</h2>
          <p className="mt-2 text-slate-500">Gerencie acesso, dados e perfil dos usuários.</p>
        </div>
        <button
          className="rounded-xl bg-orange-500 px-5 py-3 font-bold text-white hover:bg-orange-600"
          onClick={openCreateModal}
          type="button"
        >
          Novo usuário
        </button>
      </header>

      {error ? <p className="mt-6 rounded-xl bg-red-50 p-4 text-red-700">{error}</p> : null}

      <section className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm">
        {loading ? (
          <p className="p-8 text-center text-slate-500">Carregando usuários...</p>
        ) : users.length === 0 ? (
          <p className="p-8 text-center text-slate-500">Nenhum usuário cadastrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4">Nome</th>
                  <th className="px-6 py-4">E-mail</th>
                  <th className="px-6 py-4">Perfil</th>
                  <th className="px-6 py-4">Cadastro</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr className="text-slate-700" key={user.id}>
                    <td className="px-6 py-4 font-semibold text-slate-900">{user.name}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-bold text-orange-700">
                        {user.profile === "admin" ? "Administrador" : "Usuário"}
                      </span>
                    </td>
                    <td className="px-6 py-4">{formatDate(user.createdAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          className="rounded-lg border border-slate-300 px-3 py-2 font-semibold hover:bg-slate-50"
                          onClick={() => openEditModal(user)}
                          type="button"
                        >
                          Editar
                        </button>
                        <button
                          className="rounded-lg border border-red-200 px-3 py-2 font-semibold text-red-600 hover:bg-red-50"
                          disabled={deletingId === user.id}
                          onClick={() => void deleteUser(user)}
                          type="button"
                        >
                          {deletingId === user.id ? "Excluindo..." : "Excluir"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {modalOpen ? (
        <Modal title={editingUser ? "Editar usuário" : "Novo usuário"} onClose={closeModal}>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="block text-sm font-semibold text-slate-700">
              Nome
              <input
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-orange-500"
                maxLength={100}
                onChange={(event) =>
                  setForm((current) => ({ ...current, name: event.target.value }))
                }
                required
                value={form.name}
              />
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              E-mail
              <input
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-orange-500"
                maxLength={254}
                onChange={(event) =>
                  setForm((current) => ({ ...current, email: event.target.value }))
                }
                required
                type="email"
                value={form.email}
              />
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              {editingUser ? "Nova senha (opcional)" : "Senha"}
              <input
                autoComplete="new-password"
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-orange-500"
                minLength={8}
                onChange={(event) =>
                  setForm((current) => ({ ...current, password: event.target.value }))
                }
                required={!editingUser}
                type="password"
                value={form.password}
              />
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              Perfil
              <select
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 outline-none focus:border-orange-500"
                onChange={(event) =>
                  setForm((current) => ({ ...current, profile: event.target.value as UserProfile }))
                }
                value={form.profile}
              >
                <option value="user">Usuário</option>
                <option value="admin">Administrador</option>
              </select>
            </label>

            {formError ? (
              <p aria-live="polite" className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
                {formError}
              </p>
            ) : null}

            <div className="flex justify-end gap-3 pt-2">
              <button
                className="rounded-xl border border-slate-300 px-5 py-3 font-semibold hover:bg-slate-50"
                disabled={saving}
                onClick={closeModal}
                type="button"
              >
                Cancelar
              </button>
              <button
                className="rounded-xl bg-orange-500 px-5 py-3 font-bold text-white hover:bg-orange-600"
                disabled={saving}
                type="submit"
              >
                {saving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </form>
        </Modal>
      ) : null}
    </div>
  );
}
