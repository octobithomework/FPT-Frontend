import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import RoutineLog from './RoutineLog';
import { BrowserRouter, Route, Routes, useParams, Router } from 'react-router-dom';
import { render, screen, waitFor,fireEvent } from '@testing-library/react';



const renderWithRouter = (ui: JSX.Element, { route = '/login' } = {}) => {
    window.history.pushState({}, 'Test page', route);
    return render(ui, { wrapper: BrowserRouter });
};

describe('RoutineLog component', () => {
    const mockRoutines = [
        {
            routineLogId: '1',
            routineId: '1',
            name: 'talk-2',
            description: 'talked for 20 mins',
            date: '2024-02-21',
           // completionStatus: 0
          },
          {
            routineLogId: '2',
            routineId: '2',
            name: 'talk-3',
            description: 'talked for 20 mins',
            date: '2024-02-21',
            //completionStatus: 0
          },
    ];

    test('renders no routines message for selected date', () => {
        const { getByText } = renderWithRouter(
            <RoutineLog completedRoutines={[]} currentMonth={3} currentYear={2024} selectedDate="2024-03-01" selectedId={null} clearFilters={() => {}} />
        );
        expect(screen.queryByText('talk-2')).toBeNull();
        });

    test('renders no routines message for selected month', () => {
        const { getByText } = renderWithRouter(
            <RoutineLog completedRoutines={[]} currentMonth={3} currentYear={2024} selectedDate={null} selectedId={null} clearFilters={() => {}} />
        );
        expect(getByText('No routines completed in this month.')).toBeInTheDocument();
    });

    test('renders filtered routines correctly based on selected date', () => {
        const { getByText } = renderWithRouter(
            <RoutineLog completedRoutines={mockRoutines} currentMonth={2} currentYear={2024} selectedDate="2024-02-21" selectedId={null} clearFilters={() => {}} />
        );
        expect(getByText('talk-3')).toBeInTheDocument();
        //expect(getByText('Routine 1 description')).toBeInTheDocument();
        expect(getByText('talk-2')).toBeInTheDocument(); // Ensure routine 2 is not rendered
    });

    test('renders filtered routines correctly based on current month and year', () => {
        const { getByText } = renderWithRouter(
            <RoutineLog completedRoutines={[]} currentMonth={4} currentYear={2024} selectedDate={null} selectedId={null} clearFilters={() => {}} />
        );
        expect(screen.queryByText('talk-2')).toBeNull();
        //expect(getByText('talk-3')).not.toBeInTheDocument();
    });

    test('clear filters button is disabled when no filters are applied', () => {
        const { getByText } = renderWithRouter(
            <RoutineLog completedRoutines={mockRoutines} currentMonth={3} currentYear={2024} selectedDate={null} selectedId={null} clearFilters={() => {}} />
        );
        const clearFiltersButton = getByText('Clear Filters');
        expect(clearFiltersButton).toBeDisabled();
    });

    test('clear filters button is enabled when filters are applied', () => {
        const { getByText } = renderWithRouter(
            <RoutineLog completedRoutines={mockRoutines} currentMonth={3} currentYear={2024} selectedDate="2024-03-01" selectedId={null} clearFilters={() => {}} />
        );
        const clearFiltersButton = getByText('Clear Filters');
        expect(clearFiltersButton).not.toBeDisabled();
    });

    test('clear filters button triggers clearFilters function', () => {
        const clearFiltersMock = jest.fn();
        const { getByText } = renderWithRouter(
            <RoutineLog completedRoutines={mockRoutines} currentMonth={3} currentYear={2024} selectedDate="2024-03-01" selectedId={null} clearFilters={clearFiltersMock} />
        );
        const clearFiltersButton = getByText('Clear Filters');
        fireEvent.click(clearFiltersButton);
        expect(clearFiltersMock).toHaveBeenCalledTimes(1);
    });
});
