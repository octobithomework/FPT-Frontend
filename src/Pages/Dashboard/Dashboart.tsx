// DashboardPage.js
import React, { useEffect, useState } from 'react';
import { ChakraProvider, Flex } from "@chakra-ui/react";
import Calendar from "./Components/Calendar/Calendar"; // Ensure the correct path
import './Dashboard.css';
import { getAuth } from '../../Utils/APIHelpers'; // Ensure the correct path
import { Routine } from '../../Interfaces/Routine';
import RoutineLog from './Components/RoutineLog/RoutineLog';

const DashboardPage: React.FC = () => {
    const [completedRoutines, setCompletedRoutines] = useState<Routine[]>([]);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [selectedDate, setSelectedDate] = useState<string | null >(null);
    const [selectedId, setSelectedId] = useState<string | null >(null);

    useEffect(() => {
        const fetchCompletedRoutines = async () => {
            try {
                const response = await getAuth(`/completed-routines?month=${currentMonth}&year=${currentYear}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch completed routines.');
                }
                const newData = await response.json();
                
                setCompletedRoutines((prevRoutines: Routine[]) => {
                    const updatedRoutines: Routine[] = [...prevRoutines];
                    newData.forEach((newRoutine: Routine) => {
                        if (!prevRoutines.some((routine: Routine) => routine.routineLogId === newRoutine.routineLogId)) {
                            updatedRoutines.push(newRoutine);
                        }
                    });
                    return updatedRoutines;
                });
            } catch (err) {
                console.error('Error fetching completed routines:', err);
            }
        };

        fetchCompletedRoutines();
    }, [currentMonth, currentYear]);

    return (
        <Flex>
            <ChakraProvider>
                <Calendar
                    completedRoutines={completedRoutines}
                    setCurrentMonthYear={(month, year) => { setCurrentMonth(month); setCurrentYear(year); }}
                    onDateOrEventClick={(date, id) => (setSelectedDate(date), setSelectedId(id))}
                />
                <RoutineLog 
                    completedRoutines={completedRoutines} 
                    currentMonth={currentMonth}
                    currentYear={currentYear}
                    selectedDate={selectedDate}
                    selectedId={selectedId}
                    clearFilters={() => (setSelectedDate(""), setSelectedId(""))}
                />
            </ChakraProvider>
        </Flex>
    );
};

export default DashboardPage;
