import React, { ReactNode, useEffect, useState } from 'react';
import { get, getAuth } from '../../Utils/APIHelpers';
import './RoutineDetail.css';
import { Box, Divider, Heading, Popover, VStack, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, StackDivider, Text } from '@chakra-ui/react';

interface RoutineDetail {
    routineId: string;
    name: string;
    description: string;
    exercises: ExerciseDetail[];
}

interface ExerciseDetail {
    exerciseId: string;
    name: string;
    order: number;
    repetitions: number;
    sets: number;
    restingTime: number;
}

// export default RoutineDetailPage;

type RoutineDetailProps = {
    routineId: string;
    popoverTrigger: ReactNode | null;
}

const RoutineDetailComponent: React.FC<RoutineDetailProps> = ({routineId, popoverTrigger} : RoutineDetailProps) => {
    const [routineDetail, setRoutineDetail] = useState<RoutineDetail | null>(null);
    const [isAuthorized, setIsAuthorized] = useState<boolean>(true); // Assume authorized by default
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorLoading, setErrorLoading] = useState<boolean>(false);

    async function fetchRoutineDetails(id: string) {
        try {
            const response = await getAuth(`/routine-details/${id}`);
            const json = await response.json();
            setRoutineDetail(json);
            // Check if routine visibility is private and current user is not the author
            // For demonstration, assume authorized by default
            setIsAuthorized(true);
        } catch (error) {
            console.error('Error fetching routine details:', error);
            setErrorLoading(true);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchRoutineDetails(routineId);
    }, [routineId]); // Fetch routine details when RoutineID changes

    if (isLoading) {
        return (
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <p>No Routines in database</p>
            </div>
        );
    }

    if (errorLoading) {
        return (
            <div className="error-container">
                <p>Error Loading</p>
            </div>
        );
    }

    if (!routineDetail) {
        return <div>No Routines in database</div>;
    }
    
    if (popoverTrigger) {
        return (
                <Popover placement='left'>
                    <PopoverTrigger>
                        {popoverTrigger}
                    </PopoverTrigger>
                    <PopoverContent>
                        <PopoverArrow bg={'#333'}/>
                        <PopoverCloseButton/>
                        <PopoverBody bg={'#333'}>
                            <PopoverHeader>{routineDetail.name}</PopoverHeader>
                            {detailDialog(routineDetail, isAuthorized)}
                        </PopoverBody>
                    </PopoverContent>
                </Popover>
        )
    } else return detailDialog(routineDetail, isAuthorized)
};

const detailDialog = (routineDetail: RoutineDetail, isAuthorized: boolean) => {
    return (
        <Box overflow='scroll' p={4} height={'md'}>
            <Text mb={4} fontStyle={'italic'}>{routineDetail.description}</Text>
            <Heading as="h2" size="md" mb={2}>Exercises</Heading>
            <Divider/>
            <VStack mb={2} divider={<StackDivider/>}>
                {routineDetail.exercises.map((exercise, index) => (
                    <Box key={index}>
                        <Text><strong>Exercise Name:</strong> {exercise.name}</Text>
                        <Text><strong>Repetitions:</strong> {exercise.repetitions}</Text>
                        <Text><strong>Sets:</strong> {exercise.sets}</Text>
                        <Text><strong>Resting Time:</strong> {exercise.restingTime} Seconds</Text>
                    </Box>
                ))}
            </VStack>

            {!isAuthorized && <Text color="red.500">Access to this routine is restricted.</Text>}
        </Box>
    )


}

export default RoutineDetailComponent;


