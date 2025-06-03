import { OrderHistory } from '../components/OrderHistory';
import { AddressManager } from '../components/profile/AddressManager';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { useState } from 'react';

export function ProfilePage({vendorId}:any) {
  const userName: any = localStorage.getItem('userName');
  const email: any = localStorage.getItem('email');
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    setOpenModal(false); 
    setTimeout(() => {
      window.location.reload();
    }, 300);
    navigate('/login');
  };

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between flex-wrap">
              <div className="flex items-center gap-4 mb-2">
                <div className="bg-blue-100 p-3 rounded-full">
                  <User className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 uppercase">
                    {userName ? userName : 'user'}
                  </h1>
                  <p className="text-gray-500">{email ? email : 'user@gmail.com'}</p>
                </div>
              </div>
              <button
                onClick={() => setOpenModal(true)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
            <AddressManager />
            <OrderHistory vendorId={vendorId}/>
          </div>
        </div>
      </div>

      {openModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-auto" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-semibold mb-4">Confirm Logout</h2>
            <p className="text-sm text-gray-600 mb-4">Are you sure you want to sign out?</p>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setOpenModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
              >
                Confirm Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
