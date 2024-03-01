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
    Flex
} from '@chakra-ui/react';
import './AddRoutineModal.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { get } from '../../../../../Utils/APIHelpers';
import { OptionType } from '../../../../../Interfaces/OptionType';
import { RoutineExercise } from '../../../../../Interfaces/Routine';

interface AddRoutineModalProps {
    onAdd: (data: any) => void;
}

const AddRoutineModal: React.FC<AddRoutineModalProps> = ({ onAdd }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [visibility, setVisibility] = useState<SingleValue<OptionType>>(null);
    const [selectedExercise, setSelectedExercise] = useState<SingleValue<RoutineExercise>>(null);
    const [exercises, setExercises] = useState<RoutineExercise[]>([]);
    const [addedExercises, setAddedExercises] = useState<RoutineExercise[]>([]);

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
    }, []);

    const handleAddExercise = () => {
        if (selectedExercise) {
            const exerciseToAdd =
            {
                ...selectedExercise,
                uid: Date.now(),
            }

            setAddedExercises([...addedExercises, exerciseToAdd]);
        }
    };

    const handleOnDragEnd = (result: any) => {
        if (!result.destination) {
            return;
        }
        const items = Array.from(addedExercises);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setAddedExercises(items);
    };

    const handleRemoveExercise = (uidToRemove: number) => {
        setAddedExercises(addedExercises.filter((exercise: any) => exercise.uid !== uidToRemove));
    };


    const handleSubmit = async () => {
        // onAdd({ name, description, visibility: visibility?.value, exercises: addedExercises });
        setName('');
        setDescription('');
        setVisibility(null);
        setSelectedExercise(null);
        setAddedExercises([]);
        onClose();
        console.log(addedExercises);
    };

    return (
        <>
            <Button onClick={onOpen} className="add-routine-modal-btn">Add Routine</Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent className="modal-content">
                    <ModalHeader className="modal-header">Add a New Routine</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <FormLabel>Name</FormLabel>
                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Description</FormLabel>
                            <Textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </FormControl>

                        <FormControl mt={4}>
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
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Exercise</FormLabel>
                            <div className="add-routine-modal-add-exercise">
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

                        <DragDropContext onDragEnd={handleOnDragEnd}>
                            <Droppable droppableId="exercises">
                                {(provided) => (
                                    <Box {...provided.droppableProps} ref={provided.innerRef} mt={4}>
                                        {addedExercises.map((exercise: any, index) => (
                                            <Draggable key={exercise.uid} draggableId={exercise.uid.toString()} index={index}>
                                                {(provided) => (
                                                    <div>
                                                        <Box
                                                            className="draggable-item"
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            p={2}
                                                            mb={2}
                                                        >
                                                            {exercise.name}
                                                            <button onClick={() => handleRemoveExercise(exercise.uid)} className="add-routine-modal-icon">
                                                                &#128465; {/* Trashcan Icon */}
                                                            </button>

                                                            <Input
                                                                className="add-routine-modal-input"
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
                                                                className="add-routine-modal-input"
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
                                                                className="add-routine-modal-input"
                                                                title="Resting Time: The pause between sets, allowing muscles to recover. Proper rest can improve performance and reduce injury risk."
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
                                                        </Box>
                                                    </div>
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
                        <Button mr={3} onClick={handleSubmit} className='add-routine-modal-save'>
                            Save
                        </Button>
                        <Button onClick={onClose} className="add-routine-modal-cancel">Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default AddRoutineModal;
