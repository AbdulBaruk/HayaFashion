import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getOrderItemApi } from "../api-endpoints/CartsApi";
import { formatDate } from "../utils/date";

function OrderSingleView({vendorId}:any) {
    const navigate = useNavigate();
    const { id } = useParams();
    const userId = localStorage.getItem('userId')

    const { data }: any = useQuery({
        queryKey: ['getOrderSingle',vendorId],
        queryFn: () => getOrderItemApi(`?user_id=${userId}&vendor_id=${vendorId}&order_id=${id}`)
    });
    return (
        <>
            <button
                onClick={() => {
                    navigate(-1)
                }}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 p-10"
            >
                <ArrowLeft className="h-5 w-5" />
                Back
            </button>
            <div className="lg:px-20 px-5">
                <h1 className="text-2xl font-extrabold mb-2">Order Details</h1>
                <div className="border shadow-xl p-5 bg-white mb-10">
                    <div className="flex justify-between flex-wrap ">
                        <div className="text-slate-500 font-medium">
                            <div className="mb-2">
                                Order Date:<span className="ml-1 text-slate-700 font-bold">{data?.data?.created_at ? formatDate(data?.data?.created_at):''} </span>
                            </div>
                            <div>
                                Total Amount:<span className="ml-1 text-slate-700 font-bold">₹{data?.data?.total_amount}</span>
                            </div>
                        </div>

                        <div className="text-slate-500 font-medium">
                            <div className="mb-2">
                                Ship to:<span className="ml-1 text-slate-700 font-bold">{data?.data?.consumer_address?.address_type} </span>
                            </div>
                            <div>
                                Status:<span className="ml-1 text-slate-700 font-bold">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium
                  ${data?.data?.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                                            data?.data?.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                             data?.data?.status === 'Processing' ? 'bg-blue-50 text-blue-700' :
                                               data?.data?.status === 'Shipped' ? 'bg-indigo-50 text-indigo-700' :
                                               data?.data?.status === 'Cancelled' ? 'bg-red-50 text-red-700' :                                          
                                                'bg-red-100 text-red-800'}`}>
                                        {data?.data?.status?.charAt(0).toUpperCase() + data?.data?.status?.slice(1)}
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h1 className="text-lg font-bold mt-5">Items in Order:</h1>
                        {data?.data?.order_items?.map((item: any) => (
                            <div className="box border bg-slate-100 flex flex-wrap p-3 rounded-md gap-5">
                                <img className="h-20 w-20" src={item?.product?.image_urls[0] ? item?.product?.image_urls[0] : "https://cdn.shopify.com/s/files/1/2303/2711/files/2_e822dae0-14df-4cb8-b145-ea4dc0966b34.jpg?v=1617059123"} />
                                <div className="mt-auto mb-auto">
                                    <h1 className="text-lg font-semibold">{item?.product?.name}</h1>
                                    <p>Quantity: <span className="ml-1">{item?.quantity}</span></p>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </>
    )
}

export default OrderSingleView;