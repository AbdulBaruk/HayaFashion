import { SizeSelector } from "./SizeSelector";

interface VariantSelectorProps {
  variants: any[];
  selectedVariantId: any;
  onSelect: (variantId: string) => void;
  sizekey: any;
  selectedSizeId: any;
  onSelectSize: any;
}

export function VariantSelector({ variants, selectedVariantId, onSelect, sizekey }: VariantSelectorProps) {
  const emptyImage = 'https://media.istockphoto.com/id/1222357475/vector/image-preview-icon-picture-placeholder-for-website-or-ui-ux-design-vector-illustration.jpg?s=612x612&w=0&k=20&c=KuCo-dRBYV7nz2gbk4J9w1WtTAgpTdznHu55W9FjimE='
  return (
    <div className="space-y-3">
      {variants?.map((variant) => (
        <>
          <label className="block text-sm font-medium text-gray-700">Variants</label>

          <div className="flex flex-wrap gap-3">
            <button
              key={variant?.id}
              onClick={() => { onSelect(variant), sizekey('') }}
              className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all
              ${selectedVariantId?.id === variant?.id
                  ? 'border-blue-500 ring-2 ring-blue-500 ring-offset-2'
                  : 'border-gray-200 hover:border-gray-300'}`}
              title={variant?.product_variant_title}
            >
              <img
                src={variant?.product_variant_image_urls[0] ? variant?.product_variant_image_urls[0] : emptyImage}
                alt={variant.product_variant_title}
                className="w-full h-full object-cover"
              />
            </button>
          </div>

          <SizeSelector
            sizes={variant?.sizes}
            selectedSizeId={selectedVariantId}
            onSelect={onSelect}
          />
        </>
      ))}
    </div>
  );
}