import axios from 'axios';
import { eventsAPI, donorsAPI, priestsAPI, servicesAPI, authAPI, templeTimingsAPI } from './api';

// Mock axios
jest.mock('axios');

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('Events API', () => {
    it('should fetch all events successfully', async () => {
      const mockEvents = [
        { id: 1, eventName: 'Diwali', eventDate: '2025-11-01' },
        { id: 2, eventName: 'Holi', eventDate: '2025-03-14' }
      ];

      axios.create = jest.fn(() => ({
        get: jest.fn().mockResolvedValue({ data: mockEvents }),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() }
        }
      }));

      const result = await eventsAPI.getAll();
      expect(result.data).toEqual(mockEvents);
    });

    it('should create an event with required fields', async () => {
      const newEvent = {
        eventName: 'Lakshmi Puja',
        eventDate: '2025-12-15',
        startTime: '18:00:00',
        endTime: '20:00:00',
        location: 'Main Hall',
        category: 'Festival'
      };

      axios.create = jest.fn(() => ({
        post: jest.fn().mockResolvedValue({ data: { ...newEvent, id: 3 } }),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() }
        }
      }));

      const result = await eventsAPI.create(newEvent);
      expect(result.data).toHaveProperty('id');
      expect(result.data.eventName).toBe('Lakshmi Puja');
    });

    it('should delete an event by ID', async () => {
      axios.create = jest.fn(() => ({
        delete: jest.fn().mockResolvedValue({ status: 204 }),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() }
        }
      }));

      const result = await eventsAPI.delete(1);
      expect(result.status).toBe(204);
    });
  });

  describe('Donors API', () => {
    it('should fetch all donors successfully', async () => {
      const mockDonors = [
        { id: 1, fullName: 'John Doe', amount: 5000 },
        { id: 2, fullName: 'Jane Smith', amount: 10000 }
      ];

      axios.create = jest.fn(() => ({
        get: jest.fn().mockResolvedValue({ data: mockDonors }),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() }
        }
      }));

      const result = await donorsAPI.getAll();
      expect(result.data).toEqual(mockDonors);
    });

    it('should create a donor record', async () => {
      const newDonor = {
        fullName: 'Raj Kumar',
        amount: 25000
      };

      axios.create = jest.fn(() => ({
        post: jest.fn().mockResolvedValue({ data: { ...newDonor, id: 3 } }),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() }
        }
      }));

      const result = await donorsAPI.create(newDonor);
      expect(result.data.fullName).toBe('Raj Kumar');
      expect(result.data.amount).toBe(25000);
    });
  });

  describe('Authentication API', () => {
    it('should login with valid credentials', async () => {
      const credentials = { username: 'test@temple.com', password: 'test123' };
      const mockResponse = { token: 'mock-jwt-token', user: { id: 1, name: 'Admin' } };

      axios.create = jest.fn(() => ({
        post: jest.fn().mockResolvedValue({ data: mockResponse }),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() }
        }
      }));

      const result = await authAPI.login(credentials);
      expect(result.data).toHaveProperty('token');
    });
  });

  describe('Priests API', () => {
    it('should fetch all priests', async () => {
      const mockPriests = [
        { id: 1, name: 'Sharma Ji', specialization: 'Vedas' },
        { id: 2, name: 'Kumar Ji', specialization: 'Rituals' }
      ];

      axios.create = jest.fn(() => ({
        get: jest.fn().mockResolvedValue({ data: mockPriests }),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() }
        }
      }));

      const result = await priestsAPI.getAll();
      expect(result.data.length).toBe(2);
    });
  });

  describe('Services API', () => {
    it('should fetch all services', async () => {
      const mockServices = [
        { id: 1, serviceName: 'Pooja', price: 500 },
        { id: 2, serviceName: 'Darshan', price: 0 }
      ];

      axios.create = jest.fn(() => ({
        get: jest.fn().mockResolvedValue({ data: mockServices }),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() }
        }
      }));

      const result = await servicesAPI.getAll();
      expect(result.data).toEqual(mockServices);
    });
  });

  describe('Temple Timings API', () => {
    it('should fetch temple timings', async () => {
      const mockTimings = [
        { id: 1, day: 'Monday', openTime: '06:00', closeTime: '21:00' },
        { id: 2, day: 'Tuesday', openTime: '06:00', closeTime: '21:00' }
      ];

      axios.create = jest.fn(() => ({
        get: jest.fn().mockResolvedValue({ data: mockTimings }),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() }
        }
      }));

      const result = await templeTimingsAPI.getAll();
      expect(result.data).toEqual(mockTimings);
    });
  });
});
