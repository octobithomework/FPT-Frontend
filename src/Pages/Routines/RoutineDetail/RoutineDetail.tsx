import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAuth } from '../../../Utils/APIHelpers';
import { Routine, RoutineExercise } from '../../../Interfaces/Routine';
import './RoutineDetail.css';

interface RoutineDetailProps {
    routineId?: string;
}

const RoutineDetailComponent: React.FC<RoutineDetailProps> = ({ routineId }) => {
    const [routineDetail, setRoutineDetail] = useState<Routine>({
        routineId: 0,
        name: '',
        description: '',
        visibility: '',
        created: '',
        exercises: []
    });

    const getRoutineDetail = async (id: string) => {
        try {
            const response = await getAuth(`/routine-details/${id}`);
            if (!response || !response.ok) {
                throw new Error('Failed to fetch routine details');
            }
            const json = await response.json();

            setRoutineDetail(json);
        } catch (error) {
            console.error('Error fetching routine details:', error);
        }
    };

    useEffect(() => {
        if (routineId) {
            getRoutineDetail(routineId);
        }
    }, [routineId]);

    return (
        <div className="routine-detail-box">
            <div className="routine-detail-header">
                <h1 className="routine-detail-name">{routineDetail.name}</h1>
            </div>

            <div className="routine-exercise-detail-info">
                {routineDetail.visibility && <p className="routine-detail-visibility">Visibility: <span className="routine-exercise-detail-value">{routineDetail.visibility}</span></p>}
                {routineDetail.created && <p className="routine-detail-created">Created: <span className="routine-exercise-detail-value">{new Date(routineDetail.created).toLocaleDateString()}</span></p>}
                {routineDetail.description && (
                    <>
                        <p className="exercise-detail-description">Description:</p>
                        <p className="exercise-detail-value">{routineDetail.description}</p>
                    </>
                )}
                {routineDetail.exercises.length > 0 && (
                    <div className="routine-detail-exercises">
                        {routineDetail.exercises.map((exercise: RoutineExercise) => (
                            <div key={exercise.routineExerciseId} className="routine-exercise-detail">
                                <p>{exercise.name}</p>
                                <p>Reps: {exercise.repetitions}</p>
                                <p>Sets: {exercise.sets}</p>
                                <p>Resting Time: {exercise.restingTime && <span>{exercise.restingTime} sec</span>}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const RoutineDetailPage: React.FC = () => {
    const { routineId } = useParams<{ routineId: string }>();

    return (
        <div className="routine-detail-container">
            <RoutineDetailComponent routineId={routineId} />
        </div>
    );
};

export default RoutineDetailPage;
