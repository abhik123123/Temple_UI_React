import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthContext';
import * as api from '../services/api';

jest.mock('../services/api');

// Mock component to test the useAuth hook
function TestComponent() {
  const { isAuthenticated, user, login, logout } = useAuth();
  return (
    <div>
      <div data-testid="auth-status">
        {isAuthenticated ? 'Logged In' : 'Logged Out'}
      </div>
      <div data-testid="user-name">{user?.name || 'No User'}</div>
      <button onClick={() => login('test@temple.com', 'test123')}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('should provide initial auth state as not authenticated', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged Out');
    expect(screen.getByTestId('user-name')).toHaveTextContent('No User');
  });

  it('should handle successful login', async () => {
    const mockLoginResponse = {
      data: {
        token: 'mock-jwt-token',
        user: { id: 1, name: 'Admin User', email: 'test@temple.com' }
      }
    };

    api.authAPI.login.mockResolvedValue(mockLoginResponse);

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged In');
    });

    expect(localStorage.getItem('authToken')).toBe('mock-jwt-token');
  });

  it('should handle logout', async () => {
    localStorage.setItem('authToken', 'test-token');

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('Logout'));

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged Out');
    });

    expect(localStorage.getItem('authToken')).toBeNull();
  });

  it('should handle login failure', async () => {
    api.authAPI.login.mockRejectedValue(new Error('Invalid credentials'));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    fireEvent.click(screen.getByText('Login'));

    await waitFor(() => {
      expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged Out');
    });
  });

  it('should restore authentication from localStorage on mount', () => {
    localStorage.setItem('authToken', 'persisted-token');
    localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Persisted User' }));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('auth-status')).toHaveTextContent('Logged In');
  });
});
