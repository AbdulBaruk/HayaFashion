import { Link } from "react-router-dom";
import { useCategories } from "../context/CategoriesContext";
import { Loader } from "lucide-react";

export function CategoriesPage() {
  const { categories, isAuthenticated, isLoading }: any = useCategories();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">All Categories</h1>

      {isLoading ? (
        <>
          <div className="flex justify-center items-center text-blue-700 text-2xl">
            <Loader size={40} className="animate-spin" /> Loading
          </div>
        </>
      ) : (
        <>
          {isAuthenticated && categories?.data?.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-6">

              {categories.data.map((category: any) => (
                <Link
                  key={category.id}
                  to={`/categories-product/${category.id}`}
                  className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100 hover:opacity-90 transition-opacity"
                >
                  <img
                    src={category.image || "https://semantic-ui.com/images/wireframe/image.png"}
                    alt={category.name || "Category"}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-xl font-semibold text-white">{category.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div>
              <h1 className="text-center text-2xl ">No Data Found !</h1>
            </div>
          )}

        </>
      )}

    </div>
  );
}
