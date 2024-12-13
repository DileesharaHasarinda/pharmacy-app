import axiosInstance from "./axiosConfig";

const drugsApi = {
  getAllDrugs: async () => {
    try {
      const response = await axiosInstance.get("/drugs");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getDrugById: async (id) => {
    try {
      const response = await axiosInstance.get(`/drugs/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createDrug: async (drugData) => {
    try {
      const response = await axiosInstance.post("/drugs", drugData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateDrug: async (id, drugData) => {
    try {
      const response = await axiosInstance.put(`/drugs/${id}`, drugData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteDrug: async (id) => {
    try {
      const response = await axiosInstance.delete(`/drugs/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default drugsApi;
