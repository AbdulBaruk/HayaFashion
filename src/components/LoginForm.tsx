import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Loader } from 'lucide-react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { getCartApi } from '../api-endpoints/CartsApi';
import { logEvent } from 'firebase/analytics';
import { analytics } from './firebase-Analytics/firebaseAnalytics';
import url from '../api-endpoints/ApiUrls'
interface FormData {
  email: string;
  password: string;
}

export function LoginForm({vendorId}:any) {
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const [passwordShow, setPasswordShow] = useState(false);
  const [loading,setLoading]=useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    logEvent(analytics, 'login', {
      method: 'email_password', 
      email:data?.email,
    });
    try {
      const response: any = await axios.post(url.signIn,
         {...data,  vendor_id: vendorId
      })
      if (response) {
        localStorage.setItem('userId', response?.data?.user_id)
        const updateApi = await getCartApi(`user/${response?.data?.user_id}`);
        if (updateApi) {
          localStorage.setItem('cartId', updateApi?.data[0]?.id);
          navigate('/');
          setLoading(false);
          window.location.reload();
        }

      }
    } catch (err:any) {
      setLoading(false);
      setError(err?.response?.data?.error || 'something went wrong, try again later');
    }
  };

  return (
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
        disabled={loading}
        className="w-full flex gap-2 mt-auto mb-auto justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Sign in {loading && <Loader className='animate-spin' />} 
      </button>

      <p className="text-sm text-gray-600 text-center">
        Don't have an account?{' '}
        <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
          Create one
        </Link>
      </p>
    </form>
  );
}
