import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Components/Navbar/Navbar';

describe('Navbar Component', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
  });

  it('renders logout link when not on login page', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Navbar />
      </MemoryRouter>
    );
    const logoutLink = getByText('Logout');
    expect(logoutLink).toBeInTheDocument();
  });

  it('does not render logout link on login page', () => {
    const { queryByText } = render(
      <MemoryRouter initialEntries={['/login']}>
        <Navbar />
      </MemoryRouter>
    );
    const logoutLink = queryByText('Logout');
    expect(logoutLink).not.toBeInTheDocument();
  });

  it('calls handleLogout when logout link is clicked', () => {
    const { getByText } = render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Navbar />
      </MemoryRouter>
    );
    const logoutLink = getByText('Logout');
    fireEvent.click(logoutLink);
    // Add assertions for handleLogout functionality
  });
});
