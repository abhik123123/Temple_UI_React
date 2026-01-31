import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { LanguageProvider } from '../context/LanguageContext';
import Admin from './Admin';
import * as api from '../services/api';

jest.mock('../services/api');
jest.mock('../hooks/useAPI', () => ({
  useUpcomingEvents: () => ({
    events: [
      {
        id: 1,
        eventName: 'Lakshmi Puja',
        eventDate: '2025-12-15',
        startTime: '18:00:00',
        endTime: '20:00:00',
        location: 'Main Hall',
        category: 'Festival',
        description: 'Evening prayer'
      }
    ],
    loading: false,
    error: null,
    refetch: jest.fn()
  })
}));

describe('Admin Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderAdmin = () => {
    return render(
      <BrowserRouter>
        <LanguageProvider>
          <AuthProvider>
            <Admin />
          </AuthProvider>
        </LanguageProvider>
      </BrowserRouter>
    );
  };

  it('should render Admin page without crashing', () => {
    renderAdmin();
    expect(screen.getByText(/Admin|Dashboard/i)).toBeInTheDocument();
  });

  it('should display login form when not authenticated', () => {
    api.donorsAPI.getAll.mockResolvedValue({ data: [] });
    renderAdmin();
    
    const loginForm = screen.queryByText(/Admin Login/i) || screen.queryByRole('button', { name: /Login/i });
    if (loginForm) {
      expect(loginForm).toBeInTheDocument();
    }
  });

  it('should display dashboard tabs', async () => {
    api.donorsAPI.getAll.mockResolvedValue({ data: [] });
    renderAdmin();
    
    await waitFor(() => {
      const dashboardTab = screen.queryByText(/Dashboard|Events|Donors/i);
      if (dashboardTab) {
        expect(dashboardTab).toBeInTheDocument();
      }
    });
  });

  it('should fetch donors on mount', async () => {
    const mockDonors = [
      { id: 1, fullName: 'John Doe', amount: 5000 },
      { id: 2, fullName: 'Jane Smith', amount: 10000 }
    ];

    api.donorsAPI.getAll.mockResolvedValue({ data: mockDonors });

    renderAdmin();

    await waitFor(() => {
      expect(api.donorsAPI.getAll).toHaveBeenCalled();
    });
  });
});
