import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add JWT token to every request
if (api.interceptors?.request?.use) {
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem("token");

      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => Promise.reject(error)
  );
}

// Handle unauthorized responses
if (api.interceptors?.response?.use) {
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error?.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("user");

        if (
          typeof window !== "undefined" &&
          window.location.pathname !== "/login"
        ) {
          window.location.href = "/login";
        }
      }

      return Promise.reject(error);
    }
  );
}

export default api;