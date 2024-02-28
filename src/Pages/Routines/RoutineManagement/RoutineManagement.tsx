// RoutinesListPage.js
import React, { useEffect, useState } from 'react';
import { Box, ChakraProvider, HStack, Text, Badge } from "@chakra-ui/react";
import { getAuth } from '../../../Utils/APIHelpers';
import { Routine } from '../../../Interfaces/Routine';
import './RoutineManagement.css';

const RoutineManagementPage: React.FC = () => {
    const [routines, setRoutines] = useState<Routine[]>([]);

    useEffect(() => {
        const fetchRoutines = async () => {
            try {
                const response = await getAuth('/routines');
                if (!response.ok) {
                    throw new Error('Failed to fetch routines.');
                }
                const routinesData: Routine[] = await response.json();

                setRoutines(routinesData);
            } catch (err) {
                console.error('Error fetching routines:', err);
            }
        };

        fetchRoutines();
    }, []);

    return (
        <div className='routine-mgmt-container'>
            <ChakraProvider>
                <div className="routine-mgmt-box">
                    <div className="btn-container">
                        <button className="add-routine-btn" title='Add Routine'>+</button>
                    </div>
                    {routines.length > 0 ? (
                        <div className="routine-mgmt-sub-box">
                            {routines.map((routine) => (
                                <Box key={routine.routineId} p={5} shadow="md" borderWidth="1px" className="routine-mgmt-entry">
                                    <div className="routine-mgmt-header">
                                        <Text fontSize="xl" className="routine-mgmt-name">{routine.name}</Text>
                                        <Badge colorScheme={routine.visibility === 'PUBLIC' ? 'green' : 'red'}>{routine.visibility}</Badge>
                                    </div>
                                    <Text mt={2} className="routine-mgmt-date">Created: {new Date(routine.created).toLocaleDateString()}</Text>
                                    <Text mt={2} className="routine-mgmt-description">{routine.description}</Text>
                                </Box>
                            ))}
                        </div>
                    ) : (
                        <div className="no-routines-found">No routines found.</div>
                    )}
                </div>
            </ChakraProvider>
        </div>
    );
};

export default RoutineManagementPage;
