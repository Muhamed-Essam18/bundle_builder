import type { PersistedBuilderState, Product, QuantityState, ActiveVariantState } from "@/types/bundle_types";

// Builds the default active variant selection for products that offer variants.
export function buildInitialActiveVariants(products: Product[]): ActiveVariantState {
  return products.reduce<ActiveVariantState>((acc, product) => {
    if (product.variants?.length) {
      acc[product.id] = product.defaultVariantId ?? product.variants[0].id;
    }
    return acc;
  }, {});
}

const STORAGE_KEY = "builderState";

// Reads saved builder state from localStorage and clears bad data.
export function readPersistedBuilderState(): PersistedBuilderState {
  if (typeof window === "undefined") return {};

  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (!saved) return {};

  try {
    return JSON.parse(saved) as PersistedBuilderState;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return {};
  }
}
// Builds the default quantity map from the product definitions.
export function buildInitialQuantities(products: Product[]): QuantityState {
  return products.reduce<QuantityState>((acc, product) => {
    acc[product.id] = { ...product.initialQuantities };
    return acc;
  }, {});
}