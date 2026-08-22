import api from "./api";

const interviewService = {

  async getAll() {
    const response = await api.get(
      "/interviews"
    );

    return response.data;
  },

  async getById(id) {
    const response = await api.get(
      `/interviews/${id}`
    );

    return response.data;
  },

  async create(data) {
    const response = await api.post(
      "/interviews",
      data
    );

    return response.data;
  },

  async update(id, data) {
    const response = await api.put(
      `/interviews/${id}`,
      data
    );

    return response.data;
  },

  async delete(id) {
    const response = await api.delete(
      `/interviews/${id}`
    );

    return response.data;
  },

  async feedback(id, data) {
    const response = await api.put(
      `/interviews/${id}/feedback`,
      data
    );

    return response.data;
  }

};

export default interviewService;