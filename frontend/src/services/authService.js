import api from "./api";

const authService = {
  async login(credentials) {
    const response = await api.post(
      "/auth/login",
      credentials
    );

    const data = response?.data || {};

    if (data.token) {
      localStorage.setItem("token", data.token);
    }

    if (data.role) {
      localStorage.setItem("role", data.role);
    }

    if (data.user) {
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );
    }

    return data;
  },

  async register(userData) {
    const response = await api.post(
      "/auth/register",
      userData
    );

    return response?.data || {};
  },

  async logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
  },
};

export default authService;