export interface DeliveryOption {
  id: string;
  name: string;
  price: number;
  estimatedDays: string;
  description?: string;
}

export interface DeliveryZone {
  id: string;
  name: string;
  options: DeliveryOption[];
}