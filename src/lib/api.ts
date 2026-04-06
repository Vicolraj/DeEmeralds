import axios from 'axios';
import type { Member, YouTubeVideo, Rehearsal, AuthResponse } from './types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('de_emeralds_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Public endpoints ──────────────────────────
export const getMembers = (_all = false) => api.get<Member[]>('/members').then(r => r.data);
export const getVideos = () => api.get<YouTubeVideo[]>('/videos').then(r => r.data);
export const getRehearsals = () => api.get<Rehearsal[]>('/rehearsals').then(r => r.data);

// ── Admin: Auth ───────────────────────────────
export const adminLogin = (username: string, password: string) =>
  api.post<AuthResponse>('/admin/login', { username, password }).then(r => r.data);

// ── Admin: Members ────────────────────────────
export const createMember = (data: Omit<Member, 'id' | 'createdAt' | 'updatedAt'>) =>
  api.post<Member>('/members', data).then(r => r.data);
export const updateMember = (id: number, data: Partial<Member>) =>
  api.put<Member>(`/members/${id}`, data).then(r => r.data);
export const deleteMember = (id: number) =>
  api.delete(`/members/${id}`).then(r => r.data);

// ── Admin: Videos ─────────────────────────────
export const createVideo = (data: { videoId: string; title?: string }) =>
  api.post<YouTubeVideo>('/videos', data).then(r => r.data);
export const deleteVideo = (id: number) =>
  api.delete(`/videos/${id}`).then(r => r.data);

// ── Admin: Rehearsals ─────────────────────────
export const createRehearsal = (data: Omit<Rehearsal, 'id'>) =>
  api.post<Rehearsal>('/rehearsals', data).then(r => r.data);
export const updateRehearsal = (id: number, data: Partial<Rehearsal>) =>
  api.put<Rehearsal>(`/rehearsals/${id}`, data).then(r => r.data);
export const deleteRehearsal = (id: number) =>
  api.delete(`/rehearsals/${id}`).then(r => r.data);

// ── Admin: Management ────────────────────────
export const getAdminUsers = () =>
  api.get('/admin/users').then(r => r.data);

export const createAdminUser = (data: any) =>
  api.post('/admin/register', data).then(r => r.data);

export const deleteAdminUser = (id: number) =>
  api.delete(`/admin/users/${id}`).then(r => r.data);

// ── Admin: Stats ─────────────────────────────
export const getStats = () =>
  api.get('/stats').then(r => r.data);

export const updateStats = (data: { songsCount: number; eventsCount: number }) =>
  api.put('/stats', data).then(r => r.data);

// ── Admin: Socials ───────────────────────────
export const getSocialLinks = () =>
  api.get('/socials').then(r => r.data);

export const getAllSocialLinks = () =>
  api.get('/socials/all').then(r => r.data);

export const updateSocialLink = (id: number, data: any) =>
  api.put(`/socials/${id}`, data).then(r => r.data);

export const createSocialLink = (data: any) =>
  api.post('/socials', data).then(r => r.data);

export const deleteSocialLink = (id: number) =>
  api.delete(`/socials/${id}`).then(r => r.data);

export default api;
