import axios from 'axios';

export class UserProductService {
    baseUrl = 'http://localhost:3000';
    async fetchSuggestionProduct(query) {
        try {
            const response = await axios.get(
                `${this.baseUrl}/suggestions`, { params: { q: query } }
            );
            return response.data.suggestions; // returns array of product names
        } catch (error) {
            console.error("Error fetching suggestions:", error);
            return []; // fallback to empty array on failure
        }
    }

    async fetchProducts(name) {
        try {
            const encodedName = encodeURIComponent(name);
            const response = await axios.get(`${this.baseUrl}/product/${encodedName}`);
            return response.data.data;
        }
        catch (err) {
            console.error("Error fetching product:", err);
            return null;
        }
    }

    async fetchProductDetails(id) {
        try {
            const response = await axios.get(`${this.baseUrl}/productdetail`, { params: { id: id } });
            return response.data.data;
        }
        catch (err) {
            console.error("Error fetching product details:", err);
            return null;
        }
    }
    async addToWishlist(id) {
        try {
            const response = await axios.post(`${this.baseUrl}/updateWishlist`, { productId: id }, {
                withCredentials: true
            });
            return response;
        }
        catch (error) {
            console.error("Error adding to wishlist:", error);
            return null;
        }
    }

    async deleteFromWishlist(id) {
        try {
            const response = await axios.post(`${this.baseUrl}/updateWishlist`, { productId: id },
                {
                    withCredentials: true,
                    // params: { remove: true }
                }
            );

            return response;
        }
        catch (error) {
            console.error("Error removing from wishlist:", error);
            return null;
        }
    }
}

const userProductService = new UserProductService();

export default userProductService;