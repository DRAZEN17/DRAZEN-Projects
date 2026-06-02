import { api } from './api.js';
export const projectsService = {
  list: (params) => api.get('/projects', { params }).then((r) => r.data),
  get: (idOrSlug) => api.get(`/projects/${idOrSlug}`).then((r) => r.data),
  create: (data) => api.post('/projects', data).then((r) => r.data),
  update: (id, data) => api.put(`/projects/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/projects/${id}`).then((r) => r.data),
};
export const blogsService = {
  list: (params) => api.get('/blogs', { params }).then((r) => r.data),
  get: (idOrSlug) => api.get(`/blogs/${idOrSlug}`).then((r) => r.data),
  create: (data) => api.post('/blogs', data).then((r) => r.data),
  update: (id, data) => api.put(`/blogs/${id}`, data).then((r) => r.data),
  remove: (id) => api.delete(`/blogs/${id}`).then((r) => r.data),
};
export const testimonialsService = {
  list: () => api.get('/testimonials').then((r) => r.data),
};
export const messagesService = {
  send: (data) => api.post('/messages', data).then((r) => r.data),
  list: () => api.get('/messages').then((r) => r.data),
  markRead: (id) => api.patch(`/messages/${id}/read`).then((r) => r.data),
  remove: (id) => api.delete(`/messages/${id}`).then((r) => r.data),
};
