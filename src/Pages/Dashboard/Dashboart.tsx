import React, { useEffect, useState } from 'react';
import { ChakraProvider } from "@chakra-ui/react";
import Calendar from "./Components/Calendar";
import './Dashboard.css';
import { getAuth } from '../../Utils/APIHelpers';

const DashboardPage: React.FC = () => {
    const [completedRoutines, setCompletedRoutines] = useState([]);

    useEffect(() => {
        const fetchCompletedRoutines = async () => {
            const currentDate = new Date();
            // JavaScript months are 0-based, so add 1 to get the correct month
            const currentMonth = currentDate.getMonth() + 1;
            const currentYear = currentDate.getFullYear();

            try {
                const response = await getAuth(`/completed-routines?month=${currentMonth}&year=${currentYear}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch completed routines.');
                }
                const data = await response.json();
                setCompletedRoutines(data);
            } catch (err) {
                console.error('Error fetching completed routines:', err);
            }
        };

        fetchCompletedRoutines();
    }, []);

    return (
        <div className="dashboard-container">
            <ChakraProvider>
                <Calendar completedRoutines={completedRoutines} />
            </ChakraProvider>
        </div>
    );
};

export default DashboardPage;
