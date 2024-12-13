import axiosInstance from "./axiosConfig";

const authApi = {
  login: async (credentials) => {
    try {
      const response = await axiosInstance.post("/auth/login", credentials);
      if (response.data.access_token) {
        localStorage.setItem("token", response.data.access_token);
      }
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  register: async (userData) => {
    try {
      const response = await axiosInstance.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};

export default authApi;
