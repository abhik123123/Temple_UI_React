/**
 * postgresAPI.js
 * Unified API service — all data comes from PostgreSQL via Express backend.
 * Base URL: http://localhost:8080
 */

import axios from 'axios';
import config from '../config/environment';

const BASE_URL = config.backendUrl || 'http://localhost:8080';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach auth token to every request
api.interceptors.request.use((req) => {
  const token = localStorage.getItem('authToken');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// ─── Field transformers (snake_case → camelCase) ───────────────────────────

const toEvent = (r) => r && ({
  id: r.id,
  title: r.title,
  description: r.description,
  eventDate: r.event_date,
  date: r.event_date,
  startTime: r.start_time,
  endTime: r.end_time,
  location: r.location,
  category: r.category,
  status: r.status,
  imageUrl: r.image_url,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

const toService = (r) => r && ({
  id: r.id,
  name: r.name,
  description: r.description,
  price: r.price,
  icon: r.icon,
  details: Array.isArray(r.details) ? r.details : (r.details ? JSON.parse(r.details) : []),
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

const toStaff = (r) => r && ({
  id: r.id,
  fullName: r.full_name,
  role: r.role,
  department: r.department,
  phoneNumber: r.phone_number,
  email: r.email,
  joiningDate: r.joining_date,
  responsibilities: r.responsibilities,
  profileImageUrl: r.profile_image_url,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

const toBoardMember = (r) => r && ({
  id: r.id,
  fullName: r.full_name,
  position: r.position,
  department: r.department,
  email: r.email,
  phoneNumber: r.phone_number,
  biography: r.biography,
  profileImageUrl: r.profile_image_url,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

const toTiming = (r) => r && ({
  id: r.id,
  day: r.day,
  notes: r.notes,
  slots: Array.isArray(r.slots)
    ? r.slots.filter(s => s && s.openTime).map(s => ({
        id: s.id,
        openTime: s.openTime || s.open_time,
        closeTime: s.closeTime || s.close_time,
      }))
    : [],
});

const toGallery = (r) => r && ({
  id: r.id,
  title: r.title,
  description: r.description,
  url: r.url,
  type: r.type,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

const toDonor = (r) => r && ({
  id: r.id,
  donorName: r.donor_name,
  inMemoryOf: r.in_memory_of,
  donationType: r.donation_type,
  amount: r.amount,
  items: r.items,
  itemDescription: r.item_description,
  itemValue: r.item_value,
  date: r.date || r.donation_date,
  donationDate: r.donation_date || r.date,
  phone: r.phone,
  email: r.email,
  address: r.address,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

const toBajana = (r) => r && ({
  id: r.id,
  title: r.title,
  artist: r.artist,
  category: r.category,
  deity: r.deity,
  schedule: r.schedule,
  description: r.description,
  details: Array.isArray(r.details) ? r.details : [],
  icon: r.icon,
  hasAudio: r.has_audio,
  hasLyrics: r.has_lyrics,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

const toDailyPooja = (r) => r && ({
  id: r.id,
  name: r.name,
  time: r.time,
  duration: r.duration,
  day: r.day,
  description: r.description,
  deity: r.deity,
  details: Array.isArray(r.details) ? r.details : [],
  icon: r.icon,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

const toPoojaBook = (r) => r && ({
  id: r.id,
  title: r.title,
  category: r.category,
  description: r.description,
  details: Array.isArray(r.details) ? r.details : [],
  icon: r.icon,
  language: r.language,
  pages: r.pages,
  level: r.level,
  downloadable: r.downloadable,
  createdAt: r.created_at,
  updatedAt: r.updated_at,
});

// helper — unwrap axios response and transform array or single object
const list  = (transform) => (res) => (res.data || []).map(transform);
const single = (transform) => (res) => transform(res.data);

// ─── EVENTS ────────────────────────────────────────────────────────────────
export const eventsAPI = {
  getAll:   () => api.get('/api/events').then(list(toEvent)),
  getById:  (id) => api.get(`/api/events/${id}`).then(single(toEvent)),
  create:   (data) => api.post('/api/events', data).then(single(toEvent)),
  update:   (id, data) => api.put(`/api/events/${id}`, data).then(single(toEvent)),
  delete:   (id) => api.delete(`/api/events/${id}`).then((r) => r.data),
};

// ─── SERVICES ──────────────────────────────────────────────────────────────
export const servicesAPI = {
  getAll:   () => api.get('/api/services').then(list(toService)),
  getById:  (id) => api.get(`/api/services/${id}`).then(single(toService)),
  create:   (data) => api.post('/api/services', data).then(single(toService)),
  update:   (id, data) => api.put(`/api/services/${id}`, data).then(single(toService)),
  delete:   (id) => api.delete(`/api/services/${id}`).then((r) => r.data),
};

// ─── STAFF ─────────────────────────────────────────────────────────────────
export const staffAPI = {
  getAll:          () => api.get('/api/staff').then(list(toStaff)),
  getById:         (id) => api.get(`/api/staff/${id}`).then(single(toStaff)),
  getByDepartment: (dept) => api.get(`/api/staff/department/${dept}`).then(list(toStaff)),
  create:          (data) => api.post('/api/staff', data).then(single(toStaff)),
  update:          (id, data) => api.put(`/api/staff/${id}`, data).then(single(toStaff)),
  delete:          (id) => api.delete(`/api/staff/${id}`).then((r) => r.data),
};

// ─── BOARD MEMBERS ─────────────────────────────────────────────────────────
export const boardMembersAPI = {
  getAll:          () => api.get('/api/board-members').then(list(toBoardMember)),
  getById:         (id) => api.get(`/api/board-members/${id}`).then(single(toBoardMember)),
  getByDepartment: (dept) => api.get(`/api/board-members/department/${dept}`).then(list(toBoardMember)),
  create:          (data) => api.post('/api/board-members', data).then(single(toBoardMember)),
  update:          (id, data) => api.put(`/api/board-members/${id}`, data).then(single(toBoardMember)),
  delete:          (id) => api.delete(`/api/board-members/${id}`).then((r) => r.data),
};

// ─── TIMINGS ───────────────────────────────────────────────────────────────
export const timingsAPI = {
  getAll:  () => api.get('/api/timings').then(list(toTiming)),
  update:  (day, data) => api.put(`/api/timings/${encodeURIComponent(day)}`, data).then(single(toTiming)),
};

// ─── GALLERY ───────────────────────────────────────────────────────────────
export const galleryAPI = {
  getAll:    () => api.get('/api/gallery').then(list(toGallery)),
  getByType: (type) => api.get(`/api/gallery/type/${type}`).then(list(toGallery)),
  getById:   (id) => api.get(`/api/gallery/${id}`).then(single(toGallery)),
  create:    (data) => api.post('/api/gallery', data).then(single(toGallery)),
  update:    (id, data) => api.put(`/api/gallery/${id}`, data).then(single(toGallery)),
  delete:    (id) => api.delete(`/api/gallery/${id}`).then((r) => r.data),
};

// ─── DONORS ────────────────────────────────────────────────────────────────
export const donorsAPI = {
  getAll:  () => api.get('/api/donors').then(list(toDonor)),
  getById: (id) => api.get(`/api/donors/${id}`).then(single(toDonor)),
  create:  (data) => api.post('/api/donors', data).then(single(toDonor)),
  update:  (id, data) => api.put(`/api/donors/${id}`, data).then(single(toDonor)),
  delete:  (id) => api.delete(`/api/donors/${id}`).then((r) => r.data),
};

// ─── BAJANAS ───────────────────────────────────────────────────────────────
export const bajanasAPI = {
  getAll:  () => api.get('/api/bajanas').then(list(toBajana)),
  getById: (id) => api.get(`/api/bajanas/${id}`).then(single(toBajana)),
  create:  (data) => api.post('/api/bajanas', { ...data, has_audio: data.hasAudio, has_lyrics: data.hasLyrics }).then(single(toBajana)),
  update:  (id, data) => api.put(`/api/bajanas/${id}`, { ...data, has_audio: data.hasAudio, has_lyrics: data.hasLyrics }).then(single(toBajana)),
  delete:  (id) => api.delete(`/api/bajanas/${id}`).then((r) => r.data),
};

// ─── DAILY POOJAS ──────────────────────────────────────────────────────────
export const dailyPoojasAPI = {
  getAll:    () => api.get('/api/daily-poojas').then(list(toDailyPooja)),
  getByDay:  (day) => api.get(`/api/daily-poojas/day/${day}`).then(list(toDailyPooja)),
  getById:   (id) => api.get(`/api/daily-poojas/${id}`).then(single(toDailyPooja)),
  create:    (data) => api.post('/api/daily-poojas', data).then(single(toDailyPooja)),
  update:    (id, data) => api.put(`/api/daily-poojas/${id}`, data).then(single(toDailyPooja)),
  delete:    (id) => api.delete(`/api/daily-poojas/${id}`).then((r) => r.data),
};

// ─── POOJA BOOKS ───────────────────────────────────────────────────────────
export const poojaBooksAPI = {
  getAll:  () => api.get('/api/pooja-books').then(list(toPoojaBook)),
  getById: (id) => api.get(`/api/pooja-books/${id}`).then(single(toPoojaBook)),
  create:  (data) => api.post('/api/pooja-books', data).then(single(toPoojaBook)),
  update:  (id, data) => api.put(`/api/pooja-books/${id}`, data).then(single(toPoojaBook)),
  delete:  (id) => api.delete(`/api/pooja-books/${id}`).then((r) => r.data),
};

export default api;
