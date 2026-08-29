import api from './api';

const apply = async (jobId) => {
  const response = await api.post(`/applications/apply/${jobId}`);
  return response.data;
};

// getAll MUST pass pagination parameters to ensure server-side paging is enforced
const getAll = async (page = 0, size = 5) => {
  const response = await api.get('/applications', {
    params: { page, size },
  });
  return response.data;
};

const getMyApplications = async () => {
  const response = await api.get('/applications/my-applications');
  return response.data;
};

const getById = async (id) => {
  const response = await api.get(`/applications/${id}`);
  return response.data;
};

const updateStage = async (id, stage) => {
  const response = await api.put(`/applications/${id}/stage`, { stage });
  return response.data;
};

const deleteApplication = async (id) => {
  const response = await api.delete(`/applications/${id}`);
  return response.data;
};

const applicationService = {
  apply,
  getAll,
  getMyApplications,
  getById,
  updateStage,
  delete: deleteApplication,
};

export default applicationService;