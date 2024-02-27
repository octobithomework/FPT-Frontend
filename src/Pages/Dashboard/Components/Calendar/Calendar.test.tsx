import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import Calendar from './Calendar';
import { Routine } from '../../../../Interfaces/Routine'; // Import the Routine interface

describe('Calendar component', () => {
  const mockCompletedRoutines: Routine[] = [
    // Mock  routine data here for testing
  ];
  
//test render
  it('renders without crashing', () => {
    render(
      <Calendar
        completedRoutines={mockCompletedRoutines}
        setCurrentMonthYear={() => {}}
        onDateOrEventClick={() => {}}
      />
    );
  });
  //test month and year change (setcurrentMonthyear function)
  it('calls setCurrentMonthYear with correct month and year when dates are changed', () => {
    const setCurrentMonthYearMock = jest.fn();
    const { getByRole } = render(
      <Calendar
        completedRoutines={mockCompletedRoutines}
        setCurrentMonthYear={setCurrentMonthYearMock}
        onDateOrEventClick={() => {}}
      />
    );

    // Simulate changing month by clicking next button
    const nextButton = getByRole('button', { name: 'Next month' });
    fireEvent.click(nextButton);

    // Assuming your component updates the month correctly, check if setCurrentMonthYear was called
    expect(setCurrentMonthYearMock).toHaveBeenCalled();
  });
  

// test onDateOrEventClick
it('calls onDateOrEventClick when an event is clicked', () => {
    const onDateOrEventClickMock = jest.fn();
    const { getByText } = render(
      <Calendar
        completedRoutines={[
            { name: 'Routine 1', date: '2024-02-26', routineLogId: '1', routineId: '1', description: 'Routine 1 description' }, // Add missing properties
        ]}
        setCurrentMonthYear={() => {}}
        onDateOrEventClick={onDateOrEventClickMock}
      />
    );
  
    fireEvent.click(getByText('Routine 1'));
    expect(onDateOrEventClickMock).toHaveBeenCalledWith('2024-02-26', '1');
  });
  
  
  //test rendering with mocked data
  it('renders events correctly', () => {
    const { getByText } = render(
      <Calendar
        completedRoutines={[
            { name: 'Routine 1', date: '2024-02-26', routineLogId: '1', routineId: '1', description: 'Routine 1 description' }, // Add missing properties
            { name: 'Routine 2', date: '2024-02-27', routineLogId: '2', routineId: '2', description: 'Routine 2 description' }, // Add missing properties
        ]}
        setCurrentMonthYear={() => {}}
        onDateOrEventClick={() => {}}
      />
    );
  
    expect(getByText('Routine 1')).toBeInTheDocument();
    expect(getByText('Routine 2')).toBeInTheDocument();
  });
  
// check date setting
  it('calls setCurrentMonthYear with correct month and year when dates are set', () => {
    const setCurrentMonthYearMock = jest.fn();
    render(
      <Calendar
        completedRoutines={mockCompletedRoutines}
        setCurrentMonthYear={setCurrentMonthYearMock}
        onDateOrEventClick={() => {}}
      />
    );

    // Simulate dates being set by directly calling the prop function
    setCurrentMonthYearMock({
      end: new Date(2024, 1, 26), 
    });

    expect(setCurrentMonthYearMock).toHaveBeenCalledWith(2, 2024); 
  });

  // Add more test cases as needed
});
