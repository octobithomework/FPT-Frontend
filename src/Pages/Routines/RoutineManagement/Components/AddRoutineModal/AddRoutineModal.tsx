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
    Textarea
} from '@chakra-ui/react';
import './AddRoutineModal.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { get } from '../../../../../Utils/APIHelpers';
import { Exercise } from '../../../../../Interfaces/Exercise';
import { OptionType } from '../../../../../Interfaces/OptionType';
import { add, set } from 'date-fns';

interface AddRoutineModalProps {
    onAdd: (data: any) => void;
}

const AddRoutineModal: React.FC<AddRoutineModalProps> = ({ onAdd }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [visibility, setVisibility] = useState<SingleValue<OptionType>>(null);
    const [selectedExercise, setSelectedExercise] = useState<SingleValue<Exercise>>(null);
    const [exercises, setExercises] = useState<Exercise[]>([]);
    const [addedExercises, setAddedExercises] = useState<Exercise[]>([]);

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const response = await get('/exercises');
                if (!response.ok) {
                    throw new Error('Failed to fetch exercises.');
                }
                const data: Exercise[] = await response.json();
                setExercises(data);
            } catch (error) {
                console.error('Failed to fetch exercises', error);
            }
        };
        fetchExercises();
    }, []);

    // const handleAddExercise = () => {
    //     if (selectedExercise && !addedExercises.find(ex => ex.exerciseId === Number(selectedExercise.value))) {
    //         const exercise: Exercise = exercises.find(ex => ex.exerciseId === Number(selectedExercise.value))!;
    //         setAddedExercises((prev) => [...prev, exercise]);
    //         setSelectedExercise(null);
    //     }
    // };

    // const handleRemoveExercise = (index: number) => {
    //     setAddedExercises((prev) => prev.filter((_, i) => i !== index));
    // };

    // const handleOnDragEnd = (result: { destination: { index: number; }; source: { index: number; }; }) => {
    //     if (!result.destination) return;
    //     const items = Array.from(addedExercises);
    //     const [reorderedItem] = items.splice(result.source.index, 1);
    //     items.splice(result.destination.index, 0, reorderedItem);

    //     setAddedExercises(items);
    // };

    const handleSubmit = async () => {
        onAdd({ name, description, visibility: visibility?.value, exercises: addedExercises });
        setName('');
        setDescription('');
        setVisibility(null);
        setSelectedExercise(null);
        setAddedExercises([]);
        onClose();
    };

    return (
        <>
            <Button onClick={onOpen} className="add-routine-modal-btn">Add Routine</Button>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent className="modal-content">
                    <ModalHeader className="modal-header">Add a New Routine</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <FormLabel>Name</FormLabel>
                            <Input
                                className="modal-input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Description</FormLabel>
                            <Textarea
                                className="modal-input"
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
                            <Select
                                options={exercises}
                                getOptionLabel={(exercise: Exercise) => exercise.name}
                                getOptionValue={(exercise: Exercise) => exercise.exerciseId.toString()}
                                onChange={setSelectedExercise}
                                classNamePrefix="select"
                                placeholder=''
                                isSearchable={true}
                            />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button mr={3} onClick={handleSubmit}>
                            Save
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default AddRoutineModal;
