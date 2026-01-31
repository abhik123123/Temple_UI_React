import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { LanguageProvider } from '../context/LanguageContext';
import Services from './Services';

jest.mock('../hooks/useAPI', () => ({
  useServices: () => ({
    services: [
      {
        id: 1,
        serviceName: 'Annadana (Food Offering)',
        description: 'Offer food to Lord',
        price: 500,
        category: 'Puja'
      },
      {
        id: 2,
        serviceName: 'Abhisheka (Ritual Bathing)',
        description: 'Sacred bathing ceremony',
        price: 1000,
        category: 'Ritual'
      }
    ],
    loading: false,
    error: null
  })
}));

describe('Services Page', () => {
  const renderServices = () => {
    return render(
      <BrowserRouter>
        <LanguageProvider>
          <AuthProvider>
            <Services />
          </AuthProvider>
        </LanguageProvider>
      </BrowserRouter>
    );
  };

  it('should render Services page without crashing', () => {
    renderServices();
    expect(screen.getByText(/Services/i)).toBeInTheDocument();
  });

  it('should display available services', () => {
    renderServices();
    expect(screen.getByText(/Annadana|Abhisheka/i)).toBeInTheDocument();
  });

  it('should display service prices', () => {
    renderServices();
    expect(screen.getByText(/500|1000/)).toBeInTheDocument();
  });
});
