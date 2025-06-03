interface SizeSelectorProps {
  sizes: any[];
  selectedSizeId: any;
  onSelect: (sizeId: string) => void;
}

export function SizeSelector({ sizes, selectedSizeId, onSelect }: SizeSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">Size</label>
      <div className="flex flex-wrap gap-2">
        {sizes?.map((size) => (
          <button
            key={size?.id}
            onClick={() => onSelect(size)}
            disabled={size?.product_size_stock_quantity === 0}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all
              ${selectedSizeId?.id === size?.id
                ? 'bg-gray-900 text-white'
                : size?.product_size_stock_quantity > 0
                  ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
          >
            {size?.product_size}
            {size?.product_size_stock_quantity === 0 && ' (Out of Stock)'}
          </button>
        ))}
      </div>
    </div>
  );
}