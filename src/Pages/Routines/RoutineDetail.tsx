import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { get } from '../../Utils/APIHelpers';
import './RoutineDetail.css';


const RoutineDetailPage: React.FC = () => {
    const { RoutineID } = useParams<{ RoutineID: string }>(); // Get RoutineID from URL params
    const [routineDetail, setRoutineDetail] = useState<RoutineDetail | null>(null);
    const [isAuthorized, setIsAuthorized] = useState<boolean>(true); // Assume authorized by default
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorLoading, setErrorLoading] = useState<boolean>(false);

    async function fetchRoutineDetails(id: string) {
        try {
            const response = await get(`/routine-details/${id}`);
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
        if (RoutineID) {
            fetchRoutineDetails(RoutineID);
        }
    }, [RoutineID]); // Fetch routine details when RoutineID changes

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

    return (
        <div>
            <h1>{routineDetail.name}</h1>
            <p>Description: {routineDetail.description}</p>

            <h2>Exercises</h2>
            <ul>
                {routineDetail.exercises.map((exercise, index) => (
                    <li key={index}>
                        <strong>Exercise Name:</strong> {exercise.name}<br />
                        <strong>Order:</strong> {exercise.order}<br />
                        <strong>Repetitions:</strong> {exercise.repetitions}<br />
                        <strong>Sets:</strong> {exercise.sets}<br />
                        <strong>Resting Time:</strong> {exercise.restingTime}<br />
                    </li>
                ))}
            </ul>

            {!isAuthorized && <p>Access to this routine is restricted.</p>}
        </div>
    );
};

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

export default RoutineDetailPage;


