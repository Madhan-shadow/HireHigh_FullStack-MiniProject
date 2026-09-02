import api from './api';

const unwrap = (response) => response?.data ?? response;

const apply = async (jobId) => {
  const response = await api.post(`/applications/apply/${jobId}`);
  return unwrap(response);
};

const getAll = async (page = 0, size = 5, stage) => {
  const response = await api.get('/applications', {
    params: { page, size, ...(stage ? { stage } : {}) },
  });
  return unwrap(response);
};

const getMyApplications = async () => {
  const response = await api.get('/applications/my-applications');
  return unwrap(response);
};

const getById = async (id) => {
  const response = await api.get(`/applications/${id}`);
  return unwrap(response);
};

const updateStage = async (id, stage) => {
  const response = await api.put(`/applications/${id}/stage`, { stage });
  return unwrap(response);
};

const deleteApplication = async (id) => {
  const response = await api.delete(`/applications/${id}`);
  return unwrap(response);
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