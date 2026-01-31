import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { LanguageProvider } from '../context/LanguageContext';
import Timings from './Timings';

jest.mock('../hooks/useAPI', () => ({
  useTempleTimings: () => ({
    timings: [
      { id: 1, day: 'Monday', openTime: '06:00', closeTime: '21:00' },
      { id: 2, day: 'Tuesday', openTime: '06:00', closeTime: '21:00' },
      { id: 3, day: 'Wednesday', openTime: '05:30', closeTime: '21:30' },
      { id: 4, day: 'Thursday', openTime: '06:00', closeTime: '21:00' },
      { id: 5, day: 'Friday', openTime: '06:00', closeTime: '21:00' },
      { id: 6, day: 'Saturday', openTime: '05:30', closeTime: '22:00' },
      { id: 7, day: 'Sunday', openTime: '05:00', closeTime: '22:00' }
    ],
    loading: false,
    error: null
  })
}));

describe('Timings Page', () => {
  const renderTimings = () => {
    return render(
      <BrowserRouter>
        <LanguageProvider>
          <AuthProvider>
            <Timings />
          </AuthProvider>
        </LanguageProvider>
      </BrowserRouter>
    );
  };

  it('should render Timings page without crashing', () => {
    renderTimings();
    expect(screen.getByText(/Timings|Hours|Opening/i)).toBeInTheDocument();
  });

  it('should display all days of the week', () => {
    renderTimings();
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    days.forEach(day => {
      expect(screen.getByText(new RegExp(day, 'i'))).toBeInTheDocument();
    });
  });

  it('should display opening and closing times', () => {
    renderTimings();
    expect(screen.getByText(/06:00|21:00|05:30|22:00|05:00/)).toBeInTheDocument();
  });
});
