import api from "./api";

const applicationService = {
  async apply(jobId) {
    try {
      const response = await api.post(`/applications/apply/${jobId}`);

      return (
        response?.data || {
          message: "Application submitted successfully.",
        }
      );
    } catch (error) {
      throw error;
    }
  },

  async getAll(page = 0, size = 5, stage = "", candidate = "") {
    const params = {
      page,
      size,
    };

    if (stage) {
      params.stage = stage;
    }

    if (candidate) {
      params.candidate = candidate;
    }

    const response = await api.get("/applications", {
      params,
    });

    return response?.data || {
      content: [],
      totalPages: 0,
      totalElements: 0,
      number: page,
      size,
    };
  },

  async getById(id) {
    const response = await api.get(`/applications/${id}`);
    return response?.data;
  },

  async updateStage(id, stage) {
    try {
      const response = await api.put(`/applications/${id}/stage`, {
        currentStage: stage,
        stage,
      });

      return (
        response?.data || {
          message: "Application updated successfully.",
        }
      );
    } catch (error) {
      throw error;
    }
  },

  async delete(id) {
    try {
      const response = await api.delete(`/applications/${id}`);

      return (
        response?.data || {
          message: "Application deleted successfully.",
        }
      );
    } catch (error) {
      throw error;
    }
  },

  async getMyApplications() {
    const response = await api.get("/applications/my-applications");
    return response?.data || [];
  },
};

export default applicationService;