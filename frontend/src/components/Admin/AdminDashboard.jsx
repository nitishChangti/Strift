import { useEffect, useState } from "react";
import { categoryService } from "../../services/admin/category.js";

const AdminDashboard = () => {
  const [categories, setCategories] = useState([]);

  const loadCategories = async () => {
    try {
      const res = await categoryService.getAllCategories();
      if (res.status === 200) {
        setCategories(res.data);
      }
    } catch (error) {
      console.error("Failed to load categories", error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div>
      {/* Title */}
      <h2 className="text-xl font-semibold mb-6">Main Categories</h2>

      {/* Category Cards */}
      <div className="flex gap-10 flex-wrap">
        {categories.map((category) => (
          <div
            key={category._id}
            className="flex flex-col items-center gap-3 cursor-pointer group"
          >
            {/* Image */}
            <div className="w-28 h-28 rounded-full overflow-hidden shadow-sm group-hover:shadow-md transition">
              <img
                src={category.CategoryThumbnail}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>

            {/* Name */}
            <span className="font-medium text-gray-700">
              {category.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
