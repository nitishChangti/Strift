import axios from "axios";

export class UserProfileService {
    baseUrl = import.meta.env.VITE_BASE_URL;

    async getUserProfile() {
        try {
            const response = await axios.get(`${this.baseUrl}/account/profile/userData`, {
                withCredentials: true,  // important to send cookies
            })
            return response.data;
        } catch (error) {
            console.error("Error fetching suggestions:", error);
            return []; // fallback to empty array on failure
        }
    }
    async updateUserProfile(data) {
        try {
            const response = await axios.post(`${this.baseUrl}/account/profile`, {
                data
            }, {
                withCredentials: true,  // important to send cookies
            })
            return response.data;
        } catch (error) {
            console.error("Error fetching suggestions:", error);
            return []; // fallback to empty array on failure
        }
    }

    async createUserAddress(data) {
        try {
            const res = await axios.post(`${this.baseUrl}/account/profile/address`, {
                data
            }, {
                withCredentials: true,  // important to send cookies
            })
            return res.data;
        } catch (error) {
            console.log(' Error creating user address', error);
            return null
        }
    }

    async fetchUserAddresses() {
        try {
            const res = await axios.get(`${this.baseUrl}/profile/fetchAddress`, {
                withCredentials: true
            })
            return res.data;
        } catch (error) {
            console.error(' Error fetching user addresses', error);
        }
    }

    async deleteUserAddress(id) {
        try {
            const res = await axios.delete(`${this.baseUrl}/profile/deleteAddress`, {
                data: { id },
                withCredentials: true
            })
            return res.data;
        } catch (error) {
            console.error(' Error deleting user address', error);
            return null
        }
    }

    async getUserProductWishlist() {
        try {
            const res = await axios.get(`${this.baseUrl}/account/wishlist`, {
                withCredentials: true
            })
            return res.data;
        } catch (error) {
            console.error("Error fetching wishlist", error);
            return null
        }
    }


}

const userProfileService = new UserProfileService();

export default userProfileService;