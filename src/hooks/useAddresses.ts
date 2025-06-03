import { useState } from 'react';
import { Address } from '../types/auth';

// Mock data - replace with actual API calls
const mockAddresses: Address[] = [
  {
    id: '1',
    street: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'USA',
    isDefault: true,
  }
];

export function useAddresses() {
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [isLoading, setIsLoading] = useState(false);

  const addAddress = async (address: Address) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newAddress = { ...address, id: Date.now().toString() };
      
      setAddresses(current => {
        // If the new address is default, remove default from others
        if (newAddress.isDefault) {
          return [...current.map(a => ({ ...a, isDefault: false })), newAddress];
        }
        return [...current, newAddress];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateAddress = async (updatedAddress: Address) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAddresses(current => {
        // If the updated address is default, remove default from others
        if (updatedAddress.isDefault) {
          return current.map(address => 
            address.id === updatedAddress.id ? updatedAddress : { ...address, isDefault: false }
          );
        }
        return current.map(address =>
          address.id === updatedAddress.id ? updatedAddress : address
        );
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAddress = async (addressId: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAddresses(current => current.filter(address => address.id !== addressId));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    addresses,
    addAddress,
    updateAddress,
    deleteAddress,
    isLoading,
  };
}