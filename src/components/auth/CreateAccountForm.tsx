import React, { useState } from 'react';
import { Mail, Lock, User, Phone, EyeOff, Eye, Loader } from 'lucide-react';
// import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { postCreateUserAPi } from '../../api-endpoints/authendication';
import { postCartCreateApi } from '../../api-endpoints/CartsApi';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../firebase-Analytics/firebaseAnalytics';

export function CreateAccountForm({ vendorId }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('')
  const [error, setError] = useState('');
  // const { register } = useAuth();
  const navigate = useNavigate();
  const [passwordShow, setPasswordShow] = useState(false);
  const imageUrl = 'https://img.freepik.com/free-vector/smiling-young-man-hoodie_1308-176157.jpg?t=st=1742883789~exp=1742887389~hmac=276a954f79d559893475b0e8f8b90da7f45a713cad804b0a8a3e57668378105b&w=740';
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    const payload = {
      name: name,
      email: email,
      password: password,
      contact_number: mobile,
      vendor: vendorId,
      created_by: name,
      profile_image: imageUrl
    }
    logEvent(analytics, 'register', {
      name: name,
      email: email,
      contact_number: mobile,
    });
    try {
      const response = await postCreateUserAPi(payload);
      if (response) {
        localStorage.setItem('userId', response?.data?.user?.id)
        localStorage.setItem('userName', response?.data?.user?.name)
        const updateApi = await postCartCreateApi('', { user: response?.data?.user?.id, vendor: vendorId, created_by: response?.data?.user?.name });
        if (updateApi) {
          setLoading(false);
          localStorage.setItem('cartId', updateApi?.data?.id);
          navigate('/profile');
          window.location.reload();
        }
        navigate('/profile');
      }

    } catch (err) {
      setError('Failed to create account');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <div className="mt-1 relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <div className="mt-1 relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact_number" className="block text-sm font-medium text-gray-700">
          Mobile
        </label>
        <div className="mt-1 relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            id="contact_number"
            type="number"
            required
            value={mobile}
            maxLength={10}
            onChange={(e) => setMobile(e.target.value)}
            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
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
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {passwordShow ? (
            <EyeOff onClick={() => setPasswordShow(false)} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />

          ) : (
            <Eye onClick={() => setPasswordShow(true)} className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          )}
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex gap-2 justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        Create Account {loading && <Loader className='animate-spin' />}
      </button>

      <p className="text-sm text-gray-600 text-center">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
          Sign in
        </Link>
      </p>
    </form>
  );
}