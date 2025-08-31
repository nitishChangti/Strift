import axios from "axios";
export class AuthService {
    baseUrl = 'http://localhost:3000';

    async phoneSend({ phone, api }) {
        try {
            // const phone = `+${phone}`; // Ensure phone number is in E.164 format
            const response = await axios.post(`${this.baseUrl}/${api}`, {
                phone
            }, {
                withCredentials: true // ✅ required to receive cookies
            })
            return response.data;

        } catch (error) {
            console.error("Error sending phone number:", error);
            throw error;
        }
    }

    async verifyOtp({ phone, otp, api }) {
        try {
            const response = await axios.post(`${this.baseUrl}/${api}`, {
                phone,
                otp
            }, {
                withCredentials: true // ✅ required to receive cookies
            })
            return response.data;

        } catch (error) {
            console.error("Error verifying OTP:", error);
            throw error;
        }
    }

    async getCurrentUser() {
        try {
            const response = await axios.get(`${this.baseUrl}/account/getCurrentUser`, {
                withCredentials: true // Ensure cookies are sent with the request
            });
            return response.data;
        } catch (error) {
            console.error("Error fetching current user:", error);
            throw error;
        }
    }

    async logout() {
        try {
            const response = await axios.get(`${this.baseUrl}/account/logout`, {
                withCredentials: true // Ensure cookies are sent with the request
            });
            console.log('logged response ', response.data)

            return response.data;
        } catch (error) {
            console.error("Error logging out:", error);
            throw error;
        }
    }

    async checkUser(phone) {
        try {
            const res = await axios.post(`${this.baseUrl}/check-user`, {
                phone
            }, {
                withCredentials: true // Ensure cookies are sent with the requests
            })
            return res.data;
        }
        catch (err) {
            console.log(' error in check user ', err)
            return err.response
        }
    }
}

const authService = new AuthService();
export default authService;