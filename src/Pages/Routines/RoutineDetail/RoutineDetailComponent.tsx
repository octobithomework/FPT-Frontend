import React, { ReactNode, useEffect, useState } from 'react';
import { get, getAuth } from '../../../Utils/APIHelpers';
import './RoutineDetail.css';
import { Box, Divider, Heading, Popover, VStack, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, StackDivider, Text, Table, Thead, Tbody, Tr, Th, Td, Button, HStack, Flex, Tooltip } from '@chakra-ui/react';
import { AddIcon, DeleteIcon, InfoIcon, SmallAddIcon } from '@chakra-ui/icons';

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
    routineId: string | undefined;
    popoverTrigger: ReactNode | null;
}

const RoutineDetailComponent: React.FC<RoutineDetailProps> = ({ routineId, popoverTrigger }: RoutineDetailProps) => {
    const [routineDetail, setRoutineDetail] = useState<RoutineDetail | null>(null);
    const [isAuthorized, setIsAuthorized] = useState<boolean>(true); // Assume authorized by default
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorLoading, setErrorLoading] = useState<boolean>(false);

    async function fetchRoutineDetails(id: string) {
        try {
            const response = await getAuth(`/routine-details/${id}`);
            const json = await response.json();
            console.log(json)
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
        if (routineId) fetchRoutineDetails(routineId);
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
                    <PopoverArrow bg={'#333'} />
                    <PopoverCloseButton />
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
        <Flex direction='column' m={6} bgColor={"#333"} minHeight={'76.5vh'}>
            <Heading as='h1' size="lg" m={3} color={'white'}>{routineDetail.name}</Heading>
            <Text mb={4} fontStyle={'italic'} ml={5} color={'white'}>{routineDetail.description}</Text>
            <Divider/>
            <Box overflow='scroll' p={4} height='md'>
                <Table variant="simple" >
                    <Thead>
                        <Tr>
                        <Th color='white'>Exercise Name</Th>
                        <Th color='white'>Repetitions</Th>
                        <Th color='white'>Sets</Th>
                        <Th>
                            <Tooltip label="Amount of time to rest between sets.">
                                <HStack>
                                    <InfoIcon color='white'/>
                                    <Text color='white'>Resting Time</Text>
                                </HStack>
                            </Tooltip>
                        </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {routineDetail.exercises?.map((exercise, index) => (
                        <Tr key={index}>
                            <Td>{exercise.name}</Td>
                            <Td>{exercise.repetitions}</Td>
                            <Td>{exercise.sets}</Td>
                            <Td>{exercise.restingTime} Seconds</Td>
                        </Tr>
                        ))}
                    </Tbody>
                </Table>
                {!isAuthorized && <Text color="red.500">Access to this routine is restricted.</Text>}
            </Box>
        </Flex>
    )


}

export default RoutineDetailComponent;


