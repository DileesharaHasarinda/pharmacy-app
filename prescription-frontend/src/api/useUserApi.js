import axiosInstance from "./axiosConfig";

const userApi = {
  getUserProfile: async () => {
    try {
      const response = await axiosInstance.get("/users/profile");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  getAllUsers: async () => {
    try {
      const response = await axiosInstance.get("/users");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  updateUser: async (data) => {
    try {
      const response = await axiosInstance.put("/users/profile", data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default userApi;
