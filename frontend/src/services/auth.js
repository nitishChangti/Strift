import axios from "axios";
console.log("BASE_URL:", import.meta.env.VITE_BASE_URL);

export class AuthService {
  baseUrl = import.meta.env.VITE_BASE_URL;

  async phoneSend({ phone, api }) {
    try {
      // const phone = `+${phone}`; // Ensure phone number is in E.164 format
      const response = await axios.post(
        `${this.baseUrl}/${api}`,
        {
          phone,
        },
        {
          withCredentials: true, // ✅ required to receive cookies
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error sending phone number:", error);
      throw error;
    }
  }

  async verifyOtp({ phone, otp, api }) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/${api}`,
        {
          phone,
          otp,
        },
        {
          withCredentials: true, // ✅ required to receive cookies
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error verifying OTP:", error);
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      const response = await axios.get(
        `${this.baseUrl}/account/getCurrentUser`,
        {
          withCredentials: true, // Ensure cookies are sent with the request
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching current user:", error);
      throw error;
    }
  }

  async logout() {
    try {
      const response = await axios.get(`${this.baseUrl}/account/logout`, {
        withCredentials: true, // Ensure cookies are sent with the request
      });
      console.log("logged response ", response.data);

      return response.data;
    } catch (error) {
      console.error("Error logging out:", error);
      throw error;
    }
  }

  async checkUser(phone) {
    try {
      const res = await axios.post(
        `${this.baseUrl}/check-user`,
        {
          phone,
        },
        {
          withCredentials: true, // Ensure cookies are sent with the requests
        }
      );
      return res.data;
    } catch (err) {
      console.log(" error in check user ", err);
      return err.response;
    }
  }
  // ADMIN AUTH
  async adminSendOtp(phone) {
    const res = await axios.post(
      `${this.baseUrl}/admin/login`,
      { phone },
      { withCredentials: true }
    );
    return res.data;
  }

  async adminVerifyOtp(phone, otp) {
    console.log('verify route');
    const res = await axios.post(
      `${this.baseUrl}/admin/login-otp-verify`,
      { phone, otp },
      { withCredentials: true }
    );
    return res.data;
  }

  // Get all categories (Admin)
  async getAllCategories() {
    try {
      const response = await axios.get(
        `${this.baseUrl}/getallcategory`,
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
}

const authService = new AuthService();
export default authService;
