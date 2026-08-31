import api from './api';

const getByInterviewer = async (interviewerId) => {
  const res = await api.get('/interviews', { params: { interviewerId } });
  return res.data;
};

const recordFeedback = async (id, feedback, rating) => {
  const res = await api.put(`/interviews/${id}`, { feedback, rating });
  return res.data;
};

const interviewService = { getByInterviewer, recordFeedback };
export default interviewService;