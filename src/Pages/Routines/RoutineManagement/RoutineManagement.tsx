// RoutinesListPage.js
import React, { useEffect, useState } from 'react';
import { Box, ChakraProvider, HStack, Text, Badge } from "@chakra-ui/react";
import { getAuth } from '../../../Utils/APIHelpers';
import { Routine } from '../../../Interfaces/Routine';
import './RoutineManagement.css';
import { Link } from 'react-router-dom';

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
                    <div className="routine-mgmt-box-header">
                        <Text fontSize="2xl" className="routine-mgmt-box-header-text">My Routines</Text>
                        <div className="btn-container">
                            <button className="add-routine-btn" title='Add Routine'>+</button>
                        </div>
                    </div>

                    {routines.length > 0 ? (
                        <div className="routine-mgmt-sub-box">
                            {routines.map((routine) => (
                                <Box key={routine.routineId} p={5} borderWidth="1px" className="routine-mgmt-entry">
                                    <div className="routine-mgmt-sub-header">
                                        <div className="name-and-icons">
                                            <Text fontSize="xl" className="routine-mgmt-name">{routine.name}</Text>
                                            <div className="icon-group">
                                                <Link to={`/routine-details/${routine.routineId}`} className="icon edit-icon">
                                                    &#9998; {/* Pencil Icon */}
                                                </Link>
                                                <button className="icon delete-icon" onClick={() => { console.log("hello") }}>
                                                    &#128465; {/* Trashcan Icon */}
                                                </button>
                                            </div>
                                        </div>
                                        <div>
                                            <Badge colorScheme={routine.visibility === 'PUBLIC' ? 'green' : 'red'}>{routine.visibility}</Badge>
                                        </div>
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
