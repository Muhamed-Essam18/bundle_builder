export type StepIconName = "camera" | "shield" | "sensor" | "protection";
export type Step = {
  id: string;
  label: string;
  title: string;
  nextLabel: string;
  icon: StepIconName;
};

export type Variant = {
  id: string;
  label: string;
  swatch: string;
};

export type ProductCategory = "Cameras" | "Sensors" | "Accessories" | "Plan";

export type Product = {
  id: string;
  stepId: string;
  category: ProductCategory;
  title: string;
  description: string;
  learnMoreUrl: string;
  image: string;
  price: number;
  compareAt?: number;
  badge?: string;
  variants?: Variant[];
  defaultVariantId?: string;
  locked?: boolean;
  reviewOnly?: boolean;
  initialQuantities: Record<string, number>;
};

export type BundleData = {
  steps: Step[];
  products: Product[];
};

export type PersistedBuilderState = {
  quantities?: QuantityState;
  activeVariants?: ActiveVariantState;
  openStepId?: string;
};

export type QuantityState = Record<string, Record<string, number>>;
export type ActiveVariantState = Record<string, string>;
export type HomeState = {
  quantities: QuantityState;
  activeVariants: ActiveVariantState;
  openStepId: string;
  saveMessage: string;
  checkoutMessage: string;
};

export type HomeAction =
  | { type: "set-open-step"; stepId: string }
  | { type: "set-active-variant"; productId: string; variantId: string }
  | {
      type: "set-quantity";
      productId: string;
      variantId: string;
      nextQty: number;
    }
  | { type: "set-save-message"; message: string }
  | { type: "set-checkout-message"; message: string };
