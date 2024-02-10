import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom';
import ResetPasswordPage from './ResetPassword';
import { JSX } from 'react/jsx-runtime';
import jwtDecode from 'jwt-decode';

import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // This preserves the original implementations of other hooks and components
  useParams: jest.fn(), // Mock useParams as a jest function
  useNavigate: () => mockNavigate, // Your existing mockNavigate setup
}));

jest.mock('jwt-decode', () => ({
  // Provide a mock implementation for jwtDecode named export
  jwtDecode: jest.fn().mockImplementation(() => ({
    sub: 'user@example.com' // Mocked payload
  })),
}));

const renderWithRouter = (ui: JSX.Element, { route = '/forgot-password/some-token' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(ui, { wrapper: BrowserRouter });
};

describe('ResetPasswordPage', () => { 
  beforeEach(() => {
    fetchMock.resetMocks();
    (useParams as jest.Mock).mockClear();

    (useParams as jest.Mock).mockReturnValue({ token: 'some-token' });
    // Mock jwtDecode to return a valid payload
    jest.spyOn(jwtDecode, 'jwtDecode').mockReturnValue({ sub: 'user@example.com' });
  });

  it('renders correctly', () => {
    renderWithRouter(<ResetPasswordPage />);
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('New Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset password/i })).toBeInTheDocument();
  });

  it('navigates to login on invalid token', async () => {
    // Mock useParams to return an invalid token for this test
    (useParams as jest.Mock).mockReturnValue({ token: 'invalid-token' });
  
    // Clear previous spyOn implementation for jwtDecode
    jest.spyOn(jwtDecode, 'jwtDecode').mockClear();
  
    // Now, set up a new spyOn that simulates a failure or an invalid decoding result
    jest.spyOn(jwtDecode, 'jwtDecode').mockImplementationOnce(() => {
      throw new Error('Invalid token'); // Or return an invalid payload, depending on your logic
    });
  
    renderWithRouter(<ResetPasswordPage />);
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/login'));
  });  

  it('stays on the same page on valid token', async () => {
    renderWithRouter(<ResetPasswordPage />);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('shows password validation errors', async () => {
    renderWithRouter(<ResetPasswordPage />);
    userEvent.type(screen.getByLabelText('New Password'), 'short');
    userEvent.type(screen.getByLabelText('Confirm Password'), 'short');
    userEvent.click(screen.getByRole('button', { name: /reset password/i }));

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 6 characters.')).toBeInTheDocument();
    });
  });

  it('shows mismatch password error', async () => {
    renderWithRouter(<ResetPasswordPage />);
    userEvent.type(screen.getByLabelText('New Password'), 'ValidPass1!');
    userEvent.type(screen.getByLabelText('Confirm Password'), 'Mismatch1!');
    userEvent.click(screen.getByRole('button', { name: /reset password/i }));

    await waitFor(() => {
      expect(screen.getByText('Passwords do not match.')).toBeInTheDocument();
    });
  });

  it('sends a request for valid data and navigates on success', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}), { status: 200 });
    renderWithRouter(<ResetPasswordPage />);
    userEvent.type(screen.getByLabelText('New Password'), 'ValidPass1!');
    userEvent.type(screen.getByLabelText('Confirm Password'), 'ValidPass1!');
    userEvent.click(screen.getByRole('button', { name: /reset password/i }));

    // Wait for fetch to be called with the expected arguments
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ newPassword: 'ValidPass1!' }),
      }));
    });

    // Then, wait for the navigation to occur as a result of the fetch request's success
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('displays an error message on API failure', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({}), { status: 500 });
    renderWithRouter(<ResetPasswordPage />);
    userEvent.type(screen.getByLabelText('New Password'), 'ValidPass1!');
    userEvent.type(screen.getByLabelText('Confirm Password'), 'ValidPass1!');
    userEvent.click(screen.getByRole('button', { name: /reset password/i }));

    await waitFor(() => {
      expect(screen.getByText('An error occurred while resetting the password.')).toBeInTheDocument();
    });
  });
});
