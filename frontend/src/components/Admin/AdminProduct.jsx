import { useEffect, useState } from "react";
import productService from "../../services/admin/products.js";

const AdminProduct = () => {
  const ITEMS_PER_PAGE = 10;

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(false);

  const [showView, setShowView] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const skip = (page - 1) * ITEMS_PER_PAGE;

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAllProducts({
        skip,
        limit: ITEMS_PER_PAGE,
      });
      setProducts(response?.data?.products || []);
      setTotalProducts(response?.data?.totalProducts || 0);
    } catch (error) {
      console.error("Failed to load products", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative">
      <div className="bg-white rounded-lg shadow p-6">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Products Management</h2>
        </div>

        {/* TABLE */}
        {!loading && products.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 text-left">Tag</th>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Image</th>
                  <th className="p-2 text-left">Category</th>
                  <th className="p-2 text-left">Price</th>
                  <th className="p-2 text-left">Stock</th>
                  <th className="p-2 text-left">Action</th>
                </tr>
              </thead>

              <tbody>
                {products.map((p) => (
                  <tr key={p._id} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{p.TagId}</td>
                    <td className="p-2">{p.name}</td>
                    <td className="p-2">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-12 h-12 rounded object-cover"
                      />
                    </td>
                    <td className="p-2">{p.CategoryName}</td>
                    <td className="p-2">₹{p.price}</td>
                    <td className="p-2">{p.stock}</td>
                    <td className="p-2">
                      <button
                        onClick={() => {
                          setSelectedProduct(p);
                          setShowView(true);
                        }}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-xs"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ================= VIEW DRAWER ================= */}
      {showView && selectedProduct && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex justify-end z-50">
          <div className="w-full sm:w-[420px] bg-white h-full overflow-y-auto p-6">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Product Details</h3>
              <button
                onClick={() => setShowView(false)}
                className="text-gray-500 hover:text-black text-xl"
              >
                ✕
              </button>
            </div>

            {/* MAIN IMAGE */}
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="w-full h-56 object-contain border rounded mb-4"
            />

            {/* GALLERY */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {selectedProduct.images?.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  className="h-16 w-full object-cover border rounded"
                />
              ))}
            </div>

            {/* BASIC INFO */}
            <div className="space-y-2 text-sm mb-4">
              <p>
                <b>Name:</b> {selectedProduct.name}
              </p>
              <p>
                <b>Tag:</b> {selectedProduct.TagId}
              </p>
              <p>
                <b>Category:</b> {selectedProduct.CategoryName}
              </p>
              <p>
                <b>Gender:</b> {selectedProduct.gender}
              </p>
              <p>
                <b>Price:</b> ₹{selectedProduct.price}
              </p>
              <p>
                <b>Discount:</b> {selectedProduct.discount}%
              </p>
              <p>
                <b>Stock:</b> {selectedProduct.stock}
              </p>
            </div>

            {/* SIZES */}
            {selectedProduct.variants?.size?.length > 0 && (
              <div className="mb-4">
                <p className="font-medium mb-1">Sizes</p>
                <div className="flex gap-2 flex-wrap">
                  {selectedProduct.variants.size.map((s) => (
                    <span key={s} className="px-2 py-1 border rounded text-xs">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* PRODUCT DETAILS (KEY-VALUE UI) */}
            {selectedProduct.productDetails && (
              <div>
                <p className="font-medium mb-2">Product Details</p>

                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  {selectedProduct.productDetails &&
                    typeof selectedProduct.productDetails === "object" && (
                      <div>
                        <p className="font-medium mb-2">Product Details</p>

                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                          {Object.entries(selectedProduct.productDetails).map(
                            ([key, value]) => (
                              <div key={key} className="flex gap-2">
                                <span className="font-medium capitalize">
                                  {key.replace(/_/g, " ")}
                                </span>
                                <span className="text-gray-600">
                                  {String(value)}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProduct;
