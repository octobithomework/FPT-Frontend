import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import RoutineLog from './RoutineLog';

describe('RoutineLog component', () => {
    const mockRoutines = [
        {
            routineLogId: '1',
            routineId: 1,
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
        const { getByText } = render(
            <RoutineLog completedRoutines={[]} currentMonth={3} currentYear={2024} selectedDate="2024-03-01" selectedId={null} clearFilters={() => {}} />
        );
        expect(getByText('No routines completed on this day.')).toBeInTheDocument();
    });

    test('renders no routines message for selected month', () => {
        const { getByText } = render(
            <RoutineLog completedRoutines={[]} currentMonth={3} currentYear={2024} selectedDate={null} selectedId={null} clearFilters={() => {}} />
        );
        expect(getByText('No routines completed in this month.')).toBeInTheDocument();
    });

    test('renders filtered routines correctly based on selected date', () => {
        const { getByText } = render(
            <RoutineLog completedRoutines={mockRoutines} currentMonth={2} currentYear={2024} selectedDate="2024-02-21" selectedId={null} clearFilters={() => {}} />
        );
        expect(getByText('talk-3')).toBeInTheDocument();
        expect(getByText('Routine 1 description')).toBeInTheDocument();
        expect(getByText('Routine 2')).not.toBeInTheDocument(); // Ensure routine 2 is not rendered
    });

    test('renders filtered routines correctly based on current month and year', () => {
        const { getByText } = render(
            <RoutineLog completedRoutines={mockRoutines} currentMonth={3} currentYear={2024} selectedDate={null} selectedId={null} clearFilters={() => {}} />
        );
        expect(getByText('Routine 1')).toBeInTheDocument();
        expect(getByText('Routine 2')).toBeInTheDocument();
    });

    test('clear filters button is disabled when no filters are applied', () => {
        const { getByText } = render(
            <RoutineLog completedRoutines={mockRoutines} currentMonth={3} currentYear={2024} selectedDate={null} selectedId={null} clearFilters={() => {}} />
        );
        const clearFiltersButton = getByText('Clear Filters');
        expect(clearFiltersButton).toBeDisabled();
    });

    test('clear filters button is enabled when filters are applied', () => {
        const { getByText } = render(
            <RoutineLog completedRoutines={mockRoutines} currentMonth={3} currentYear={2024} selectedDate="2024-03-01" selectedId={null} clearFilters={() => {}} />
        );
        const clearFiltersButton = getByText('Clear Filters');
        expect(clearFiltersButton).not.toBeDisabled();
    });

    test('clear filters button triggers clearFilters function', () => {
        const clearFiltersMock = jest.fn();
        const { getByText } = render(
            <RoutineLog completedRoutines={mockRoutines} currentMonth={3} currentYear={2024} selectedDate="2024-03-01" selectedId={null} clearFilters={clearFiltersMock} />
        );
        const clearFiltersButton = getByText('Clear Filters');
        fireEvent.click(clearFiltersButton);
        expect(clearFiltersMock).toHaveBeenCalledTimes(1);
    });
});
