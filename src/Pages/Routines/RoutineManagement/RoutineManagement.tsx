import React, { useEffect, useState } from 'react';
import { Box, Text, Badge } from "@chakra-ui/react";
import { delAuth, getAuth, postAuth, putAuth } from '../../../Utils/APIHelpers';
import { Routine } from '../../../Interfaces/Routine';
import './RoutineManagement.css';
import { Link } from 'react-router-dom';
import RoutineManagementModal from './Components/RoutineManagementModal/RoutineManagementModal';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { SingleValue } from 'react-select';
import { useDisclosure } from '@chakra-ui/react';
import { set } from 'date-fns';

const RoutineManagementPage: React.FC = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [routines, setRoutines] = useState<Routine[]>([]);
    const [editingRoutine, setEditingRoutine] = useState<SingleValue<Routine>>(null);

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

    const handleAddRoutine = async (newRoutine: Routine) => {
        try {
            const response = await postAuth('/routines', newRoutine);
            if (!response.ok) {
                throw new Error('Failed to add routine.');
            }
            const addedRoutineResponse = await response.json();
            newRoutine = addedRoutineResponse;
            setRoutines([...routines, newRoutine]);
        } catch (err) {
            console.error('Error adding new routine:', err);
        }
    };

    const handleEditRoutine = async (updatedRoutine: Routine) => {
        try {
            setEditingRoutine(null);
            const response = await putAuth(`/routines/${updatedRoutine.routineId}`, updatedRoutine);
            if (!response.ok) {
                throw new Error('Failed to update routine.');
            }
            const updatedRoutineResponse: Routine = await response.json();
            setRoutines(routines.map(routine => routine.routineId === updatedRoutineResponse.routineId ? updatedRoutineResponse : routine));
        } catch (err) {
            console.error('Error updating routine:', err);
        }
    };

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

    const handleClose = () => {
        setEditingRoutine(null);
        onClose();
    }

    return (
        <div className='routine-mgmt-container'>
            <div className="routine-mgmt-box">
                <div className="routine-mgmt-box-header">
                    <Text fontSize="2xl" className="routine-mgmt-box-header-text">My Routines</Text>
                    <div className="routine-mgmt-btn-container">
                        <RoutineManagementModal
                            isOpen={isOpen}
                            onOpen={onOpen}
                            onClose={handleClose}
                            onAdd={handleAddRoutine}
                            onEdit={handleEditRoutine}
                            editingRoutine={editingRoutine}
                        />
                    </div>
                </div>

                {routines.length > 0 ? (
                    <div className="routine-mgmt-sub-box">
                        {routines.map((routine) => (
                            <Box key={routine.routineId} p={5} borderWidth="1px" className="routine-mgmt-entry">
                                <Link to={`/routine-details/${routine.routineId}`}>
                                    <div className="routine-mgmt-sub-header">
                                        <div className="routine-mgmt-name-and-icons">
                                            <Text fontSize="xl" className="routine-mgmt-name">{routine.name}</Text>
                                            <div className="routine-mgmt-icon-group">
                                                <EditIcon
                                                    className="routine-mgmt-icon edit-icon"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setEditingRoutine(routine);
                                                        onOpen();
                                                    }}
                                                />
                                                <DeleteIcon
                                                    className="routine-mgmt-icon delete-icon"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleDeleteRoutine(routine.routineId.toString())
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <Badge colorScheme={routine.visibility === 'PUBLIC' ? 'green' : 'red'}>{routine.visibility}</Badge>
                                        </div>
                                    </div>
                                    <Text mt={2} className="routine-mgmt-date">Created: {new Date(routine.created).toLocaleDateString()}</Text>
                                    <Text mt={2} className="routine-mgmt-description">{routine.description}</Text>
                                </Link>
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
