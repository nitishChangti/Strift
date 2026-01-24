import axios from "axios";

class CategoryService {
  baseUrl = import.meta.env.VITE_BASE_URL;

  // Get all categories (Admin)
  async getAllCategories() {
    try {
      const response = await axios.get(
        `${this.baseUrl}/admin/dashboard/getallcategory`,
        {
          withCredentials: true, // required for admin auth
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }

  async createCategory(formData) {
  return axios.post(
    `${this.baseUrl}/admin/dashboard/createcategory`,
    formData,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
}

}

const categoryService = new CategoryService();
export { categoryService };
