import { getProductTotalQty } from "@/lib/bundleBuilder";
import type { ActiveVariantState, Product, QuantityState, Step } from "@/types/bundle_types";
import ProductCard from "@/components/ProductsCard";

type StepSectionProps = {
  step: Step;
  isOpen: boolean;
  selectedCount: number;
  products: Product[];
  quantities: QuantityState;
  activeVariants: ActiveVariantState;
  onOpen: () => void;
  onNext: () => void;
  onChangeVariant: (productId: string, variantId: string) => void;
  onChangeQuantity: (product: Product, variantId: string, delta: number) => void;
};

export default function StepSection({
  step,
  isOpen,
  selectedCount,
  products,
  quantities,
  activeVariants,
  onOpen,
  onNext,
  onChangeVariant,
  onChangeQuantity,
}: StepSectionProps) {
  return (
    <article className={`border-b border-t py-4 border-[#1F1F1F]  ${isOpen ? "bg-[#d8deed]" : "bg-transparent"}`}>
      <button
        type="button"
        className="flex w-full cursor-pointer items-center justify-between border-0 bg-transparent px-4 py-2 text-left text-[1.08rem] font-semibold"
        onClick={onOpen}
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2.5">
          <span className="inline-flex h-[25px] min-w-[25px] items-center justify-center rounded px-1 text-[0.6rem] font-medium uppercase tracking-[0.08em] text-[#7b8397]" aria-hidden="true"
    >
            <img
              src={step.iconImage}
              alt=""
              className="max-w-[25px] h-[25px] object-contain "
            />
          </span>
          <span className="font-semibold text-[18px] xl:text-[28px]">{step.title}</span>
        </span>
        <span className="text-[0.95rem] font-medium text-[#4E2FD2]">
          {selectedCount} selected {isOpen ? "▲" : "▼"}
        </span>
      </button>

      {isOpen && (
        <div className="px-4 pt-2.5 pb-[18px]">
          <div className="grid grid-cols-2 gap-3 min-[1280px]:grid-cols-5 max-[780px]:grid-cols-1 ">
            {products.map((product) => {
              const activeVariantId =
                activeVariants[product.id] ?? product.defaultVariantId ?? "default";
              const activeQty = quantities[product.id]?.[activeVariantId] ?? 0;
              const isSelected = getProductTotalQty(quantities, product.id) > 0;

              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  activeVariantId={activeVariantId}
                  activeQty={activeQty}
                  isSelected={isSelected}
                  onChangeVariant={(variantId) => onChangeVariant(product.id, variantId)}
                  onDecrement={() => onChangeQuantity(product, activeVariantId, -1)}
                  onIncrement={() => onChangeQuantity(product, activeVariantId, 1)}
                />
              );
            })}
          </div>

          <button
            type="button"
            className="mx-auto mt-3  mb-1 block min-w-[216px] rounded-lg border border-[#4E2FD2] bg-[#f3f1ff] px-3.5 py-2.5 text-[1.04rem] font-semibold text-[#4E2FD2] hover:bg-[#e9e6ff]"
            onClick={onNext}
          >
            Next: {step.nextLabel}
          </button>
        </div>
      )}
    </article>
  );
}
