import  { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getCartitemsApi } from '../api-endpoints/CartsApi';
import { useUser } from '../context/UserContext';
import Logo from '../assets/image/hayaLogo.png'
// import OmLogo from '../assets/image/logo_wobg.png'
interface NavbarProps {
  cartItemCount: number;
  onCartClick: () => void;
}

export function Navbar({ 
  // cartItemCount
   onCartClick }: NavbarProps) {
  const [isSticky, setIsSticky] = useState(false);

  // const userName: any = localStorage.getItem('userName');
  const getCartId = localStorage.getItem('cartId');

  const { user }: any = useUser();

  const getCartitemsData = useQuery({
    queryKey: ['getCartitemsData', getCartId],
    queryFn: () => getCartitemsApi(`/${getCartId}`),
    enabled: !!getCartId,
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50); 
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`${isSticky ? 'fixed top-0 left-0 shadow-lg z-20' : 'relative'} bg-white w-full z-10 transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex-shrink-0 flex">
          <img className="h-16 w-16" src={Logo}/>
          <span className='m-4 text-2xl font-bold'>Haya Fashion</span>
            {/* <h1 className="text-xl font-bold text-gray-800">SimpleShop</h1> */}
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to={user?.data?.name ? "/profile" : "/login"}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900"
            >
              <User className="h-5 w-5" />
              <span>{user?.data?.name ? user?.data?.name : "Sign in"}</span>
            </Link>

            <button
              onClick={onCartClick}
              className="relative p-2 text-gray-600 hover:text-gray-900"
            >
              <ShoppingCart className="h-6 w-6" />
              {getCartitemsData?.data?.data?.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-5 w-5 text-xs flex items-center justify-center">
                  {getCartitemsData?.data?.data?.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
