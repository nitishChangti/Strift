import { useEffect, useState } from "react";
import { categoryService } from "../../services/admin/category.js";
import CategoryCard from "./CategoryCard";
import CreateCategory from "./CreateCategory.jsx";

const AdminCategory = () => {
  const [categories, setCategories] = useState([]);
  const [showCreate, setShowCreate] = useState(false);

  const loadCategories = async () => {
    try {
      const res = await categoryService.getAllCategories();
      if (res.status === 200) {
        setCategories(res.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Main Categories</h2>

        <button
          onClick={() => setShowCreate((prev) => !prev)}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
        >
          {showCreate ? "Cancel" : "+ Create Category"}
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <CategoryCard
            key={cat._id}
            title={cat.name}
            image={cat.CategoryThumbnail}
          />
        ))}
      </div>

      {/* Create Category Form (Below Categories) */}
      {showCreate && (
        <div className="mt-10 border-t pt-8">
          <CreateCategory
            onSuccess={() => {
              setShowCreate(false); // close after success
              loadCategories();     // refresh list
            }}
            onCancel={() => setShowCreate(false)} // manual close
          />
        </div>
      )}
    </div>
  );
};

export default AdminCategory;
