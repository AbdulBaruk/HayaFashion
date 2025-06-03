import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface PaymentDialogProps {
  status: 'success' | 'failed';
  onClose: () => void;
  error?: string;
}

export function PaymentDialog({ status, onClose, error }: PaymentDialogProps) {
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full">
          <div className="text-center">
            {status === 'success' ? (
              <>
                <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                <h3 className="mt-4 text-lg font-semibold text-gray-900">Payment Successful!</h3>
                <p className="mt-2 text-gray-600">
                  Thank you for your purchase. Your order has been confirmed.
                </p>
              </>
            ) : (
              <>
                <XCircle className="mx-auto h-12 w-12 text-red-500" />
                <h3 className="mt-4 text-lg font-semibold text-gray-900">Payment Failed</h3>
                <p className="mt-2 text-gray-600">
                  {error || 'There was an error processing your payment. Please try again.'}
                </p>
              </>
            )}
          </div>
          
          <div className="mt-6">
            <button
              onClick={onClose}
              className={`w-full py-2 px-4 rounded-lg text-white font-medium
                ${status === 'success' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-red-600 hover:bg-red-700'}`}
            >
              {status === 'success' ? 'Continue Shopping' : 'Try Again'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}