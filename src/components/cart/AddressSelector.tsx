import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAddressApi } from '../../api-endpoints/CartsApi';
import { useQuery } from '@tanstack/react-query';
import { AddressForm } from '../profile/AddressForm';
import { patchUserSelectAddressAPi } from '../../api-endpoints/authendication';

interface AddressSelectorProps {
  selectedAddressId?: string;
  onSelect: (addressId: string) => void;
  data:any;
  onClose:any;
}

export function AddressSelector({ selectedAddressId, onSelect,data,onClose }: AddressSelectorProps) {
  // const userId = localStorage.getItem('userId')
  const [openModal, setOpenMoadl] = useState(false)
  const getUserName = localStorage.getItem('userName')
  const getUserId = localStorage.getItem('userId');

  // const { data }: any = useQuery({
  //   queryKey: ['getAddressData'],
  //   queryFn: () => getAddressApi(`user/${userId}`)
  // })

  const handleSelectAddress=async(id:any)=>{
    try {
      const upadetApi =await patchUserSelectAddressAPi(`user/${getUserId}/address/${id?.id}`,{  updated_by:getUserName})
    } catch (error) {
      
    }
  }

  return (
    <>
      {data?.data?.length ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900">Delivery Address</h3>
            <Link
              to="/profile"
              className="text-sm text-blue-600 hover:text-blue-700"
              onClick={() => {onClose(),setOpenMoadl(!openModal)}}
            >
              Manage addresses
            </Link>
          </div>

          <div className="space-y-2">

            {data?.data?.map((address: any) => (
              <label
                key={address.id}
                className={`flex items-start p-3 rounded-lg border cursor-pointer
            ${selectedAddressId === address.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
              >
                <input
                  type="radio"
                  name="deliveryAddress"
                  value={address.id}
                  checked={selectedAddressId === address.id}
                  onChange={() => {onSelect(address.id),handleSelectAddress(address)}}
                  className="mt-1 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {address.street}
                    {address.isDefault && (
                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        Default
                      </span>
                    )}
                  </p>
                  <p className="text-sm text-gray-500">
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                  <p className="text-sm text-gray-500">{address.country}</p>
                </div>
              </label>
            ))}
          </div>

        </div>
      ) : (
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <MapPin className="mx-auto h-8 w-8 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">No delivery address found</p>
          <p className="mt-2 inline-block text-sm text-blue-600 hover:text-blue-700 cursor-pointer"
            onClick={() => setOpenMoadl(!openModal)}
          >
            Add a delivery address
          </p>
        </div>
      )}

      <AddressForm
        openModal={openModal}
        handleClose={() => setOpenMoadl(!openModal)}
        editData={''}
      />
    </>
  );
}