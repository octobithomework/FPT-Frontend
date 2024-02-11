import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, Route, Routes, useParams, Router } from 'react-router-dom';
import ResetPasswordPage from './Login';
import { JSX } from 'react/jsx-runtime';
import jwtDecode from 'jwt-decode';
import SignupPage from '../Signup/Signup';
import { createMemoryHistory } from 'history';

import fetchMock from 'jest-fetch-mock';
import LoginPage from './Login';
fetchMock.enableMocks();

const renderWithRouter = (ui: JSX.Element, { route = '/login' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(ui, { wrapper: BrowserRouter });
};

describe('Login Page', () => {
    beforeEach(() => {
        fetchMock.resetMocks();
    });

    it('renders correctly', () => {
        renderWithRouter(<LoginPage />);
        expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
    })

    it('shows error for empty email and empty password submission', async () => {
        renderWithRouter(<LoginPage />);
        userEvent.click(screen.getByRole('button', { name: /Login/i }));
        expect(await screen.findByText('Email is required.')).toBeInTheDocument();
        expect(await screen.findByText('Password is required.')).toBeInTheDocument();
    });

    it('shows a login error when both the credentials are wrong', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({}), { status: 404 });
        renderWithRouter(<LoginPage />);
        userEvent.type(screen.getByLabelText(/Email/i), 'exple@comp.com');
        userEvent.type(screen.getByLabelText(/Password/i), 'wrongpassword');
        userEvent.click(screen.getByRole('button', { name: /Login/i }));
        expect(await screen.findByText('Login failed.')).toBeInTheDocument();

    });

    it('shows a login error when the password is wrong, but the email is in database', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({}), { status: 401 });
        renderWithRouter(<LoginPage />);
        userEvent.type(screen.getByLabelText(/Email/i), 'nottheemai@inthe.database');
        userEvent.type(screen.getByLabelText(/Password/i), 'wrongpassword');
        userEvent.click(screen.getByRole('button', { name: /Login/i }));
        expect(await screen.findByText('Login failed.')).toBeInTheDocument();

    });

    it('shows an error when the password feild is empty, but the email feild is filled', async () => {
        renderWithRouter(<LoginPage />);
        userEvent.type(screen.getByLabelText(/Email/i), 'nottheemai@inthe.database');
        userEvent.type(screen.getByLabelText(/Password/i), '');
        userEvent.click(screen.getByRole('button', { name: /Login/i }));
        expect(await screen.findByText('Password is required.')).toBeInTheDocument();

    });

    it('shows an error when the email feild is empty, but the password feild is filled', async () => {
        renderWithRouter(<LoginPage />);
        userEvent.type(screen.getByLabelText(/Email/i), '');
        userEvent.type(screen.getByLabelText(/Password/i), 'randomwrong-password');
        userEvent.click(screen.getByRole('button', { name: /Login/i }));
        expect(await screen.findByText('Email is required.')).toBeInTheDocument();
    });

    //   it('Pulls up the sign-up page correctly when click on that link', async () =>  {
    //     renderWithRouter(<LoginPage />);
    //     fireEvent.click(screen.getByText('Signup'));
    //     expect(screen.getByLabelText(/FirstName/i)).toBeInTheDocument();
    //     expect(screen.getByLabelText(/LastName/i)).toBeInTheDocument();
    //     expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    //     expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    //     expect(screen.getByRole('button', {name: /Sign/i})).toBeInTheDocument();
    //   });

    it('displays an error message on API failure', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({}), { status: 500 });
        renderWithRouter(<LoginPage />);
        userEvent.type(screen.getByLabelText(/email/i), 'example@comp.com');
        userEvent.type(screen.getByLabelText(/password/i), 'password');
        userEvent.click(screen.getByRole('button', { name: /Login/i }));
    
        await waitFor(() => {
          expect(screen.getByText('Login failed.')).toBeInTheDocument();
        });
      });

});