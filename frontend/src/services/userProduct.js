import axios from "axios";

export class UserProductService {
  baseUrl = import.meta.env.VITE_BASE_URL;

  async fetchSuggestionProduct(query) {
    try {
      const response = await axios.get(`${this.baseUrl}/suggestions`, {
        params: { q: query },
      });
      return response.data.suggestions; // returns array of product names
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      return []; // fallback to empty array on failure
    }
  }
  async fetchHomeProducts(limit = 12) {
    try {
      const response = await axios.get(`${this.baseUrl}/products/home`, {
        params: {
          limit,
          _t: Date.now(),
        },
      });
      return response.data;
    } catch (err) {
      console.error("Error fetching product:", err);
      //         return null;
    }
  }

  async fetchProducts({ search = "", category = "", categoryName = "" }) {
    try {
      const response = await axios.get(`${this.baseUrl}/products`, {
        params: {
          search,
          category,
          categoryName,
          _t: Date.now(),
        },
      });

      return response.data.data;
    } catch (err) {
      console.error("Error fetching products:", err);
      return [];
    }
  }

  async fetchProductDetails(id) {
    try {
      const response = await axios.get(`${this.baseUrl}/productdetail`, {
        params: {
          id: id,
          _t: Date.now(),
        },
      });
      return response.data.data;
    } catch (err) {
      console.error("Error fetching product details:", err);
      return null;
    }
  }
  async addToWishlist(id) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/updateWishlist`,
        { productId: id },
        {
          withCredentials: true,
        },
      );
      return response.data;
    } catch (error) {
      console.error("Error updating wishlist:", error?.response?.data || error);
      throw error; // let caller handle UI errors
    }
  }

  async deleteFromWishlist(id) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/updateWishlist`,
        { productId: id },
        {
          withCredentials: true,
          // params: { remove: true }
        },
      );

      return response;
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      return null;
    }
  }

  async addToCart(payload) {
    try {
      const res = await axios.post(
        `${this.baseUrl}/addTocart`,
        payload,
        { withCredentials: true }
      );

      return res.data; // ✅ { success, data: { cart }, message }
    } catch (error) {
      console.error("Error adding to cart:", error?.response?.data || error);
      throw error;
    }
  }

}

const userProductService = new UserProductService();

export default userProductService;
