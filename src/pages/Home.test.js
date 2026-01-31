import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { LanguageProvider } from '../context/LanguageContext';
import Home from './Home';
import * as api from '../services/api';

jest.mock('../services/api');
jest.mock('../hooks/useAPI', () => ({
  useTempleTimings: () => ({
    timings: [
      { id: 1, day: 'Monday', openTime: '06:00', closeTime: '21:00' }
    ],
    loading: false,
    error: null
  }),
  useUpcomingEvents: () => ({
    events: [
      { id: 1, eventName: 'Diwali', eventDate: '2025-11-01' }
    ],
    loading: false,
    error: null
  })
}));

describe('Home Page', () => {
  const renderHome = () => {
    return render(
      <BrowserRouter>
        <LanguageProvider>
          <AuthProvider>
            <Home />
          </AuthProvider>
        </LanguageProvider>
      </BrowserRouter>
    );
  };

  it('should render Home page without crashing', () => {
    renderHome();
    expect(screen.getByText(/Raja Rajeshwara/i)).toBeInTheDocument();
  });

  it('should display hero section with temple image', () => {
    renderHome();
    const hero = screen.getByRole('heading', { level: 1 });
    expect(hero).toBeInTheDocument();
  });

  it('should display navigation menu', () => {
    renderHome();
    expect(screen.getByText(/Home|Events|Services|Priests|Timings/i)).toBeInTheDocument();
  });
});
