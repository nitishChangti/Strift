import axios from "axios";
console.log("BASE_URL:", import.meta.env.VITE_BASE_URL);

export class ProductService {
  baseUrl = import.meta.env.VITE_BASE_URL;

  async getAllProducts({ skip = 0, limit = 10 }) {
  try {
    const response = await axios.get(
      `${this.baseUrl}/admin/dashboard/getAllProducts`,
      {
        params: { skip, limit }, // ✅ pagination params
        withCredentials: true,   // ✅ required for cookies / auth
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

 /* ================= CREATE PRODUCT ================= */
  async createProduct(formData) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/admin/dashboard/createproduct`,
        formData,
        {
          withCredentials: true, // required for admin auth
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response;
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  }

}

const productService = new ProductService();
export default productService;
