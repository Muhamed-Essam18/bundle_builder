import {
  formatMoney,
  REVIEW_CATEGORIES,
} from "@/lib/bundleBuilder";
import type { BundleTotals, ReviewLine } from "@/types/bundle_types";
import QuantityStepper from "@/components/QuantityStepper";

type ReviewPanelProps = {
  reviewLines: ReviewLine[];
  totals: BundleTotals;
  checkoutMessage: string;
  saveMessage: string;
  onCheckout: () => void;
  onSave: () => void;
  onUpdateLineQuantity: (productId: string, variantId: string, quantity: number) => void;
};

export default function ReviewPanel({
  reviewLines,
  totals,
  checkoutMessage,
  saveMessage,
  onCheckout,
  onSave,
  onUpdateLineQuantity,
}: ReviewPanelProps) {
  const badge = 'https://res.cloudinary.com/dyhahwczx/image/upload/v1783787330/nmhphlr5ckxe5lsry5s7.png'
  return (
    <section className="sticky top-5 w-full xl:flex gap-10 items-start justify-between self-start rounded-xl border border-[#c4cade] bg-[#EDF4FF] px-5 pt-4 pb-5 ">
     <section className=""> <p className="m-0 text-[0.74rem] tracking-[0.17em] text-[#565d72]">REVIEW</p>
      <h2 className="mt-2 mb-1 text-[clamp(1.6rem,2vw,2rem)] leading-[1.15] font-semibold">
        Your security system
      </h2>
      <p className="mt-0 mb-2.5 leading-[1.24] text-[#545d70]">
        Review your personalized protection system designed to keep what matters most safe.
      </p>

      {REVIEW_CATEGORIES.map((category) => {
        
        const rows = reviewLines.filter((line) => line.category === category);
        if (!rows.length) return null;

        return (
          <section className="border-t border-[#b6bdd2] pt-2.5" key={category}>
            <h3 className="mt-0 mb-2 text-[0.76rem] tracking-[0.1em] text-[#98a1b5]">
              {category.toUpperCase()}
            </h3>

            {rows.map((line) => {
              const linePrice = line.unitPrice * line.quantity;
              const lineCompare = (line.unitCompareAt ?? line.unitPrice) * line.quantity;
              const showCompare = !!line.unitCompareAt && lineCompare > linePrice;
              const isShippingLine = line.category === "Shipping";

              return (
                <article
                  className={`mb-3 grid items-center gap-x-3 gap-y-1.5 ${
                    isShippingLine ? "grid-cols-[minmax(0,1fr)_auto]" : "grid-cols-[minmax(0,1fr)_auto_auto]"
                  }`}
                  key={line.key}
                >
                  {line.category === "Plan" ? (
                    <div className="flex items-center gap-2.5">
                      <img
                        src={line.image}
                        alt={line.title}
                        className="w-[150px]"
                      />
                    </div>
                  ):<div className="flex min-w-0 items-center gap-2.5">
                    <img
                      src={line.image}
                      alt={line.title}
                      className="size-10 rounded-lg border border-[#e1e5f0] bg-white object-contain"
                    />
                    <h4 className="m-0 text-[0.93rem] leading-[1.15] font-semibold">{line.title}</h4>
                  </div>}
                  {!isShippingLine && (
                    <div className="justify-self-end">
                      <QuantityStepper
                        quantity={line.quantity}
                        onDecrement={() =>
                          onUpdateLineQuantity(line.productId, line.variantId, line.quantity - 1)
                        }
                        onIncrement={() =>
                          onUpdateLineQuantity(line.productId, line.variantId, line.quantity + 1)
                        }
                      />
                    </div>
                  )}

                  <div className="flex flex-col xl:flex-row gap-1 items-end leading-[1.15] font-semibold text-[#5140d8]">
                    {showCompare && (
                      <span className="font-medium text-[#7f8698] line-through">
                        {formatMoney(lineCompare)}
                      </span>
                    )}
                    <span>{linePrice === 0 ? "FREE" : formatMoney(linePrice)}</span>
                  </div>
                </article>
              );
            })}
          </section>
        );
      })}</section>
<section className=" mt-6 xl:w-[50%] xl:px-10 flex flex-col items-center justify-center">


      <div className=" flex flex-row xl:flex-col items-center justify-between gap-2.5 w-full">
          <div className="flex flex-row items-center justify-between gap-2.5 w-full ">
              <div className="rotate-[-5deg] w-[90px] h-[90px] xl:w-[120px] xl:h-[120px]">
              <img src={badge} alt="Badge" />
          </div>
            <div className="hidden xl:block w-[70%]">
              <h1 className="text-lg font-bold">30-day hassle-free returns </h1>
              <p className="text-sm">If you're not totally in love with the product, we will refund you 100%.</p>
            </div>
          </div>


          <div className="flex flex-col gap-1 xl:flex-row xl:justify-between items-end w-full">
              <span className="rounded-sm px-1 h-[23px] bg-[#4d3fd5] text-[13px] text-white text-center ">
                 as low as $19.19/mo
              </span>


              <div className="mt-1 flex justify-end gap-1">
                    {totals.compareTotal > totals.subtotal && (
                    <span className="text-[1.05rem] font-medium text-[#7f8698] line-through">
                    {formatMoney(totals.compareTotal)}
                  </span>
                  )}
                  <strong className="text-[1.3rem] leading-none font-bold text-[#4534cb]">
                    {formatMoney(totals.subtotal)}
                  </strong>
              </div>
        </div>
      </div>

      

      {totals.savings > 0 && (
        <p className="mt-2 mb-1 text-sm text-center font-semibold text-[#11b38c]">
          Congrats! You're saving {formatMoney(totals.savings)} on your security bundle!
        </p>
      )}

      <button
        type="button"
        className="w-full rounded-[10px] bg-[#4E2FD2] px-4 py-[11px] text-[1.8rem] font-bold text-white hover:brightness-105 max-[780px]:text-[1.45rem]"
        onClick={onCheckout}
      >
        Checkout
      </button>

      {checkoutMessage && (
        <p className="mt-2 text-center text-[0.82rem] text-[#4a5469]">{checkoutMessage}</p>
      )}

      <button
        type="button"
        className="mx-auto mt-3 block border-0 bg-transparent text-[#5d6478] italic underline"
        onClick={onSave}
      >
        Save my system for later
      </button>

      {saveMessage && <p className="mt-2 text-center text-[0.82rem] text-[#4a5469]">{saveMessage}</p>}

     </section>
    </section>
  );
}
