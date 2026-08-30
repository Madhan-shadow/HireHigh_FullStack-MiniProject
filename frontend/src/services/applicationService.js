import api from './api';

const getStoredUsername = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.username;
  } catch {
    return undefined;
  }
};

const applicationService = {
  apply: async (jobId) => {
    const username = getStoredUsername();
    const response = await api.post(`/applications/apply/${jobId}`, null, {
      params: { username },
    });
    return response.data; // { message: "Application submitted successfully." }
  },

  getAll: async (page = 0, size = 5, stage) => {
    const params = { page, size };
    if (stage && stage !== 'ALL') params.stage = stage;
    const response = await api.get('/applications', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  },

  getMyApplications: async () => {
    const username = getStoredUsername();
    const response = await api.get('/applications/my-applications', {
      params: { username },
    });
    return response.data;
  },

  updateStage: async (id, stage) => {
    const response = await api.put(`/applications/${id}/stage`, null, {
      params: { stage },
    });
    return response.data;
  },

  deleteApplication: async (id) => {
    const response = await api.delete(`/applications/${id}`);
    return response.data; // { message: "Application deleted successfully." }
  },
};

export default applicationService;