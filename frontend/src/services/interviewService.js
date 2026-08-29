import api from './api';

const getAll = async () => {
  const response = await api.get('/interviews');
  return response.data;
};

const getByInterviewer = async (interviewerId) => {
  const response = await api.get('/interviews', {
    params: { interviewerId },
  });
  return response.data;
};

const schedule = async (interviewData) => {
  const response = await api.post('/interviews', interviewData);
  return response.data;
};

const recordFeedback = async (id, feedbackData) => {
  const response = await api.put(`/interviews/${id}`, feedbackData);
  return response.data;
};

const deleteInterview = async (id) => {
  const response = await api.delete(`/interviews/${id}`);
  return response.data;
};

const interviewService = {
  getAll,
  getByInterviewer,
  schedule,
  recordFeedback,
  delete: deleteInterview,
};

export default interviewService;