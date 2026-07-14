import type {
  ActiveVariantState,
  BundleTotals,
  PersistedBuilderState,
  Product,
  ProductCategory,
  QuantityState,
  ReviewLine,
  Step,
} from "@/types/bundle_types";

export const STORAGE_KEY = "bundle-builder-saved-config";

export const REVIEW_CATEGORIES: ProductCategory[] = [
  "Cameras",
  "Sensors",
  "Accessories",
  "Plan",
  "Shipping"
];

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

// Persists the current builder state to localStorage.
export function savePersistedBuilderState(state: PersistedBuilderState): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// Formats a numeric value as a currency string for display.
export function formatMoney(value: number): string {
  return `$${value.toFixed(2)}`;
}

// Builds the default quantity map from the product definitions.
export function buildInitialQuantities(products: Product[]): QuantityState {
  return products.reduce<QuantityState>((acc, product) => {
    acc[product.id] = { ...product.initialQuantities };
    return acc;
  }, {});
}

// Builds the default active variant selection for products that offer variants.
export function buildInitialActiveVariants(products: Product[]): ActiveVariantState {
  return products.reduce<ActiveVariantState>((acc, product) => {
    if (product.variants?.length) {
      acc[product.id] = product.defaultVariantId ?? product.variants[0].id;
    }
    return acc;
  }, {});
}

// Returns the total quantity selected for a single product across all variants.
export function getProductTotalQty(
  quantities: QuantityState,
  productId: string,
): number {
  return Object.values(quantities[productId] ?? {}).reduce(
    (sum, qty) => sum + qty,
    0,
  );
}

// Groups products under their matching step for the step sections.
export function buildProductsByStep(
  steps: Step[],
  products: Product[],
): Record<string, Product[]> {
  return steps.reduce<Record<string, Product[]>>((acc, step) => {
    acc[step.id] = products.filter(
      (product) => product.stepId === step.id && !product.reviewOnly,
    );
    return acc;
  }, {});
}

// Counts products with non-zero quantity for each step.
export function buildSelectedCountByStep(
  steps: Step[],
  productsByStep: Record<string, Product[]>,
  quantities: QuantityState,
): Record<string, number> {
  return steps.reduce<Record<string, number>>((acc, step) => {
    const selected = (productsByStep[step.id] ?? []).filter(
      (product) => getProductTotalQty(quantities, product.id) > 0,
    );
    acc[step.id] = selected.length;
    return acc;
  }, {});
}

// Converts selected quantities into the review panel line items.
export function buildReviewLines(
  products: Product[],
  quantities: QuantityState,
): ReviewLine[] {
  const lines: ReviewLine[] = [];

  products.forEach((product) => {
    const productQty = quantities[product.id] ?? {};

    if (product.variants?.length) {
      product.variants.forEach((variant) => {
        const variantQty = productQty[variant.id] ?? 0;
        if (variantQty <= 0) return;

        lines.push({
          key: `${product.id}:${variant.id}`,
          productId: product.id,
          title: product.title,
          image: product.image,
          category: product.category,
          variantLabel: variant.label,
          variantImage: variant.image,
          variantId: variant.id,
          quantity: variantQty,
          unitPrice: product.price,
          unitCompareAt: product.compareAt,
        });
      });
      return;
    }

    const qty = productQty.default ?? 0;
    if (qty <= 0) return;

    lines.push({
      key: `${product.id}:default`,
      productId: product.id,
      title: product.title,
      image: product.image,
      category: product.category,
      variantId: "default",
      quantity: qty,
      unitPrice: product.price,
      unitCompareAt: product.compareAt,
    });
  });

  return lines.sort(
    (a, b) =>
      REVIEW_CATEGORIES.indexOf(a.category) -
      REVIEW_CATEGORIES.indexOf(b.category),
  );
}

// Calculates subtotal, compare total, and savings for the review panel.
export function buildTotals(reviewLines: ReviewLine[]): BundleTotals {
  const subtotal = reviewLines.reduce(
    (sum, line) => sum + line.unitPrice * line.quantity,
    0,
  );
  const compareTotal = reviewLines.reduce(
    (sum, line) => sum + (line.unitCompareAt ?? line.unitPrice) * line.quantity,
    0,
  );

  return {
    subtotal,
    compareTotal,
    savings: Math.max(0, compareTotal - subtotal),
  };
}
