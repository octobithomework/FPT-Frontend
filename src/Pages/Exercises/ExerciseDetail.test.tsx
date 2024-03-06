import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ExerciseDetailPage from './ExerciseDetail';

// Mocking fetch function to simulate an error response
jest.mock('../../Utils/APIHelpers', () => ({
  get: jest.fn((url) => {
    // Simulate an unsuccessful API call for a specific exerciseId
    if (url.includes('badExerciseId')) {
      return Promise.reject(new Error('Failed to fetch exercise details'));
    }
    // For other exerciseIds, return a successful response
    return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
  }),
}));



// need to look into how i render exercise detail with a bad id to simulate the api failure that produces the error message in first place
test('displays error message when failed to fetch exercise details', async () => {
  const { findByText } = render(
    <BrowserRouter>
      <ExerciseDetailPage />
    </BrowserRouter>
  );

  // Wait for the error message to appear
  await waitFor(async () => {
    const errorMessage = await findByText('Error fetching exercise details: Failed to fetch exercise details');
    expect(errorMessage).toBeInTheDocument();
  });
});

//straightforward test
test('renders ExerciseDetailPage without crashing', () => {
    render(
      <BrowserRouter>
        <ExerciseDetailPage />
      </BrowserRouter>
    );
  });

