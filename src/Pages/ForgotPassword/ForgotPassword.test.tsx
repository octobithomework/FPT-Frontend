import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import ForgotPasswordPage from './ForgotPassword';

// Ensure fetchMock is correctly imported
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

const renderWithRouter = (ui: JSX.Element, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(ui, { wrapper: BrowserRouter });
};

describe('ForgotPasswordPage', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('renders correctly', () => {
    renderWithRouter(<ForgotPasswordPage />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send reset email/i })).toBeInTheDocument();
    expect(screen.getByText(/return to login/i)).toBeInTheDocument();
  });

  it('shows error for empty email submission', async () => {
    renderWithRouter(<ForgotPasswordPage />);
    userEvent.click(screen.getByRole('button', { name: /send reset email/i }));
    expect(await screen.findByText('Email is required.')).toBeInTheDocument();
  });

  it('sends a request for valid email and shows success message', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}), { status: 200 });
    renderWithRouter(<ForgotPasswordPage />);
    userEvent.type(screen.getByLabelText(/email/i), 'user@example.com');
    userEvent.click(screen.getByRole('button', { name: /send reset email/i }));

    await waitFor(() => {
      expect(screen.getByText(/A password reset email has been sent if the email is registered in our system\./)).toBeInTheDocument();
    });
  });

  it('shows error message on API failure', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}), { status: 500 });
    renderWithRouter(<ForgotPasswordPage />);
    userEvent.type(screen.getByLabelText(/email/i), 'user@example.com');
    userEvent.click(screen.getByRole('button', { name: /send reset email/i }));

    await waitFor(() => {
      expect(screen.getByText('Failed to send password reset email.')).toBeInTheDocument();
    });
  });
});
