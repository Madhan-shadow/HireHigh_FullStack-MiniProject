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
  // Backend reads this via @RequestParam, not a JSON body — must go
  // on the query string, with no request body at all.
  const response = await api.put(`/applications/${id}/stage`, null, {
    params: { stage },
  });
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