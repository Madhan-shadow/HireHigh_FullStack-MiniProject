import api from './api';

const getAll = async () => {
  const res = await api.get('/jobs');
  return res.data;
};

const create = async (jobData) => {
  const res = await api.post('/jobs', jobData);
  return res.data;
};

const update = async (id, jobData) => {
  const res = await api.put(`/jobs/${id}`, jobData);
  return res.data;
};

const deleteJob = async (id) => {
  const res = await api.delete(`/jobs/${id}`);
  return res.data;
};

const jobService = { getAll, create, update, delete: deleteJob };
export default jobService;