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
        <div className='routine-management-container'>
            <ChakraProvider>
                <HStack spacing={4}>
                    {routines.map((routine) => (
                        <Box key={routine.routineId} p={5} shadow="md" borderWidth="1px">
                            <Text fontSize="xl">{routine.name}</Text>
                            <Text mt={2}>{routine.description}</Text>
                            <Badge colorScheme={routine.visibility === 'PUBLIC' ? 'green' : 'red'}>{routine.visibility}</Badge>
                            <Text mt={2}>Created on: {new Date(routine.created).toLocaleDateString()}</Text>
                        </Box>
                    ))}
                </HStack>
            </ChakraProvider>
        </div>
    );
};

export default RoutineManagementPage;
