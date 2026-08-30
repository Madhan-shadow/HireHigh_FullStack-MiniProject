import api from './api';

const applicationService = {
  apply: async (jobId) => {
    const response = await api.post(`/applications/apply/${jobId}`);
    return response.data; // { message: "Application submitted successfully." }
  },

  getAll: async (page = 0, size = 5) => {
    const response = await api.get('/applications', { params: { page, size } });
    return response.data; // { content, totalPages, totalElements, number, size }
  },

  getMyApplications: async () => {
    const response = await api.get('/applications/my-applications');
    return response.data;
  },

  updateStage: async (id, stage) => {
    const response = await api.put(`/applications/${id}/stage`, { stage });
    return response.data;
  },

  deleteApplication: async (id) => {
    const response = await api.delete(`/applications/${id}`);
    return response.data; // { message: "Application deleted successfully." }
  },
};

export default applicationService;