import { Truck } from 'lucide-react';

interface DeliverySelectorProps {
  options: any[];
  selectedOptionId?: any;
  onSelect: (optionId: string) => void;
}

export function DeliverySelector({ options, selectedOptionId, onSelect }: DeliverySelectorProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Truck className="h-5 w-5 text-gray-400" />
        <h3 className="text-sm font-medium text-gray-900">Delivery Method</h3>
      </div>
      
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option.id}
            className={`flex items-start p-3 rounded-lg border cursor-pointer
              ${selectedOptionId?.id === option.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
          >
            <input
              type="radio"
              name="deliveryOption"
              value={option.id}
              // checked={selectedOptionId?.id === option.id}
              checked
              onChange={() => onSelect(option)}
              className="mt-1 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <div className="ml-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">{option.name}</p>
                <p className="text-sm font-medium text-gray-900">
                  {option.price === 0 ? 'FREE' : `₹${option.price.toFixed(2)}`}
                </p>
              </div>
              <p className="text-sm text-gray-500">
                {option.description || `Estimated delivery: ${option.estimatedDays} business days`}
              </p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}