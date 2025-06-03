import { useState } from 'react';
import { Plus } from 'lucide-react';
import { AddressList } from './AddressList';
import { AddressForm } from './AddressForm';

export function AddressManager() {
  const [isEditing, setIsEditing] = useState(false);
  const [openModal, setOpenMoadl] = useState(false)



  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Delivery Addresses</h2>
        {!isEditing && (
          <button
            // onClick={handleAddNew}
            onClick={() => setOpenMoadl(!openModal)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            Add New Address
          </button>
        )}
      </div>

      <AddressList/>
      <AddressForm
        openModal={openModal}
        handleClose={() => setOpenMoadl(!openModal)}
        editData={''}
      />
    </div>
  );
}