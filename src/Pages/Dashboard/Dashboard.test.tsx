import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DashboardPage from './Dashboart';
import { BrowserRouter } from 'react-router-dom';

import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

const renderWithRouter = (ui: JSX.Element, { route = '/login' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(ui, { wrapper: BrowserRouter });
};

describe('DashboardPage', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  const mockRoutines = [
    {
        routineLogId: '1',
        routineId: '1',
        name: 'talk-2',
        description: 'talked for 20 mins',
        date: '2024-03-3',
       // completionStatus: 0
      },
      {
        routineLogId: '2',
        routineId: '2',
        name: 'talk-3',
        description: 'talked for 20 mins',
        date: '2024-03-3',
        //completionStatus: 0
      },
];

  it('renders correctly', async () => {
    renderWithRouter(<DashboardPage />);
    //checks if both the previous button and next month buttons are showing up or not
    expect(screen.getByRole('button', { name: /previous month/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next month/i })).toBeInTheDocument();

  });

  it('tests the banners for routines same day 2 tests', async () => {

    fetchMock.mockResponseOnce(JSON.stringify(mockRoutines), { status: 200 });
    renderWithRouter(<DashboardPage />);
    userEvent.click(screen.getByRole('button', { name: /today/i }));

    await waitFor(() => {
      expect(screen.getByText(/talk-2/)).toBeInTheDocument();
      expect(screen.getByText(/talk-3/)).toBeInTheDocument();
    });

  });

  it('tests the banners for 3 routines for single day', async () => {

    fetchMock.mockResponseOnce(JSON.stringify(mockRoutines), { status: 200 });
    renderWithRouter(<DashboardPage />);

    userEvent.click(screen.getByRole('button', { name: /previous month/i }));
    userEvent.click(screen.getByRole('button', { name: /today/i }));
    await waitFor(() => {
      expect(screen.getByText(/talk-2/)).toBeInTheDocument();
      expect(screen.getByText(/talk-3/)).toBeInTheDocument();
     // expect(screen.queryByText(/talk-2/)).not.toBeInTheDocument();
    });

  });

});