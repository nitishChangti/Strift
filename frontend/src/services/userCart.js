import axios from 'axios';

export class UserCartService {
    baseUrl = 'http://localhost:3000';
    async fetchUserCart() {
        try {
            const response = await axios.get(
                `${this.baseUrl}/fetchUserCart`,
                {
                    withCredentials: true
                }
            );
            return response.data; // returns array of product names
        } catch (error) {
            console.error("Error fetching suggestions:", error);
            return []; // fallback to empty array on failure
        }
    }

    async addToCart(cartItem) {
        try {
            const response = await axios.post(`${this.baseUrl}/addTocart`, cartItem, {
                withCredentials: true, // if you're using cookies for auth
            });
            return response.data;
        }
        catch (err) {
            console.error(" Error adding to cart:", err);
            return null;
        }
    }

    async updateCart(cartItem) {
        try {
            const response = await axios.post(`${this.baseUrl}/updateCart`, cartItem, {
                withCredentials: true, // if you're using cookies for auth
            });
            return response.data;
        }
        catch (err) {
            console.error("Error updating cart:", err);
            return null;
        }
    }

    async deleteFromCart(id) {
        try {
            const res = await axios.delete(`${this.baseUrl}/deleteFromCart/${id}`, {
                withCredentials: true // if you're using cookies for auth
            });
            return res.data;
        } catch (error) {
            console.error("Error deleting from cart:", error);
        }
    }

    async addProductFromCartToSavedForLater(id) {
        try {
            console.log(id)
            const res = await axios.post(`${this.baseUrl}/addSaveForLaterProduct/${id}`, {}, {
                withCredentials: true // if you're using cookies for auth
            })
            console.log(res)
            return res.data;
        }
        catch (err) {
            console.error("Error adding product to saved for later:", err);
            return null
        }
    }

    async fetchSaveForLater() {
        try {
            const res = await axios.get(`${this.baseUrl}/fetchSaveForLater`, {
                withCredentials: true // if you're using cookies for auth
            })
            return res.data;
        }
        catch (error) {
            console.error("Error fetching save for later:", error);
        }

    }

    async removeProductFromSavedForLater(id) {
        try {
            const res = await axios.delete(`${this.baseUrl}/removeProductFromSaveForLater/${id}`,
                {
                    withCredentials: true // if you're using cookies for auth
                }
            );
            return res.data;
        }
        catch (error) {
            console.error("Error removing product from saved for later:", error);
            return null
        }
    }

    async addProductFromSavedForLaterToCart(id) {
        try {
            const res = await axios.post(`${this.baseUrl}/addProductFromSaveForLaterToCart/${id}`, {}, {
                withCredentials: true // if you're using cookies for auth
            });
            return res.data;
        }
        catch (error) {
            console.error("Error adding product from saved for later:", error);
            return null
        }

    }
}

const userCartService = new UserCartService();

export default userCartService;