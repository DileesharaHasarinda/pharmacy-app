import axiosInstance from "./axiosConfig";

const quotationsApi = {
  getAllQuotations: async () => {
    try {
      const response = await axiosInstance.get("/quotations");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getQuotationById: async (id) => {
    try {
      const response = await axiosInstance.get(`/quotations/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createQuotation: async (quotationData) => {
    try {
      const response = await axiosInstance.post("/quotations", quotationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updateQuotation: async (id, quotationData) => {
    try {
      const response = await axiosInstance.patch(
        `/quotations/${id}`,
        quotationData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteQuotation: async (id) => {
    try {
      const response = await axiosInstance.delete(`/quotations/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  updateQuotationState: async (id, state) => {
    const response = await axiosInstance.patch(`/quotations/${id}/state`, {
      state,
    });
    return response.data;
  },
};

export default quotationsApi;
