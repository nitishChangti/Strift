import { useForm, useFieldArray } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import productService from "../../services/admin/products";
import { categoryService } from "../../services/admin/category";

const inputClass =
  "w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black";

const AdminCreateProduct = () => {
  const navigate = useNavigate();

  /* ================= STATE ================= */
  const [categories, setCategories] = useState([]);
  const [mainPreview, setMainPreview] = useState(null);
  const [galleryPreview, setGalleryPreview] = useState([]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      productDetails: [{ key: "", value: "" }],
    },
  });

  /* ================= PRODUCT DETAILS FIELD ARRAY ================= */
  const { fields, append, remove } = useFieldArray({
    control,
    name: "productDetails",
  });

  /* ================= FETCH CATEGORIES ================= */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryService.getAllCategories();
        if (res.status === 200) {
          setCategories(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    fetchCategories();
  }, []);

  /* ================= CATEGORY CHANGE ================= */
  const handleCategoryChange = (e) => {
    const selectedTagId = e.target.value;
    const selectedCategory = categories.find(
      (cat) => cat.TagId === selectedTagId
    );

    if (selectedCategory) {
      setValue("CategoryName", selectedCategory.name);
      setValue("CategoryTagId", selectedCategory.TagId);
    }
  };

  /* ================= IMAGE PREVIEW ================= */
  const handleMainImage = (e) => {
    const file = e.target.files[0];
    if (file) setMainPreview(URL.createObjectURL(file));
  };

  const handleGalleryImages = (e) => {
    const previews = Array.from(e.target.files).map((file) =>
      URL.createObjectURL(file)
    );
    setGalleryPreview(previews);
  };

  /* ================= SUBMIT ================= */
  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      /* ===== BASIC ===== */
      formData.append("productName", data.name);
      formData.append("description", data.description);
      formData.append("TagId", data.TagId);

      /* ===== CATEGORY ===== */
      formData.append("category", data.CategoryName);
      formData.append("subCategory", data.subCategoryName || "");

      /* ===== PRICING / INVENTORY ===== */
      formData.append("gender", data.gender);
      formData.append("price", data.price);
      formData.append("discount", data.discount);
      formData.append("countInStock", data.stock);

      /* ===== VARIANTS ===== */
      const sizesArray = data.sizes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const colorsArray = data.colors
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);

      formData.append("selectedSizes", JSON.stringify(sizesArray));
      formData.append("selectedColors", JSON.stringify(colorsArray));

      /* ===== PRODUCT DETAILS ===== */
      const detailsString = data.productDetails
        .filter((d) => d.key && d.value)
        .map((d) => `${d.key}: ${d.value}`)
        .join("\n");

      if (detailsString) {
        formData.append("productDetails", detailsString);
      }

      /* ===== IMAGES ===== */
      formData.append("image", data.image[0]);
      Array.from(data.images).forEach((img) =>
        formData.append("images", img)
      );

      await productService.createProduct(formData);
      navigate("/admin/products");
    } catch (err) {
      console.error("Create product failed", err);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Create Product</h2>
          <button
            onClick={() => navigate(-1)}
            className="border px-4 py-2 rounded"
          >
            Back
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          encType="multipart/form-data"
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* LEFT : IMAGE PREVIEW */}
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Main Image</h3>
              <div className="w-full h-64 border rounded bg-gray-50 flex items-center justify-center">
                {mainPreview ? (
                  <img src={mainPreview} className="h-full object-contain" />
                ) : (
                  <span className="text-gray-400">No image selected</span>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Gallery Images</h3>
              <div className="grid grid-cols-3 gap-2">
                {galleryPreview.length > 0 ? (
                  galleryPreview.map((src, i) => (
                    <img
                      key={i}
                      src={src}
                      className="h-24 w-full object-cover border rounded"
                    />
                  ))
                ) : (
                  <span className="col-span-3 text-gray-400">
                    No gallery images
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT : FORM */}
          <div className="space-y-4 max-h-[75vh] overflow-y-auto pr-2">

            <input placeholder="Product Name" {...register("name", { required: true })} className={inputClass} />
            <input placeholder="Product Tag ID" {...register("TagId", { required: true })} className={inputClass} />

            <textarea placeholder="Description" {...register("description", { required: true })} className={inputClass} />

            {/* CATEGORY */}
            <select onChange={handleCategoryChange} className={inputClass}>
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.TagId}>
                  {cat.name}
                </option>
              ))}
            </select>

            <input type="hidden" {...register("CategoryName")} />
            <input readOnly {...register("CategoryTagId")} className={`${inputClass} bg-gray-100`} />

            <input placeholder="Sub Category (optional)" {...register("subCategoryName")} className={inputClass} />

            {/* GENDER */}
            <select {...register("gender", { required: true })} className={inputClass}>
              <option value="">Select Gender</option>
              <option value="men">Men</option>
              <option value="women">Women</option>
              <option value="unisex">Unisex</option>
            </select>

            {/* PRICE / DISCOUNT / STOCK */}
            <div className="grid grid-cols-3 gap-3">
              <input placeholder="Price" {...register("price", { required: true })} className={inputClass} />
              <input placeholder="Discount %" {...register("discount", { required: true })} className={inputClass} />
              <input type="number" placeholder="Stock" {...register("stock", { required: true })} className={inputClass} />
            </div>

            {/* PRODUCT DETAILS */}
            <div className="border rounded p-4 space-y-3">
              <div className="flex justify-between">
                <h4 className="text-sm font-medium">Product Details</h4>
                <button type="button" onClick={() => append({ key: "", value: "" })} className="bg-black text-white px-3 py-1 rounded text-sm">
                  Add
                </button>
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-2 gap-2">
                  <input placeholder="Key" {...register(`productDetails.${index}.key`)} className={inputClass} />
                  <div className="flex gap-2">
                    <input placeholder="Value" {...register(`productDetails.${index}.value`)} className={inputClass} />
                    {fields.length > 1 && (
                      <button type="button" onClick={() => remove(index)} className="border px-3 rounded">
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* VARIANTS */}
            <input placeholder="Sizes (S, M, L)" {...register("sizes", { required: true })} className={inputClass} />
            <input placeholder="Colors (Red, Blue)" {...register("colors", { required: true })} className={inputClass} />

            {/* IMAGES */}
            <input type="file" accept="image/*" {...register("image", { required: true })} onChange={handleMainImage} />
            <input type="file" accept="image/*" multiple {...register("images", { required: true })} onChange={handleGalleryImages} />

            {/* ACTIONS */}
            <div className="flex gap-4 pt-4">
              <button type="submit" disabled={isSubmitting} className="bg-black text-white px-6 py-2 rounded">
                {isSubmitting ? "Creating..." : "Create Product"}
              </button>
              <button type="button" onClick={() => navigate(-1)} className="border px-6 py-2 rounded">
                Cancel
              </button>
            </div>

          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateProduct;
