import { useState } from 'react';
import { Loader, MapPin, Pencil, Trash2 } from 'lucide-react';
import { deleteAddressApi, getAddressApi } from '../../api-endpoints/CartsApi';
import { InvalidateQueryFilters, useQuery, useQueryClient } from '@tanstack/react-query';
import { AddressForm } from './AddressForm';

export function AddressList() {
  const userId = localStorage.getItem('userId');
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState();
  const [openModal, setOpenMoadl] = useState(false);
  const [editData, setEditData] = useState<any>('');
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading }: any = useQuery({
    queryKey: ['getAddressData'],
    queryFn: () => getAddressApi(`user/${userId}`)
  })



  const confirmDelete = async () => {
    if (deleteId) {
      setLoading(true)
      const response = await deleteAddressApi(deleteId, { deleted_by: 'user' });
      if (response) {
        queryClient.invalidateQueries(['getAddressData'] as InvalidateQueryFilters);
        setDeleteModal(false);
        setLoading(false)
      }
    }
  };

  return (
    <>
      {isLoading ? (
        <>
          <div className="space-y-4">
            {[...Array(3)]?.map((_, index) => (
              <div
                key={index}
                className="flex items-start justify-between p-4 bg-white rounded-lg shadow-sm animate-pulse"
              >
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="space-y-4">
          {data?.data?.length ? (
            <>
              {data?.data?.map((address: any) => (
                <div
                  key={address.id}
                  className="flex items-start justify-between p-4 bg-white rounded-lg shadow-sm"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">
                        {address.address_line1}
                      </h3>
                      {address.isDefault && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {address.city}, {address.state} {address.postal_code}
                    </p>
                    <p className="text-sm text-gray-500">{address.country}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setOpenMoadl(!openModal), setEditData(address) }}
                      className="p-1 text-gray-400 hover:text-gray-500"
                      title="Edit address"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => { setDeleteModal(!deleteModal), setDeleteId(address?.id) }}
                      className="p-1 text-gray-400 hover:text-red-500"
                      title="Delete address"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <div className="text-center py-6 bg-gray-50 rounded-lg">
              <MapPin className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No addresses</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding a new address.</p>
            </div>
          )}

        </div>
      )}



      {deleteModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div
            className="bg-white p-4 rounded-lg shadow-lg w-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold mb-4">Delete Address</h2>
            </div>

            <p className="text-sm text-gray-600">
              Are you sure you want to delete this address?
            </p>

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => { setEditData(""), setLoading(false), setDeleteModal(!deleteModal) }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 gap-2 flex"
              >
                Confirm Delete {loading ? (<Loader className='animate-spin' />) : ''}
              </button>
            </div>
          </div>
        </div>
      )}

      <AddressForm
        openModal={openModal}
        handleClose={() => setOpenMoadl(!openModal)}
        editData={editData}
      />
    </>
  );
}