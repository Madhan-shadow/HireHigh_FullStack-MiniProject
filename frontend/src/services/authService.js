import api from "./api";

const authService = {

  async login(credentials) {
    const response =
      await api.post(
        "/auth/login",
        credentials
      );

    return response.data;
  },

  async register(userData) {
    const response =
      await api.post(
        "/auth/register",
        userData
      );

    return response.data;
  },

  async logout() {
    localStorage.removeItem(
      "token"
    );

    localStorage.removeItem(
      "role"
    );

    localStorage.removeItem(
      "user"
    );

    localStorage.removeItem(
      "username"
    );
  }

};

export default authService;