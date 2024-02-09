import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import LoginPage from "../../src/Pages/Login/Login"

describe('Login Page', () => {
    it('should display error messages for empty fields', async () => {
      const { getByText } = render(
        <Router>
          <Login />
        </Router>
      );

      const loginButton = getByText('Login');
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(getByText('Email is required.')).toBeInTheDocument();
      expect(getByText('Password is required.')).toBeInTheDocument();
    });
  });