import api from './api';

const getAll = async (page = 0, size = 5, stage) => {
  const params = { page, size };
  if (stage) params.stage = stage;
  const res = await api.get('/applications', { params });
  return res.data;
};

const getMyApplications = async () => {
  const res = await api.get('/applications/my-applications');
  return res.data;
};

const getById = async (id) => {
  const res = await api.get(`/applications/${id}`);
  return res.data;
};

const apply = async (jobId) => {
  const res = await api.post(`/applications/apply/${jobId}`);
  return res.data;
};

const updateStage = async (id, stage) => {
  const res = await api.put(`/applications/${id}/stage`, { stage });
  return res.data;
};

const deleteApplication = async (id) => {
  const res = await api.delete(`/applications/${id}`);
  return res.data;
};

const applicationService = {
  getAll,
  getMyApplications,
  getById,
  apply,
  updateStage,
  delete: deleteApplication,
};
export default applicationService;