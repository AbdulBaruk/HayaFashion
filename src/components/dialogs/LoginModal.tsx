import React, { useState } from "react";

import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Eye, EyeOff, Lock, Mail, X } from "lucide-react";
import { getCartApi } from "../../api-endpoints/CartsApi";

interface LoginModalProps {
  open: boolean;
  handleClose: () => void;
  vendorId:any;
}

interface FormData {
  email: string;
  password: string;
}


const LoginModal: React.FC<LoginModalProps> = ({ open, handleClose,vendorId }) => {
  if (!open) return null;
  const [error, setError] = useState('');
  const [passwordShow, setPasswordShow] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      const response: any = await axios.post("https://ecomapi.ftdigitalsolutions.org/user_login/", 
        {...data, vendor_id: vendorId});
      if (response) {
        localStorage.setItem('userId', response?.data?.user_id)
        const updateApi = await getCartApi(`user/${response?.data?.user_id}`);
        if (updateApi) {
          localStorage.setItem('cartId', updateApi?.data[0]?.id);
          handleClose();
          window.location.reload();
        }
      }
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50"
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold mb-4">Sign in to your account</h2>
          <span onClick={handleClose} className="cursor-pointer"><X /></span>

        </div>

        <div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="email"
                  type="email"
                  {...register('email', { required: 'Email is required' })}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  id="password"
                  type={`${passwordShow ? 'text' : 'password'}`}
                  {...register('password', { required: 'Password is required' })}
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {passwordShow ? (
                  <EyeOff onClick={() => setPasswordShow(false)} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                ) : (
                  <Eye onClick={() => setPasswordShow(true)} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                )}
              </div>
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </Link>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign in
            </button>

            <p className="text-sm text-gray-600 text-center">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                Create one
              </Link>
            </p>
          </form>
        </div>

      </div>
    </div>
  );
};

export default LoginModal;

