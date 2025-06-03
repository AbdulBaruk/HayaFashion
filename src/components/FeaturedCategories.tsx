import { Link } from 'react-router-dom';
import { useCategories } from '../context/CategoriesContext';

interface FeaturedCategoriesProps {
  onSelectCategory: (category: string) => void;
}

export function FeaturedCategories({ onSelectCategory }: FeaturedCategoriesProps) {
  const { categories, isAuthenticated }: any = useCategories();
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Featured Categories</h2>
        <Link
          to="/categories"
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          View All Categories
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {isAuthenticated && categories?.data?.map((category: any) => (
          <button
            key={category.id}
            onClick={() => onSelectCategory(category.id)}
            className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100 hover:opacity-90 transition-opacity text-left"
          >
            <img
              src={category.image ? category.image : 'https://semantic-ui.com/images/wireframe/image.png'}
              alt={category?.name}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-lg font-semibold text-white">{category?.name}</h3>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}