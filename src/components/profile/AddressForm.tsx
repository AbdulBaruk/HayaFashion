import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Loader, X } from 'lucide-react';
import { postAddressCreateApi, updateAddressApi } from '../../api-endpoints/CartsApi';
import { InvalidateQueryFilters, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useUser } from '../../context/UserContext';

interface AddressFormProps {
  openModal: boolean;
  handleClose: () => void;
  editData: any;
}

export function AddressForm({ openModal, handleClose, editData }: AddressFormProps) {
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
   const { user }: any = useUser();

  const { control, handleSubmit, setValue,reset, formState: { errors } } = useForm<any>({
    defaultValues: {
      address_line1: editData?.address_line1 || '',
      address_line2: editData?.address_line2 || '',
      address_type: editData?.address_type || '',
      city: editData?.city || '',
      state: editData?.state || '',
      postal_code: editData?.postal_code || '',
      country: editData?.country || '',
      landmark: editData?.landmark || '',
    }
  });

  // Use useEffect to update form values when `editData` changes
  useEffect(() => {
    if (editData) {
      setValue('address_line1', editData?.address_line1 || '');
      setValue('address_line2', editData?.address_line2 || '');
      setValue('address_type', editData?.address_type || '');
      setValue('city', editData?.city || '');
      setValue('state', editData?.state || '');
      setValue('postal_code', editData?.postal_code || '');
      setValue('country', editData?.country || '');
      setValue('landmark', editData?.landmark || '');
    }
  }, [editData, setValue]);

  // Return null if the modal is not open
  if (!openModal) return null;

  // Form submission handler
  const onFormSubmit = async (data: any) => {
    setLoading(true);
    const formattedData = {
      user: userId,
      address_line1: data.address_line1,
      address_line2: data.address_line2,
      address_type: data.address_type,
      city: data.city,
      state: data.state,
      postal_code: data.postal_code,
      country: data.country,
      landmark: data.landmark,
      ...(editData
        ? { updated_by: userName || 'user' }
        : { created_by: userName || 'user' }),
        contact_number:user?.data?.contact_number,
        customer_name:user?.data?.name,
        email_address:user?.data?.email,
    };
if(editData){
  try {
    const response = await updateAddressApi(`${editData?.id}`, formattedData);
    if (response) {
      queryClient.invalidateQueries(['getAddressData'] as InvalidateQueryFilters);
      handleClose();
      setLoading(false);
      reset();
    }
  } catch (error) {
    console.error(error);
    setLoading(false);
  }
}else{
  try {
    const response = await postAddressCreateApi('', formattedData);
    if (response) {
      queryClient.invalidateQueries(['postGoalType'] as InvalidateQueryFilters);
      handleClose();
      setLoading(false);
      reset();
    }
  } catch (error) {
    console.error(error);
    setLoading(false);
  }
}
  
// const payload={
  
//     vendor: 27,
//     company_name: "justvy",
//     pickup_location: "chennai",
//     address_type: "home",
//     address_line1: "123 Main Street",
//     address_line2: "Apt 101",
//     city: "chennai",
//     state: "NY",
//     postal_code: "600002",
//     country: "india",
//     landmark: "Near Central Park",
//     latitude: 40.712776,
//     longitude: -74.005974,
//     is_primary: true,
//   // created_by: "system",
//   updated_by: "Vendor",
//      selected_address: false
// }
// const update=await axios.put('https://ecomapi.ftdigitalsolutions.org/vendor_address/15/',payload)
// const update=await axios.patch('https://ecomapi.ftdigitalsolutions.org/update-selected-address/vendor/27/address/15/',
//   {
 


//     updated_by: "vendor"
//   }
// )

// const payload ={
//     payment_gateway_client_id: "rzp_live_N9L8M3E4qySTlw",
//     delivery_partner_client_id: "udayadhanabal@gmail.com",
//     payment_gateway_api_key: "t5lQi8Mf7NTpLpgKJRCKncCe",
//     delivery_partner_api_key: "Ud@26122001justvy!",
//     payment_gateway: "razorpay",
//     delivery_partner: "shiprocket",
//     delivery_auth_token: "",
//     // own_delivery_charge: null,
//     own_cod_delivery_charge: "0",
//     // own_courier_company_id: null,
//     updated_by: "Vendor",
//     // id: 21,

// }
// try {
// const upadetApi=await axios.put('https://ecomapi.ftdigitalsolutions.org/vendor-site-details/21/',payload)
// if(upadetApi){
//   setLoading(false)
// }
// } catch (error) {
//   setLoading(false)
  
// }

  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold mb-4">Add Your Address</h2>
          <span onClick={handleClose} className="cursor-pointer">
            <X />
          </span>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="address_line1" className="block text-sm font-medium text-gray-700">Address Line 1</label>
              <Controller
                control={control}
                name="address_line1"
                render={({ field }) => (
                  <textarea
                    {...field}
                    id="address_line1"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                )}
              />
            </div>

            <div>
              <label htmlFor="address_line2" className="block text-sm font-medium text-gray-700">Address Line 2</label>
              <Controller
                control={control}
                name="address_line2"
                render={({ field }) => (
                  <textarea
                    {...field}
                    id="address_line2"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="address_type" className="block text-sm font-medium text-gray-700">Address Type</label>
              <Controller
                control={control}
                name="address_type"
                render={({ field }) => (
                  <input
                    {...field}
                    id="address_type"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                )}
              />
            </div>
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
              <Controller
                control={control}
                name="city"
                render={({ field }) => (
                  <input
                    {...field}
                    id="city"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                )}
              />
            </div>

            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
              <Controller
                control={control}
                name="state"
                render={({ field }) => (
                  <input
                    {...field}
                    id="state"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                )}
              />
            </div>
            <div>
              <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700">Pin Code</label>
              <Controller
                control={control}
                name="postal_code"
                render={({ field }) => (
                  <input
                    {...field}
                    id="postal_code"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
              <Controller
                control={control}
                name="country"
                render={({ field }) => (
                  <input
                    {...field}
                    id="country"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                )}
              />
            </div>

            <div>
              <label htmlFor="landmark" className="block text-sm font-medium text-gray-700">Landmark</label>
              <Controller
                control={control}
                name="landmark"
                render={({ field }) => (
                  <textarea
                    {...field}
                    id="landmark"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                )}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex gap-2"
            >
              Save {loading ? (<Loader className="animate-spin" size={20} />) : ''}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
