// DashboardPage.js
import React, { useEffect, useState } from 'react';
import { ChakraProvider } from "@chakra-ui/react";
import Calendar from "./Components/Calendar/Calendar"; // Ensure the correct path
import './Dashboard.css';
import { getAuth } from '../../Utils/APIHelpers'; // Ensure the correct path
import { Routine } from '../../Interfaces/Routine';

const DashboardPage: React.FC = () => {
    const [completedRoutines, setCompletedRoutines] = useState<Routine[]>([]);
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1); // Default to the current month
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear()); // Default to the current year

    useEffect(() => {
        const fetchCompletedRoutines = async () => {
            try {
                const response = await getAuth(`/completed-routines?month=${currentMonth}&year=${currentYear}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch completed routines.');
                }
                const newData = await response.json();

                // Update state to include new routines without adding duplicates
                setCompletedRoutines((prevRoutines: Routine[]) => {
                    const updatedRoutines: Routine[] = [...prevRoutines];
                    newData.forEach((newRoutine: Routine) => {
                        // Check if the routine is already in the state
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
    }, [currentMonth, currentYear]); // Depend on currentMonth and currentYear

    return (
        <div className="dashboard-container">
            <ChakraProvider>
                <Calendar
                    completedRoutines={completedRoutines}
                    setCurrentMonthYear={(month, year) => { setCurrentMonth(month); setCurrentYear(year); }}
                />
            </ChakraProvider>
        </div>
    );
};

export default DashboardPage;
