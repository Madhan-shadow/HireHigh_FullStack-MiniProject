import api from './api';

const apply = async (jobId) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const username =
    user?.email ||
    user?.username ||
    localStorage.getItem('username');

  const response = await api.post(
    `/applications/apply/${jobId}`,
    null,
    {
      params: { username },
    }
  );

  return response.data;
};

const getAll = async (page = 0, size = 5, stage) => {
  const response = await api.get('/applications', {
    params: {
      page,
      size,
      ...(stage ? { stage } : {}),
    },
  });

  return response.data;
};

const getMyApplications = async () => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const username =
    user?.email ||
    user?.username ||
    localStorage.getItem('username');

  const response = await api.get('/applications/my-applications', {
    params: { username },
  });

  return response.data;
};

const getById = async (id) => {
  const response = await api.get(`/applications/${id}`);
  return response.data;
};

const updateStage = async (id, stage) => {
  const response = await api.put(`/applications/${id}/stage`, null, {
    params: { stage },
  });

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