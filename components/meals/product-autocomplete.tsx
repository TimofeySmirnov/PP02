"use client";

import { useEffect, useState } from "react";

type ProductSuggestion = {
  id: string;
  name: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  isCustom: boolean;
};

type ProductAutocompleteProps = {
  error?: string;
};

export function ProductAutocomplete({ error }: ProductAutocompleteProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductSuggestion | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/products?query=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          setSuggestions([]);
          return;
        }

        const data = (await response.json()) as ProductSuggestion[];
        setSuggestions(data);
      } catch {
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [query]);

  return (
    <div className="grid gap-2 text-sm">
      <label className="grid gap-2">
        <span className="font-medium text-[var(--foreground)]">Продукт</span>
        <input
          aria-invalid={Boolean(error)}
          className="h-12 rounded-2xl border border-[var(--border)] bg-white px-4 text-[var(--foreground)] outline-none transition placeholder:text-[#978c7b] focus:border-[var(--primary)] focus:ring-4 focus:ring-[var(--ring)] aria-[invalid=true]:border-red-400 aria-[invalid=true]:focus:ring-red-100"
          onChange={(event) => {
            setQuery(event.target.value);
            setSelectedProduct(null);
          }}
          placeholder="Начните вводить название продукта"
          value={query}
        />
      </label>

      <input name="productId" type="hidden" value={selectedProduct?.id ?? ""} />

      {error ? <span className="text-xs text-red-600">{error}</span> : null}

      {!selectedProduct && query.trim().length >= 2 ? (
        <div className="rounded-2xl border border-[var(--border)] bg-white p-2">
          {isLoading ? (
            <p className="px-3 py-2 text-sm text-[var(--muted)]">Ищем продукты...</p>
          ) : suggestions.length > 0 ? (
            <div className="grid gap-1">
              {suggestions.map((product) => (
                <button
                  className="rounded-xl px-3 py-2 text-left transition hover:bg-[var(--surface-strong)]"
                  key={product.id}
                  onClick={() => {
                    setSelectedProduct(product);
                    setQuery(product.name);
                    setSuggestions([]);
                  }}
                  type="button"
                >
                  <span className="block text-sm font-medium text-[var(--foreground)]">{product.name}</span>
                  <span className="block text-xs text-[var(--muted)]">
                    {product.caloriesPer100g} ккал, Б {product.proteinPer100g} / Ж {product.fatPer100g} / У{" "}
                    {product.carbsPer100g} на 100 г
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <p className="px-3 py-2 text-sm text-[var(--muted)]">
              Ничего не найдено ни в локальной базе, ни во внешнем каталоге.
            </p>
          )}
        </div>
      ) : null}

      {selectedProduct ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-700">
          Выбран продукт: {selectedProduct.name}. Значения будут пересчитаны пропорционально граммам.
        </div>
      ) : null}
    </div>
  );
}
