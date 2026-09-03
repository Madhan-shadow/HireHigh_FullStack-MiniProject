import api from "./api";

const jobService = {
  async getAll() {
    const response = await api.get("/jobs");
    return response?.data || [];
  },

  async create(jobData) {
    const response = await api.post("/jobs", jobData);
    return response?.data;
  },

  async update(id, jobData) {
    const response = await api.put(`/jobs/${id}`, jobData);
    return response?.data;
  },

  async delete(id) {
    const response = await api.delete(`/jobs/${id}`);

    return (
      response?.data || {
        message: "Job deleted successfully.",
      }
    );
  },
};

export default jobService;