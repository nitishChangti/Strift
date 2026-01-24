import { useForm } from "react-hook-form";
import { categoryService } from "../../services/admin/category.js";

const CreateCategory = ({ onSuccess, onCancel }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      // ⚠️ MUST MATCH BACKEND KEYS
      formData.append("categoryName", data.categoryName);
      formData.append("createdBy", "admin");
      formData.append("TagId", data.TagId);
      formData.append("description", data.description);

      if (data.image && data.image[0]) {
        formData.append("image", data.image[0]); // multer expects "image"
      }

      const res = await categoryService.createCategory(formData);

      if (res.status === 200 || res.status === 201) {
        reset();
        onSuccess();
      }
    } catch (error) {
      console.error("Create category failed", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      encType="multipart/form-data"
      className="bg-white p-6 rounded-lg shadow max-w-xl"
    >
      <h3 className="text-xl font-semibold mb-4">Create Category</h3>

      {/* Category Name */}
      <div className="mb-4">
        <input
          placeholder="Category Name"
          {...register("categoryName", { required: "Name is required" })}
          className="w-full border px-3 py-2 rounded"
        />
        {errors.categoryName && (
          <p className="text-red-500 text-sm">
            {errors.categoryName.message}
          </p>
        )}
      </div>

      {/* Tag ID */}
      <div className="mb-4">
        <input
          placeholder="Tag ID"
          {...register("TagId", { required: "TagId is required" })}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {/* Description */}
      <div className="mb-4">
        <textarea
          placeholder="Description"
          {...register("description", { required: "Description is required" })}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      {/* Image Upload */}
      <div className="mb-4">
        <input
          type="file"
          accept="image/*"
          {...register("image", { required: "Image is required" })}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-4 mt-6">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-black text-white px-6 py-2 rounded"
        >
          {isSubmitting ? "Creating..." : "Create Category"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="border px-6 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default CreateCategory;
