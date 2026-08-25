"use client";

import type { FormEvent } from "react";
import { useCallback, useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { api, getApiErrorMessage } from "@/services/api";
import type { Product } from "@/types";

type ProductFormState = {
  name: string;
  description: string;
  price: string;
  stock: string;
  category: string;
};

const emptyForm: ProductFormState = {
  name: "",
  description: "",
  price: "",
  stock: "",
  category: "",
};

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await api.get<Product[]>("/products");
      setProducts(data);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Não foi possível carregar os produtos."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  function openCreateModal() {
    setEditingProduct(null);
    setForm(emptyForm);
    setFormError("");
    setModalOpen(true);
  }

  function openEditModal(product: Product) {
    setEditingProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      stock: String(product.stock),
      category: product.category,
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

    const price = Number(form.price);
    const stock = Number(form.stock);

    if (!form.name.trim() || !form.description.trim() || !form.category.trim()) {
      setFormError("Nome, descrição e categoria são obrigatórios.");
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      setFormError("O preço deve ser maior que zero.");
      return;
    }

    if (!Number.isInteger(stock) || stock < 0) {
      setFormError("O estoque deve ser um número inteiro maior ou igual a zero.");
      return;
    }

    setSaving(true);

    const payload = {
      name: form.name,
      description: form.description,
      price,
      stock,
      category: form.category,
    };

    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, payload);
      } else {
        await api.post("/products", payload);
      }

      setModalOpen(false);
      await loadProducts();
    } catch (requestError) {
      setFormError(getApiErrorMessage(requestError, "Não foi possível salvar o produto."));
    } finally {
      setSaving(false);
    }
  }

  async function deleteProduct(product: Product) {
    const confirmed = window.confirm(`Excluir o produto “${product.name}”?`);

    if (!confirmed) {
      return;
    }

    setDeletingId(product.id);
    setError("");

    try {
      await api.delete(`/products/${product.id}`);
      setProducts((currentProducts) => currentProducts.filter((item) => item.id !== product.id));
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Não foi possível excluir o produto."));
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div>
      <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-orange-600">Catálogo</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">Produtos</h2>
          <p className="mt-2 text-slate-500">Gerencie preços, estoque e categorias.</p>
        </div>
        <button
          className="rounded-xl bg-orange-500 px-5 py-3 font-bold text-white hover:bg-orange-600"
          onClick={openCreateModal}
          type="button"
        >
          Novo produto
        </button>
      </header>

      {error ? <p className="mt-6 rounded-xl bg-red-50 p-4 text-red-700">{error}</p> : null}

      <section className="mt-8 overflow-hidden rounded-2xl bg-white shadow-sm">
        {loading ? (
          <p className="p-8 text-center text-slate-500">Carregando produtos...</p>
        ) : products.length === 0 ? (
          <p className="p-8 text-center text-slate-500">Nenhum produto cadastrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-4">Produto</th>
                  <th className="px-6 py-4">Categoria</th>
                  <th className="px-6 py-4">Preço</th>
                  <th className="px-6 py-4">Estoque</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((product) => (
                  <tr className="text-slate-700" key={product.id}>
                    <td className="max-w-sm px-6 py-4">
                      <p className="font-semibold text-slate-900">{product.name}</p>
                      <p className="mt-1 truncate text-xs text-slate-500">{product.description}</p>
                    </td>
                    <td className="px-6 py-4">{product.category}</td>
                    <td className="px-6 py-4 font-semibold">
                      {currencyFormatter.format(product.price)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          product.stock === 0
                            ? "bg-red-50 text-red-700"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          className="rounded-lg border border-slate-300 px-3 py-2 font-semibold hover:bg-slate-50"
                          onClick={() => openEditModal(product)}
                          type="button"
                        >
                          Editar
                        </button>
                        <button
                          className="rounded-lg border border-red-200 px-3 py-2 font-semibold text-red-600 hover:bg-red-50"
                          disabled={deletingId === product.id}
                          onClick={() => void deleteProduct(product)}
                          type="button"
                        >
                          {deletingId === product.id ? "Excluindo..." : "Excluir"}
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
        <Modal title={editingProduct ? "Editar produto" : "Novo produto"} onClose={closeModal}>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <label className="block text-sm font-semibold text-slate-700">
              Nome
              <input
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-orange-500"
                maxLength={120}
                onChange={(event) =>
                  setForm((current) => ({ ...current, name: event.target.value }))
                }
                required
                value={form.name}
              />
            </label>

            <label className="block text-sm font-semibold text-slate-700">
              Descrição
              <textarea
                className="mt-2 min-h-28 w-full resize-y rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-orange-500"
                maxLength={1000}
                onChange={(event) =>
                  setForm((current) => ({ ...current, description: event.target.value }))
                }
                required
                value={form.description}
              />
            </label>

            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm font-semibold text-slate-700">
                Preço
                <input
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-orange-500"
                  min="0.01"
                  onChange={(event) =>
                    setForm((current) => ({ ...current, price: event.target.value }))
                  }
                  required
                  step="0.01"
                  type="number"
                  value={form.price}
                />
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                Estoque
                <input
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-orange-500"
                  min="0"
                  onChange={(event) =>
                    setForm((current) => ({ ...current, stock: event.target.value }))
                  }
                  required
                  step="1"
                  type="number"
                  value={form.stock}
                />
              </label>
            </div>

            <label className="block text-sm font-semibold text-slate-700">
              Categoria
              <input
                className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-orange-500"
                maxLength={100}
                onChange={(event) =>
                  setForm((current) => ({ ...current, category: event.target.value }))
                }
                required
                value={form.category}
              />
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
