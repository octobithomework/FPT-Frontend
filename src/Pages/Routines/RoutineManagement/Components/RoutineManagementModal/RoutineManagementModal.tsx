import React, { useState, useEffect } from 'react';
import Select, { GroupBase, SingleValue } from 'react-select';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    Box,
    Flex,
    FormErrorMessage
} from '@chakra-ui/react';
import './RoutineManagementModal.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { get } from '../../../../../Utils/APIHelpers';
import { OptionType } from '../../../../../Interfaces/OptionType';
import { Routine, RoutineExercise } from '../../../../../Interfaces/Routine';
import { set } from 'date-fns';
import { DeleteIcon } from '@chakra-ui/icons';

interface RoutineManagementModalProps {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
    onAdd: (data: any) => void;
    onEdit: (data: any) => void;
    editingRoutine?: Routine | null;
}

const RoutineManagementModal: React.FC<RoutineManagementModalProps> = ({ isOpen, onOpen, onClose, onAdd, onEdit, editingRoutine }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [visibility, setVisibility] = useState<SingleValue<OptionType>>(null);
    const [selectedExercise, setSelectedExercise] = useState<SingleValue<RoutineExercise>>(null);
    const [exercises, setExercises] = useState<RoutineExercise[]>([]);
    const [addedExercises, setAddedExercises] = useState<RoutineExercise[]>([]);
    const [nameError, setNameError] = useState('');
    const [visibilityError, setVisibilityError] = useState('');
    const [exerciseError, setExerciseError] = useState('');
    const [uidIndex, setUidIndex] = useState(0);

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const response = await get('/exercises');
                if (!response.ok) {
                    throw new Error('Failed to fetch exercises.');
                }
                const data: RoutineExercise[] = await response.json();
                setExercises(data);
            } catch (error) {
                console.error('Failed to fetch exercises', error);
            }
        };
        fetchExercises();

        if (isOpen && editingRoutine) {
            setName(editingRoutine.name);
            setDescription(editingRoutine.description);

            const visibility = editingRoutine.visibility.toLowerCase();
            const capitalizedVisibility = visibility.charAt(0).toUpperCase() + visibility.slice(1);
            setVisibility({ value: editingRoutine.visibility, label: capitalizedVisibility });

            let newUidIndex = uidIndex;

            const updatedExercises = editingRoutine.exercises.map((exercise: RoutineExercise) => {
                const updatedExercise = {
                    ...exercise,
                    uid: newUidIndex++
                };
                return updatedExercise;
            });

            setAddedExercises(updatedExercises);
            setUidIndex(newUidIndex);
        }
    }, [isOpen, editingRoutine]);



    const handleAddExercise = () => {
        if (selectedExercise) {
            const exerciseToAdd =
            {
                ...selectedExercise,
                order: addedExercises.length,
                uid: uidIndex,
            }

            setAddedExercises([...addedExercises, exerciseToAdd]);
            setUidIndex(uidIndex + 1);
        }
    };

    const handleOnDragEnd = (result: any) => {
        if (!result.destination) {
            return;
        }
        const items = Array.from(addedExercises);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        const updatedItems = items.map((item, index) => ({
            ...item,
            order: index,
        }));

        setAddedExercises(updatedItems);
    };

    const handleRemoveExercise = (uidToRemove: number) => {
        setAddedExercises(addedExercises.filter((exercise: any) => exercise.uid !== uidToRemove));
        if (exerciseError) {
            setExerciseError('');
        }
    };

    const handleSubmit = async () => {
        let isValid = true;
        setNameError('');
        setVisibilityError('');
        setExerciseError('');

        if (!name.trim()) {
            setNameError('Please enter a name for the routine.');
            isValid = false;
        }

        if (!visibility) {
            setVisibilityError('Please select the visibility for the routine.');
            isValid = false;
        }

        const invalidExercises = addedExercises
            .some(exercise => (exercise?.sets || -1) <= 0
                || (exercise?.repetitions || -1) <= 0
                || (exercise?.restingTime || -1) < 0
            );

        if (invalidExercises) {
            setExerciseError('Each exercise must have non-negative sets, reps, and rest.');
            isValid = false;
        }

        if (!isValid) {
            return;
        }

        const routineData = {
            routineId: editingRoutine?.routineId,
            name,
            description,
            visibility: visibility?.value,
            exercises: addedExercises
        };

        if (editingRoutine) {
            onEdit(routineData);
        } else {
            onAdd(routineData);
        }

        handleClose();
    };

    const handleClose = () => {
        setName('');
        setDescription('');
        setVisibility(null);
        setSelectedExercise(null);
        setAddedExercises([]);
        setNameError('');
        setVisibilityError('');
        setExerciseError('');
        onClose();
    }

    return (
        <>
            <Button onClick={onOpen} className="routine-mgmt-modal-btn">Add Routine</Button>

            <Modal isOpen={isOpen} onClose={handleClose}>
                <ModalOverlay />
                <ModalContent className="modal-content">
                    <ModalHeader className="modal-header">Add a New Routine</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl isInvalid={!!nameError}>
                            <FormLabel>Name</FormLabel>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            {nameError && <FormErrorMessage>{nameError}</FormErrorMessage>}
                        </FormControl>

                        <FormControl>
                            <FormLabel>Description</FormLabel>
                            <Textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </FormControl>

                        <FormControl isInvalid={!!visibilityError}>
                            <FormLabel>Visibility</FormLabel>
                            <Select
                                options={[
                                    { value: 'PUBLIC', label: 'Public' },
                                    { value: 'PRIVATE', label: 'Private' }
                                ]}
                                value={visibility}
                                onChange={setVisibility}
                                classNamePrefix="select"
                                placeholder=''
                                isSearchable={false}
                            />
                            {visibilityError && <FormErrorMessage>{visibilityError}</FormErrorMessage>}
                        </FormControl>

                        <FormControl>
                            <FormLabel>Exercise</FormLabel>
                            <div className="routine-mgmt-modal-add-exercise">
                                <Select
                                    options={exercises}
                                    getOptionLabel={(exercise: RoutineExercise) => exercise.name}
                                    getOptionValue={(exercise: RoutineExercise) => exercise.exerciseId.toString()}
                                    onChange={setSelectedExercise}
                                    classNamePrefix="select"
                                    placeholder=''
                                    isSearchable={true}
                                />
                                <Button ml={2} onClick={handleAddExercise}>Add</Button>
                            </div>
                        </FormControl>

                        <FormControl isInvalid={!!exerciseError} className="routine-mgmt-modal-exercise-error">
                            {exerciseError && <FormErrorMessage>{exerciseError}</FormErrorMessage>}
                        </FormControl>

                        <DragDropContext onDragEnd={handleOnDragEnd}>
                            <Droppable droppableId="exercises">
                                {(provided) => (
                                    <Box {...provided.droppableProps} ref={provided.innerRef} mt={4}>
                                        {addedExercises.map((exercise: any, index) => (
                                            <Draggable key={exercise.uid} draggableId={exercise.uid.toString()} index={index}>
                                                {(provided) => (
                                                    <Box
                                                        className="draggable-item"
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        p={2}
                                                        mb={2}
                                                    >
                                                        <div className="routine-mgmt-modal-name-and-icons">
                                                            {exercise.name}
                                                            <DeleteIcon
                                                                className="routine-mgmt-modal-icon delete-icon"
                                                                onClick={() => handleRemoveExercise(exercise.uid)}
                                                            />
                                                        </div>

                                                        <div className="routine-mgmt-modal-draggable-inputs">
                                                            <Input
                                                                className="routine-mgmt-modal-exercise-input"
                                                                title="Repetitions (Reps): The number of consecutive times you perform an exercise without stopping. Aims to increase muscle endurance and strength."
                                                                placeholder="Reps"
                                                                ref={provided.innerRef}
                                                                width="20%"
                                                                type="number"
                                                                value={exercise.repetitions}
                                                                onChange={(e) => {
                                                                    const updatedExercises = addedExercises.map((ex: any) =>
                                                                        ex.uid === exercise.uid ? { ...ex, repetitions: parseInt(e.target.value, 0) } : ex
                                                                    );
                                                                    setAddedExercises(updatedExercises);
                                                                }}
                                                            />

                                                            <Input
                                                                className="routine-mgmt-modal-exercise-input"
                                                                title="Sets: A group of repetitions performed for an exercise. Multiple sets can help improve muscle strength, endurance, and growth."
                                                                placeholder="Sets"
                                                                ref={provided.innerRef}
                                                                width="20%"
                                                                type="number"
                                                                value={exercise.sets}
                                                                onChange={(e) => {
                                                                    const updatedExercises = addedExercises.map((ex: any) =>
                                                                        ex.uid === exercise.uid ? { ...ex, sets: parseInt(e.target.value, 0) } : ex
                                                                    );
                                                                    setAddedExercises(updatedExercises);
                                                                }}
                                                            />

                                                            <Input
                                                                className="routine-mgmt-modal-exercise-input"
                                                                title="Resting Time (seconds): The pause between sets, allowing muscles to recover. Proper rest can improve performance and reduce injury risk."
                                                                placeholder="Rest"
                                                                ref={provided.innerRef}
                                                                width="20%"
                                                                type="number"
                                                                value={exercise.restingTime}
                                                                onChange={(e) => {
                                                                    const updatedExercises = addedExercises.map((ex: any) =>
                                                                        ex.uid === exercise.uid ? { ...ex, restingTime: parseInt(e.target.value, 0) } : ex
                                                                    );
                                                                    setAddedExercises(updatedExercises);
                                                                }}
                                                            />
                                                        </div>
                                                    </Box>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </Box>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </ModalBody>

                    <ModalFooter>
                        <Button mr={3} onClick={handleSubmit} className='routine-mgmt-modal-save'>Save</Button>
                        <Button onClick={handleClose} className="routine-mgmt-modal-cancel">Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default RoutineManagementModal;
