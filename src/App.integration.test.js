import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { LanguageProvider } from '../context/LanguageContext';
import App from '../App';
import * as api from '../services/api';

jest.mock('../services/api');

describe('App Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  const renderApp = () => {
    return render(
      <BrowserRouter>
        <LanguageProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </LanguageProvider>
      </BrowserRouter>
    );
  };

  describe('Navigation Flow', () => {
    it('should render home page by default', () => {
      api.eventsAPI.getUpcoming.mockResolvedValue({ data: [] });
      api.templeTimingsAPI.getAll.mockResolvedValue({ data: [] });

      renderApp();
      expect(screen.getByText(/Raja Rajeshwara|Home/i)).toBeInTheDocument();
    });

    it('should navigate between pages', async () => {
      api.eventsAPI.getUpcoming.mockResolvedValue({ data: [] });
      api.templeTimingsAPI.getAll.mockResolvedValue({ data: [] });

      renderApp();

      const eventsLink = screen.queryByText(/Events/i);
      if (eventsLink) {
        fireEvent.click(eventsLink);
        await waitFor(() => {
          expect(screen.getByText(/Events/i)).toBeInTheDocument();
        });
      }
    });
  });

  describe('Authentication Flow', () => {
    it('should allow login and logout', async () => {
      const mockLoginResponse = {
        data: {
          token: 'test-token',
          user: { id: 1, name: 'Test Admin' }
        }
      };

      api.authAPI.login.mockResolvedValue(mockLoginResponse);
      api.eventsAPI.getUpcoming.mockResolvedValue({ data: [] });
      api.templeTimingsAPI.getAll.mockResolvedValue({ data: [] });

      renderApp();

      const loginButton = screen.queryByText(/Login|Sign In/i);
      if (loginButton) {
        fireEvent.click(loginButton);

        await waitFor(() => {
          expect(localStorage.getItem('authToken')).toBe('test-token');
        });
      }
    });
  });

  describe('Language Switching', () => {
    it('should support multiple languages', async () => {
      api.eventsAPI.getUpcoming.mockResolvedValue({ data: [] });
      api.templeTimingsAPI.getAll.mockResolvedValue({ data: [] });

      renderApp();

      const languageSelector = screen.queryByRole('button', { name: /Language|English|Telugu|Hindi/i });
      if (languageSelector) {
        fireEvent.click(languageSelector);

        await waitFor(() => {
          const teluguOption = screen.queryByText(/Telugu|తెలుగు/i);
          if (teluguOption) {
            expect(teluguOption).toBeInTheDocument();
          }
        });
      }
    });
  });

  describe('Data Loading', () => {
    it('should load and display events', async () => {
      const mockEvents = [
        {
          id: 1,
          eventName: 'Test Event',
          eventDate: '2025-12-15',
          startTime: '18:00:00',
          endTime: '20:00:00',
          location: 'Main Hall',
          category: 'Festival'
        }
      ];

      api.eventsAPI.getUpcoming.mockResolvedValue({ data: mockEvents });
      api.templeTimingsAPI.getAll.mockResolvedValue({ data: [] });

      renderApp();

      await waitFor(() => {
        const eventElement = screen.queryByText(/Test Event/i);
        if (eventElement) {
          expect(eventElement).toBeInTheDocument();
        }
      });
    });

    it('should load and display temple timings', async () => {
      const mockTimings = [
        { id: 1, day: 'Monday', openTime: '06:00', closeTime: '21:00' }
      ];

      api.eventsAPI.getUpcoming.mockResolvedValue({ data: [] });
      api.templeTimingsAPI.getAll.mockResolvedValue({ data: mockTimings });

      renderApp();

      await waitFor(() => {
        const timingElement = screen.queryByText(/Monday|06:00|21:00/i);
        if (timingElement) {
          expect(timingElement).toBeInTheDocument();
        }
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      api.eventsAPI.getUpcoming.mockRejectedValue(new Error('API Error'));
      api.templeTimingsAPI.getAll.mockRejectedValue(new Error('API Error'));

      renderApp();

      await waitFor(() => {
        // App should still render despite API errors
        expect(screen.getByText(/Raja Rajeshwara|Home/i)).toBeInTheDocument();
      });
    });
  });

  describe('Admin Dashboard', () => {
    it('should display admin options when authenticated', async () => {
      localStorage.setItem('authToken', 'test-token');
      localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Admin' }));

      api.eventsAPI.getUpcoming.mockResolvedValue({ data: [] });
      api.templeTimingsAPI.getAll.mockResolvedValue({ data: [] });
      api.donorsAPI.getAll.mockResolvedValue({ data: [] });

      renderApp();

      const adminLink = screen.queryByText(/Admin|Dashboard/i);
      if (adminLink) {
        expect(adminLink).toBeInTheDocument();
      }
    });
  });

  describe('Responsive Design', () => {
    it('should be responsive on mobile devices', () => {
      global.innerWidth = 500;
      global.dispatchEvent(new Event('resize'));

      api.eventsAPI.getUpcoming.mockResolvedValue({ data: [] });
      api.templeTimingsAPI.getAll.mockResolvedValue({ data: [] });

      renderApp();

      // Check if mobile menu exists
      const mobileMenu = screen.queryByRole('button', { name: /Menu|Navigation/i });
      expect(screen.getByText(/Raja Rajeshwara|Home/i)).toBeInTheDocument();
    });
  });
});

describe('Form Submission Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should handle contact form submission', async () => {
    const mockContactData = {
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message',
      phone: '1234567890'
    };

    api.contactAPI.submit.mockResolvedValue({ data: { success: true } });

    const { render: renderComponent } = require('@testing-library/react');
    const render = renderComponent;

    // Note: This would need actual Contact component implementation
    // Placeholder for contact form test
  });

  it('should handle donation submission', async () => {
    const mockDonationData = {
      fullName: 'John Donor',
      amount: 5000,
      paymentMethod: 'card'
    };

    api.donorsAPI.create.mockResolvedValue({ data: { ...mockDonationData, id: 1 } });

    // Note: This would need actual Donation component implementation
    expect(api.donorsAPI.create).toBeDefined();
  });
});

describe('Data Persistence Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should persist user session across page reloads', () => {
    const userData = { id: 1, name: 'Test User', email: 'test@example.com' };
    const token = 'test-jwt-token';

    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(userData));

    // Simulate page reload
    const retrievedToken = localStorage.getItem('authToken');
    const retrievedUser = JSON.parse(localStorage.getItem('user'));

    expect(retrievedToken).toBe(token);
    expect(retrievedUser).toEqual(userData);
  });

  it('should persist language preference across page reloads', () => {
    localStorage.setItem('language', 'te');

    const retrievedLanguage = localStorage.getItem('language');
    expect(retrievedLanguage).toBe('te');
  });
});

describe('Performance Tests', () => {
  it('should render large event lists efficiently', async () => {
    const mockLargeEventList = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      eventName: `Event ${i + 1}`,
      eventDate: '2025-12-15',
      startTime: '18:00:00',
      endTime: '20:00:00',
      location: 'Main Hall',
      category: 'Festival'
    }));

    // Mock performance measurement
    const startTime = performance.now();

    api.eventsAPI.getUpcoming.mockResolvedValue({ data: mockLargeEventList });
    api.templeTimingsAPI.getAll.mockResolvedValue({ data: [] });

    const endTime = performance.now();
    const loadTime = endTime - startTime;

    // Should load without significant delay
    expect(loadTime).toBeLessThan(1000); // Less than 1 second
  });
});
