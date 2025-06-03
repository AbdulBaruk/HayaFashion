import { formatDate } from '../utils/date';
import { useQuery } from '@tanstack/react-query';
import { getOrderApi } from '../api-endpoints/CartsApi';
import { useNavigate } from 'react-router-dom';
import { Package } from 'lucide-react';


export function OrderHistory({vendorId}:any) {
  const userId = localStorage.getItem('userId');

  const navigate = useNavigate();
  const { data, isLoading }: any = useQuery({
    queryKey: ['getOrderData', userId,vendorId],
    queryFn: () => getOrderApi(`${userId}/vendor/${vendorId}`)
  });


  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold">Order History</h2>
      {isLoading ? (
        <>
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow p-6 animate-pulse"
              >
                <div className="flex justify-between flex-wrap items-start mb-2">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-32"></div>
                    <div className="h-3 bg-gray-200 rounded w-24"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded-full w-24"></div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between flex-wrap items-center">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>

                    <div className="flex gap-2 mt-4 sm:mt-0">
                      <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
                      <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {data?.data?.length === 0 ? (
            <div className="text-center py-6 bg-gray-50 rounded-lg">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No orders yet</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding a new orders.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data?.data?.map((order: any) => (
                <div key={order.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between flex-wrap items-start mb-2">
                    <div>
                      <p className="text-sm text-gray-500">Order #{order.id}</p>
                      <p className="text-sm text-gray-500">{formatDate(order?.created_at)}</p>
                      <div className='flex text-gray-500'>
                        Ship : <span className='text-slate-500 font-bold ml-1'>{order?.consumer_address?.address_type}</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium
           ${order?.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                            order?.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                             order?.status === 'Processing' ? 'bg-blue-50 text-blue-700' :
                                               order?.status === 'Shipped' ? 'bg-indigo-50 text-indigo-700' :
                                               order?.status === 'Cancelled' ? 'bg-red-50 text-red-700' :                                          
                                                'bg-red-100 text-red-800'}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <div className="mt-4 pt-4 border-t">

                    <div className='flex justify-between flex-wrap'>
                      <p className="text-right font-medium">
                        Total: ₹{order?.total_amount}
                      </p>

                      <div className='flex gap-2'>
                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-400 text-white rounded-lg">
                          View Invoice
                        </button>

                        <button
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          onClick={() => navigate(`/order-view/${order.id}`)}
                        >
                          View Order
                        </button>

                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </>
      )}


    </div>
  );
}