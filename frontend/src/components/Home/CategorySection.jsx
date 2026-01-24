import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LazyImage from "./LazyImage";
import authService from "../../services/auth.js";

export default function CategorySection() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await authService.getAllCategories();
        console.log('res',res);
        setCategories(res.data);
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (tagId) => {
    navigate(`/products?category=${tagId}`);
  };

  return (
    <section className="py-16 px-4 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {categories.map((cat) => (
          <div
            key={cat._id}
            onClick={() => handleCategoryClick(cat.TagId)}
            className="text-center cursor-pointer transform transition-transform duration-500 hover:scale-105"
          >
            {/* Image */}
            <div className="w-28 h-28 md:w-36 md:h-36 mx-auto mb-4 rounded-full overflow-hidden bg-gray-100 relative shadow-lg">
              <LazyImage
                src={cat.CategoryThumbnail}
                alt={cat.name}
                className="w-full h-full object-cover transition-all duration-500"
              />

              {/* Mirror reflection */}
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 via-transparent opacity-30 rounded-full pointer-events-none" />
            </div>

            {/* Text */}
            <h3 className="font-semibold text-gray-800 text-lg md:text-xl transition-all duration-500 hover:text-gray-900">
              {cat.name.toUpperCase()}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}
