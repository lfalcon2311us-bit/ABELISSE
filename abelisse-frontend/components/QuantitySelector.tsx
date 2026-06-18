"use client";

export default function QuantitySelector({
  quantity,
  max,
  onIncrease,
  onDecrease,
}: {
  quantity: number;
  max: number;
  onIncrease: () => void;
  onDecrease: () => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onDecrease}
        disabled={quantity <= 1}
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-40"
      >
        -
      </button>

      <span className="font-semibold">{quantity}</span>

      <button
        onClick={onIncrease}
        disabled={quantity >= max}
        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-40"
      >
        +
      </button>
    </div>
  );
}
