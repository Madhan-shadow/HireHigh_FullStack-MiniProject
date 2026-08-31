import api from './api';

const getAll = async () => {
  const response = await api.get('/jobs');
  return response.data;
};

const create = async (jobData) => {
  const response = await api.post('/jobs', jobData);
  return response.data;
};

const update = async (id, jobData) => {
  const response = await api.put(`/jobs/${id}`, jobData);
  return response.data;
};

const deleteJob = async (id) => {
  const response = await api.delete(`/jobs/${id}`);
  return response.data;
};

const jobService = { getAll, create, update, delete: deleteJob };

export default jobService;