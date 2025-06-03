import { usePolicy } from "../context/PolicyContext";

function CancellationPolicy() {
  const { policy, isLoading }: any = usePolicy();

  if (isLoading) {
    // Show skeleton loader when loading
    return (
      <div className="bg-white p-5 shadow-md rounded-lg lg:p-20 animate-pulse">
        <div className="h-8 bg-gray-300 rounded w-1/2 mb-6"></div>

        <div className="space-y-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="h-4 bg-gray-200 rounded w-full"></div>
          ))}
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 lg:p-20 shadow-md rounded-lg">
      {/* <h1 className="text-3xl font-bold mb-4 text-gray-800">Cancellation Policy</h1> */}
      <div className="text-gray-600" dangerouslySetInnerHTML={{ __html: policy?.data?.refund_and_cancellation_policy }} />
    </div>
  );
}

export default CancellationPolicy;