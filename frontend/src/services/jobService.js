import api from './api';

const jobService = {
  getAll: async () => {
    const response = await api.get('/jobs');
    return response.data; // List<JobPosting>
  },

  create: async (jobData) => {
    const response = await api.post('/jobs', jobData);
    return response.data; // JobPosting
  },

  update: async (id, jobData) => {
    const response = await api.put(`/jobs/${id}`, jobData);
    return response.data; // JobPosting
  },

  delete: async (id) => {
    const response = await api.delete(`/jobs/${id}`);
    return response.data; // { message: "..." }
  },
};

export default jobService;