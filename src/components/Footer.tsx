import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { useCategories } from '../context/CategoriesContext';

export function Footer() {
  const { categories }: any = useCategories();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* About Section */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">About Us</h3>
            <p className="text-sm leading-relaxed">
              Haya fashion is your destination for quality products at great prices.
              We believe in providing exceptional service and a seamless shopping experience.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/profile" className="hover:text-white transition-colors">My Account</Link></li>
              <li><Link to="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link></li>
              <li><Link to="/terms-conditions" className="hover:text-white transition-colors">Terms And Conditions</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/cancellation-policy" className="hover:text-white transition-colors">Cancellation Policy</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-white transition-colors">Shipping Policy</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              {categories?.data?.slice(0, 5)?.map((item: any) => (
                <li key={item.id}>
                  <Link to={`/categories-product/${item.id}`} className="hover:text-white transition-colors">
                    {item?.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 flex-shrink-0 mt-1" />
                <span>No.30/2, Fine Centre, East Street, Near Ambiga Collage, Anna Nagar, Madurai. 625020</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5" />
                <span>9385956032</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5" />
                <span>hayafashionmdu@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Links */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">© {new Date().getFullYear()} Haya fashion. All rights reserved.</p>
            <div className="flex gap-6 text-sm">
              <Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms-conditions" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link to="/shipping-policy" className="hover:text-white transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
