type QuantityStepperProps = {
  quantity: number;
  onDecrement: () => void;
  onIncrement: () => void;
  disabled?: boolean;
};

export default function QuantityStepper({
  quantity,
  onDecrement,
  onIncrement,
  disabled,
}: QuantityStepperProps) {
  return (
    <div className="inline-flex items-center gap-1.5" aria-label="Quantity controls">
      <button
        type="button"
        className="size-6 rounded-md border border-[#c9cfde] bg-[#f8f9fc] text-[#333b4f] font-bold disabled:cursor-not-allowed disabled:opacity-45"
        aria-label="Decrease quantity"
        disabled={disabled || quantity <= 0}
        onClick={onDecrement}
      >
        -
      </button>
      <span className="min-w-[18px] text-center font-semibold">{quantity}</span>
      <button
        type="button"
        className="size-6 rounded-md border border-[#c9cfde] bg-[#f8f9fc] text-[#333b4f] font-bold disabled:cursor-not-allowed disabled:opacity-45"
        aria-label="Increase quantity"
        disabled={disabled}
        onClick={onIncrement}
      >
        +
      </button>
    </div>
  );
}
