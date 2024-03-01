// RoutinesListPage.js
import React, { useEffect, useState } from 'react';
import { Box, Text, Badge } from "@chakra-ui/react";
import { delAuth, getAuth, postAuth } from '../../../Utils/APIHelpers';
import { Routine } from '../../../Interfaces/Routine';
import './RoutineManagement.css';
import { Link } from 'react-router-dom';
import AddRoutineModal from './Components/AddRoutineModal/AddRoutineModal';

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

    const handleDeleteRoutine = async (routineId: string) => {
        try {
            const response = await delAuth(`/routines/${routineId}`);
            if (!response.ok) {
                throw new Error('Failed to delete routine.');
            }
            setRoutines(routines.filter(routine => routine.routineId.toString() !== routineId));
        } catch (err) {
            console.error('Error deleting routine:', err);
        }
    };

    const handleAddRoutine = async (newRoutine: Routine) => {
        try {
            const response = await postAuth('/routines', newRoutine);
            if (!response.ok) {
                throw new Error('Failed to add routine.');
            }
            const addedRoutine = await response.json();
            setRoutines([...routines, addedRoutine]);
        } catch (err) {
            console.error('Error adding new routine:', err);
        }
    };

    return (
        <div className='routine-mgmt-container'>
            <div className="routine-mgmt-box">
                <div className="routine-mgmt-box-header">
                    <Text fontSize="2xl" className="routine-mgmt-box-header-text">My Routines</Text>
                    <div className="routine-mgmt-btn-container">
                        <AddRoutineModal onAdd={handleAddRoutine} />
                    </div>
                </div>

                {routines.length > 0 ? (
                    <div className="routine-mgmt-sub-box">
                        {routines.map((routine) => (
                            <Box key={routine.routineId} p={5} borderWidth="1px" className="routine-mgmt-entry">
                                <div className="routine-mgmt-sub-header">
                                    <div className="routine-mgmt-name-and-icons">
                                        <Text fontSize="xl" className="routine-mgmt-name">{routine.name}</Text>
                                        <div className="routine-mgmt-icon-group">
                                            <Link to={`/routine-details/${routine.routineId}`} className="icon edit-icon">
                                                &#9998; {/* Pencil Icon */}
                                            </Link>
                                            <button className="routine-mgmt-icon delete-icon" onClick={() => handleDeleteRoutine(routine.routineId.toString())}>
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
        </div>
    );
};

export default RoutineManagementPage;
