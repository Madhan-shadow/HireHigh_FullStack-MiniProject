import api from "./api";

const applicationService = {

  async apply(jobId) {
    const user =
      localStorage.getItem("user");

    let username = "";

    try {
      const parsedUser =
        JSON.parse(user);

      username =
        parsedUser.username || "";
    } catch {
      username =
        localStorage.getItem("username") ||
        "";
    }

    const response = await api.post(
      `/applications/apply/${jobId}`,
      null,
      {
        params: {
          username
        }
      }
    );

    return response.data;
  },

  async getAll(page = 0, size = 5) {
    const response = await api.get(
      "/applications",
      {
        params: {
          page,
          size
        }
      }
    );

    return response.data;
  },

  async getMyApplications() {
    const response = await api.get(
      "/applications/my-applications"
    );

    return response.data;
  },

  async updateStage(id, stage) {
    const response = await api.put(
      `/applications/${id}/stage`,
      { stage }
    );

    return response.data;
  },

  async delete(id) {
    const response = await api.delete(
      `/applications/${id}`
    );

    return response.data;
  }

};

export default applicationService;