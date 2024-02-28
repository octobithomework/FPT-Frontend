import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DashboardPage from './Dashboart';
import { BrowserRouter } from 'react-router-dom';

import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();


describe('DashboardPage', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('renders correctly', async () => {
    render(<DashboardPage />, { wrapper: BrowserRouter });
    //checks if both the previous button and next month buttons are showing up or not
    expect(screen.getByRole('button', { name: /previous month/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next month/i })).toBeInTheDocument();

  });

  it('tests the interacts with calendar and buttons on dashboard', async () => {
    render(<DashboardPage />, { wrapper: BrowserRouter });

    // Simulate user interaction with calendar -- going back to previos month to january 2024 and clicking on today to wait for feb 2024
    userEvent.click(screen.getByRole('button', { name: /previous month/i }));
    await waitFor(() => expect(screen.getByText(/January 2024/i)).toBeInTheDocument());
    userEvent.click(screen.getByRole('button', { name: /today/i }));
    await waitFor(() => expect(screen.getByText(/February 2024/i)).toBeInTheDocument());
    userEvent.click(screen.getByRole('button', { name: /next month/i }));
    await waitFor(() => expect(screen.getByText(/March 2024/i)).toBeInTheDocument());
  });

  it('tests the banners for routines same day 2 tests', async () => {

    const apiResponse = [
      {
        routineLogId: 1,
        routineId: 1,
        name: 'walk',
        description: 'walked 10 mins',
        date: '2024-02-21',
        completionStatus: 0
      },
      {
        routineLogId: 2,
        routineId: 2,
        name: 'talk',
        description: 'talked for 10 mins',
        date: '2024-02-21',
        completionStatus: 0
      }
    ];
    fetchMock.mockResponseOnce(JSON.stringify(apiResponse), { status: 200 });
    render(<DashboardPage />);
    userEvent.click(screen.getByRole('button', { name: /today/i }));

    await waitFor(() => {
      expect(screen.getByText(/walk/)).toBeInTheDocument();
      expect(screen.getByText(/talk/)).toBeInTheDocument();
    });

  });

  it('tests the banners for 3 routines for single day', async () => {

    const apiResponse = [
      {
        routineLogId: 1,
        routineId: 1,
        name: 'walk',
        description: 'walked 10 mins',
        date: '2024-02-21',
        completionStatus: 0
      },
      {
        routineLogId: 2,
        routineId: 2,
        name: 'talk',
        description: 'talked for 10 mins',
        date: '2024-02-21',
        completionStatus: 0
      },
      {
        routineLogId: 3,
        routineId: 3,
        name: 'talk-2',
        description: 'talked for 20 mins',
        date: '2024-02-21',
        completionStatus: 0
      }
    ];
    fetchMock.mockResponseOnce(JSON.stringify(apiResponse), { status: 200 });
    render(<DashboardPage />);

    userEvent.click(screen.getByRole('button', { name: /previous month/i }));
    userEvent.click(screen.getByRole('button', { name: /today/i }));
    await waitFor(() => {
      expect(screen.getByText(/walk/)).toBeInTheDocument();
      expect(screen.getByText(/talk/)).toBeInTheDocument();
      expect(screen.queryByText(/talk-2/)).not.toBeInTheDocument();
    });

  });

});