import React, { useState, useEffect } from 'react';
import Select, { SingleValue } from 'react-select';
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
import { Routine } from '../../../../../Interfaces/Routine';
import { get } from '../../../../../Utils/APIHelpers';
import { Exercise } from '../../../../../Interfaces/Exercise';
import { OptionType } from '../../../../../Interfaces/OptionType';
import { set } from 'date-fns';

interface AddRoutineModalProps {
    onAdd: (data: any) => void;
}

const AddRoutineModal: React.FC<AddRoutineModalProps> = ({ onAdd }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [visibility, setVisibility] = useState<SingleValue<OptionType>>(null);
    const [selectedExercise, setSelectedExercise] = useState<SingleValue<OptionType>>(null);
    const [exercises, setExercises] = useState([]);

    useEffect(() => {
        const fetchExercises = async () => {
            try {
                const response = await get('/exercises');

                if (!response.ok) {
                    throw new Error('Failed to fetch exercises.');
                }

                const data = await response.json();

                const exerciseOptions = data.map((exercise: Exercise) => ({
                    value: exercise.exerciseId,
                    label: exercise.name
                }));

                setExercises(exerciseOptions);
            } catch (error) {
                console.error('Failed to fetch exercises', error);
            }
        };

        fetchExercises();
    }, []);

    const handleSubmit = async () => {
        onAdd({ name, description, visibility });
        setName('');
        setDescription('');
        setVisibility(null);
        setSelectedExercise(null);
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
                                isSearchable={false}
                            />
                        </FormControl>

                        <FormControl mt={4}>
                            <FormLabel>Exercise</FormLabel>
                            <Select
                                options={exercises}
                                value={selectedExercise}
                                onChange={setSelectedExercise}
                                classNamePrefix="select"
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
