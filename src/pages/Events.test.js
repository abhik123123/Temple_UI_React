import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { LanguageProvider } from '../context/LanguageContext';
import Events from './Events';

jest.mock('../hooks/useAPI', () => ({
  useUpcomingEvents: () => ({
    events: [
      {
        id: 1,
        eventName: 'Diwali Festival',
        eventDate: '2025-11-01',
        startTime: '18:00:00',
        endTime: '21:00:00',
        location: 'Main Hall',
        category: 'Festival',
        description: 'Celebration of lights'
      },
      {
        id: 2,
        eventName: 'Holi Celebration',
        eventDate: '2025-03-14',
        startTime: '09:00:00',
        endTime: '12:00:00',
        location: 'Temple Grounds',
        category: 'Festival',
        description: 'Festival of colors'
      }
    ],
    loading: false,
    error: null
  })
}));

describe('Events Page', () => {
  const renderEvents = () => {
    return render(
      <BrowserRouter>
        <LanguageProvider>
          <AuthProvider>
            <Events />
          </AuthProvider>
        </LanguageProvider>
      </BrowserRouter>
    );
  };

  it('should render Events page without crashing', () => {
    renderEvents();
    expect(screen.getByText(/Events/i)).toBeInTheDocument();
  });

  it('should display upcoming events list', () => {
    renderEvents();
    expect(screen.getByText(/Diwali|Holi/i)).toBeInTheDocument();
  });

  it('should display event details correctly', () => {
    renderEvents();
    expect(screen.getByText('Main Hall')).toBeInTheDocument();
    expect(screen.getByText('Temple Grounds')).toBeInTheDocument();
  });

  it('should filter events by category', async () => {
    renderEvents();
    const filterButton = screen.getByRole('button', { name: /Festival/i });
    
    if (filterButton) {
      fireEvent.click(filterButton);
      await waitFor(() => {
        expect(screen.getByText(/Diwali|Holi/i)).toBeInTheDocument();
      });
    }
  });
});
