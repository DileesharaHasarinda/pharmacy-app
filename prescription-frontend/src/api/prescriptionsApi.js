import axiosInstance from "./axiosConfig";

const prescriptionsApi = {
  getAllPrescriptions: async () => {
    try {
      const response = await axiosInstance.get("/prescriptions");
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getPrescriptionById: async (id) => {
    try {
      const response = await axiosInstance.get(`/prescriptions/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  createPrescription: async (prescriptionData) => {
    try {
      const response = await axiosInstance.post(
        "/prescriptions",
        prescriptionData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  updatePrescription: async (id, prescriptionData) => {
    try {
      const response = await axiosInstance.patch(
        `/prescriptions/${id}`,
        prescriptionData
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deletePrescription: async (id) => {
    try {
      const response = await axiosInstance.delete(`/prescriptions/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default prescriptionsApi;
