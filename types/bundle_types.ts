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