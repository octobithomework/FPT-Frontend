import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom';
import Signup from './Signup';
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

const renderWithRouter = (ui: JSX.Element, { route = '/signup' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(ui, { wrapper: BrowserRouter });
};

describe('SignupPage renders properly', () => { 
    beforeEach(() => {
      fetchMock.resetMocks();
      (useParams as jest.Mock).mockClear();
  
      (useParams as jest.Mock).mockReturnValue({ token: 'some-token' });
      // Mock jwtDecode to return a valid payload
      jest.spyOn(jwtDecode, 'jwtDecode').mockReturnValue({ sub: 'user@example.com' });
    });
  
    //test 1 * Rendering page in general
    it('renders correctly', () => {
      renderWithRouter(<Signup />);
      expect(screen.getByLabelText('First Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Last Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument();
    });


    //test 2 * invalid input fields
    it('should display error message for invalid password', async () => {
        renderWithRouter(<Signup />);
        // Simulate invalid input
        fireEvent.change(screen.getByLabelText('First Name'), { target: { value: '' } });
        fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'invalid-email' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'Weak' } });
    
        fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
    
        // Ensure error message is displayed
        expect(await screen.findByText('Password must be at least 6 characters.')).toBeInTheDocument();
      });

      it('should display error message for invalid email', async () => {
        renderWithRouter(<Signup />);
        // Simulate invalid input
        fireEvent.change(screen.getByLabelText('First Name'), { target: { value: '' } });
        fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'invalid-email' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'Weak1233!' } });
    
        fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
    
        // Ensure error message is displayed
        expect(await screen.findByText('Email is invalid.')).toBeInTheDocument();
      });

      it('should display error message for invalid first name', async () => {
        renderWithRouter(<Signup />);
        // Simulate invalid input
        fireEvent.change(screen.getByLabelText('First Name'), { target: { value: '' } });
        fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'invalid-email@gmail.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'Weak1233!' } });
    
        fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
    
        // Ensure error message is displayed
        expect(await screen.findByText('First name is required.')).toBeInTheDocument();
      });

      it('should display error message for invalid last name', async () => {
        renderWithRouter(<Signup />);
        // Simulate invalid input
        fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'Test' } });
        fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: '' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'invalid-email@gmail.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'Weak1233!' } });
    
        fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
    
        // Ensure error message is displayed
        expect(await screen.findByText('Last name is required.')).toBeInTheDocument();
      });
      
      //test 3 * Redirection to dashboard 
      it('should redirect to /dashboard upon successful submission', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({}), { status: 200 });
        renderWithRouter(<Signup />);
    
        // Simulate valid input
        fireEvent.change(screen.getByLabelText('First Name'), { target: { value: 'John' } });
        fireEvent.change(screen.getByLabelText('Last Name'), { target: { value: 'Doe' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'StrongPassword123!' } });
        userEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

        //verify it was posted sucesfully
        await waitFor(() => {
          expect(fetchMock).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({ 
              firstName: 'John', 
              lastName: 'Doe', 
              email: 'john@example.com', 
              password: 'StrongPassword123!' 
            }),          
          }));
        });
        // check for redirection to dashboard upon success
        await waitFor(() => {
          expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
        });
    });

      //test 4 * redirection to login page on click of link 
      it('should redirect to login when clicking "Have an account? Login"', async () => {
        renderWithRouter(<Signup />);
        userEvent.click(screen.getByRole('link', { name: /Have an account\? Login/i }));
        expect(window.location.pathname).toBe('/login'); // Note here - change to use mockNavigate, does confirm functionality for now is correct
    });


});

