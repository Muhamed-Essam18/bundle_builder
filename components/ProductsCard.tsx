import { formatMoney } from "@/lib/bundleBuilder";
import type { Product, Variant } from "@/types/bundle_types";
import QuantityStepper from "@/components/QuantityStepper";

type ProductCardProps = {
  product: Product;
  activeVariantId: string;
  activeQty: number;
  isSelected: boolean;
  onChangeVariant: (variantId: string) => void;
  onDecrement: () => void;
  onIncrement: () => void;
};

export default function ProductCard({
  product,
  activeVariantId,
  activeQty,
  isSelected,
  onChangeVariant,
  onDecrement,
  onIncrement,
}: ProductCardProps) {
  const activeVariant = product.variants?.find((variant) => variant.id === activeVariantId);
  const activeVariantImage = activeVariant?.image;
  const displayImage = activeVariantImage ?? product.image;

  return (
    <article
      className={`relative rounded-lg border bg-[#f8f9fc] p-2.5 flex flex-row xl:flex-col justify-start gap-2 xl:gap-3 items-center ${
        isSelected
          ? "border-[#6a5bee] shadow-[inset_0_0_0_1px_#6a5bee]"
          : "border-[#d4d8e7]"
      }`}
    >
      <div className="flex flex-col justify-start w-[40%] xl:w-full xl:max-h-[170px]">{product.badge && (
          <span className="absolute top-1.5 left-2 rounded-full bg-[#5040d8] px-2 py-[2px] text-[0.66rem] font-semibold text-white">
            {product.badge}
          </span>
      )}
          <img
            src={displayImage}
            alt={product.title}
            className=" rounded-[10px] bg-white object-contain h-full w-full"
          />
        </div>
        <div className="flex flex-col w-[60%] xl:w-full">
          <div className="grid gap-2.5 py-1.5">
            <div>
              <h3 className="mt-0.5 mb-1 text-[1.04rem] leading-[1.15] font-semibold">{product.title}</h3>
              <p className="mb-0.5 text-[0.79rem] leading-[1.3] text-[#565f72]">{product.description}</p>
              <a className="text-[0.79rem] text-[#355ce8] underline" href={product.learnMoreUrl}>
                Learn More
              </a>
            </div>
          </div>

      {!!product.variants?.length && (
        <div className="mt-2 flex flex-wrap gap-1.5 w-full" role="radiogroup" aria-label="Color">
          {product.variants.map((variant: Variant) => {
            const variantImage = variant.image;

            return (
              <button
                type="button"
                key={variant.id}
                className={`inline-flex items-center justify-center rounded-md border px-1.5 py-1 ${
                  activeVariantId === variant.id
                    ? "border-[#5b4ddb] bg-[#e8e6ff]"
                    : "border-[#d1d5e5] bg-white"
                }`}
                onClick={() => onChangeVariant(variant.id)}
                role="radio"
                aria-checked={activeVariantId === variant.id}
                aria-label={variant.label}
                title={variant.label}
              >
                <div className="flex items-center gap-1.5 ">
                  {variantImage ? (
                  <img
                    src={variantImage}
                    alt={variant.label}
                    className="w-5 h-full rounded-[6px]  object-cover"
                  />
                ) : (
                  <span
                    className="size-[18px] rounded-full border border-[#d3d7e5]"
                    style={{ backgroundColor: variant.swatch }}
                    aria-hidden="true"
                  />
                )}
                </div>
                
                <p className="text-sm font-medium">{variant.label}</p>
              </button>
              
            );
          })}
        </div>
      )}

      <div className="mt-2.5 flex items-end justify-between gap-2">
        <QuantityStepper
          quantity={activeQty}
          onDecrement={onDecrement}
          onIncrement={onIncrement}
        />

        <div className="flex flex-col items-end leading-[1.15] text-[#5140d8]">
          {typeof product.compareAt === "number" && product.compareAt > product.price && (
            <span className="font-medium text-[#D8392B] line-through">
              {formatMoney(product.compareAt)}
            </span>
          )}
          <span className="text-[#575757]">{formatMoney(product.price)}</span>
        </div>
      </div>
      </div>
    </article>
  );
}
