import { renderHook, act, waitFor } from '@testing-library/react';
import { useTempleTimings, useUpcomingEvents, useAllEvents, useAllPriests, useAllDonors, useServices } from './useAPI';
import * as api from '../services/api';

jest.mock('../services/api');

describe('useAPI Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useTempleTimings', () => {
    it('should fetch temple timings on mount', async () => {
      const mockTimings = [
        { id: 1, day: 'Monday', openTime: '06:00', closeTime: '21:00' },
        { id: 2, day: 'Tuesday', openTime: '06:00', closeTime: '21:00' }
      ];

      api.templeTimingsAPI.getAll.mockResolvedValue({ data: mockTimings });

      const { result } = renderHook(() => useTempleTimings());

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.timings).toEqual(mockTimings);
      expect(result.current.error).toBeNull();
    });

    it('should handle error when fetching timings', async () => {
      const mockError = new Error('Failed to fetch');
      api.templeTimingsAPI.getAll.mockRejectedValue(mockError);

      const { result } = renderHook(() => useTempleTimings());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBeTruthy();
    });
  });

  describe('useUpcomingEvents', () => {
    it('should fetch upcoming events', async () => {
      const mockEvents = [
        { id: 1, eventName: 'Diwali', eventDate: '2025-11-01' },
        { id: 2, eventName: 'Holi', eventDate: '2025-03-14' }
      ];

      api.eventsAPI.getUpcoming.mockResolvedValue({ data: mockEvents });

      const { result } = renderHook(() => useUpcomingEvents());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.events).toEqual(mockEvents);
      expect(result.current.refetch).toBeDefined();
    });

    it('should refetch events when refetch is called', async () => {
      const mockEvents = [{ id: 1, eventName: 'Diwali' }];
      api.eventsAPI.getUpcoming.mockResolvedValue({ data: mockEvents });

      const { result } = renderHook(() => useUpcomingEvents());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await act(async () => {
        await result.current.refetch();
      });

      expect(api.eventsAPI.getUpcoming).toHaveBeenCalledTimes(2);
    });
  });

  describe('useAllEvents', () => {
    it('should fetch all events', async () => {
      const mockEvents = [
        { id: 1, eventName: 'Event 1' },
        { id: 2, eventName: 'Event 2' }
      ];

      api.eventsAPI.getAll.mockResolvedValue({ data: mockEvents });

      const { result } = renderHook(() => useAllEvents());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.events).toEqual(mockEvents);
    });
  });

  describe('useAllPriests', () => {
    it('should fetch all priests', async () => {
      const mockPriests = [
        { id: 1, name: 'Sharma Ji' },
        { id: 2, name: 'Kumar Ji' }
      ];

      api.priestsAPI.getAll.mockResolvedValue({ data: mockPriests });

      const { result } = renderHook(() => useAllPriests());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.priests).toEqual(mockPriests);
    });
  });

  describe('useAllDonors', () => {
    it('should fetch all donors', async () => {
      const mockDonors = [
        { id: 1, fullName: 'John Doe', amount: 5000 },
        { id: 2, fullName: 'Jane Smith', amount: 10000 }
      ];

      api.donorsAPI.getAll.mockResolvedValue({ data: mockDonors });

      const { result } = renderHook(() => useAllDonors());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.donors).toEqual(mockDonors);
    });
  });

  describe('useServices', () => {
    it('should fetch services', async () => {
      const mockServices = [
        { id: 1, serviceName: 'Pooja', price: 500 },
        { id: 2, serviceName: 'Darshan', price: 0 }
      ];

      api.servicesAPI.getAll.mockResolvedValue({ data: mockServices });

      const { result } = renderHook(() => useServices());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.services).toEqual(mockServices);
    });
  });
});
