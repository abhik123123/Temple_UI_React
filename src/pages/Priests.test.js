import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { LanguageProvider } from '../context/LanguageContext';
import Priests from './Priests';

jest.mock('../hooks/useAPI', () => ({
  useAllPriests: () => ({
    priests: [
      {
        id: 1,
        name: 'Sharma Ji',
        specialization: 'Vedic Rituals',
        experience: 20,
        description: 'Expert in Vedic ceremonies'
      },
      {
        id: 2,
        name: 'Kumar Ji',
        specialization: 'Sacred Music',
        experience: 15,
        description: 'Master of temple music'
      }
    ],
    loading: false,
    error: null
  })
}));

describe('Priests Page', () => {
  const renderPriests = () => {
    return render(
      <BrowserRouter>
        <LanguageProvider>
          <AuthProvider>
            <Priests />
          </AuthProvider>
        </LanguageProvider>
      </BrowserRouter>
    );
  };

  it('should render Priests page without crashing', () => {
    renderPriests();
    expect(screen.getByText(/Priests|Religious Leaders/i)).toBeInTheDocument();
  });

  it('should display list of priests', () => {
    renderPriests();
    expect(screen.getByText(/Sharma|Kumar/i)).toBeInTheDocument();
  });

  it('should display priest details correctly', () => {
    renderPriests();
    expect(screen.getByText(/Vedic|Sacred/i)).toBeInTheDocument();
  });
});
