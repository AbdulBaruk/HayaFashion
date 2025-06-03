import { Link } from 'react-router-dom';
import { useCategories } from '../context/CategoriesContext';
import { logEvent } from 'firebase/analytics';
import { analytics } from './firebase-Analytics/firebaseAnalytics';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelect: (category: string) => void;
}

export function CategoryFilter({ selectedCategory, onSelect }: CategoryFilterProps) {
  const { categories, isAuthenticated }: any = useCategories();

  const handleCategoriesAnalytics = (category: any) => {
    if (category?.name?.trim() !== '') {
      logEvent(analytics, 'category_selected', {
        category_name: category?.name,
        category_id: category?.id,
      });
    }
  };


  return (
    <>
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-900">Featured Categories</h2>
            <Link
              to="/categories"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View All 
            </Link>
          </div>
    
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect('')}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === ''
            ? 'bg-blue-600 text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
      >
        All
      </button>
      {isAuthenticated && categories?.data?.slice(0,12)?.map((category: any) => (
        <button
          key={category}
          onClick={() => {onSelect(category?.id);
            handleCategoriesAnalytics(category);}}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category?.id
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
        >
          {category?.name}
        </button>
      ))}
    </div>
    </>
  );
}