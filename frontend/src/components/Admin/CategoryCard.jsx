const CategoryCard = ({ title, image }) => {
  return (
    <div className="flex flex-col items-center gap-3 cursor-pointer group">
      {/* Circular Image */}
      <div className="w-28 h-28 rounded-full overflow-hidden border border-gray-200 transition-all duration-300 group-hover:scale-105 group-hover:ring-2 group-hover:ring-black">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Category Name */}
      <p className="text-sm font-medium text-gray-800">
        {title}
      </p>
    </div>
  );
};

export default CategoryCard;

