import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { get } from '../../Utils/APIHelpers';
import { Exercise } from '../../Interfaces/Exercise';
import './ExerciseDetail.css'; 


interface ExerciseDetailProps {
    exerciseId?: string; // Renamed prop to follow camelCase convention
}

const ExerciseDetailComponent: React.FC<ExerciseDetailProps> = ({ exerciseId }: ExerciseDetailProps) => {
    const [exerciseDetailInfo, setExerciseDetailInfo] = useState<Exercise>({
        exerciseId: 0,
        name: '',
        description: '',
        categoryType: '',
        bodyPartFocus: '',
        difficultyLevel: '',
        equipmentNeeded: ''
    });
    const navigate = useNavigate();

    const getExerciseDetail = async (id: string) => {
        try {
            const response = await get('/exercise-details/' + id);
            if (!response || !response.ok) {
                navigate('/dashboard');
                throw new Error('Failed to fetch exercise details');
            }
            const json = await response.json();

            setExerciseDetailInfo({
                exerciseId: json.exerciseId,
                name: json.name,
                description: json.description,
                categoryType: json.categoryType, 
                bodyPartFocus: json.bodyPartFocus,
                difficultyLevel: json.difficultyLevel,
                equipmentNeeded: json.equipmentNeeded
            });
        } catch (error) {
            console.error('Error fetching exercise details:', error);
        }
    };

    useEffect(() => {
        if (exerciseId) {
            getExerciseDetail(exerciseId);
        }
    }, [exerciseId]);

    return (
        <div className="exercise-detail-box">
            <div className="exercise-detail-header">
                <h1 className="exercise-detail-name">{exerciseDetailInfo.name}</h1>
            </div>
            <div className="exercise-detail-info">
                {exerciseDetailInfo.description && (
                    <>
                        <p className="exercise-detail-description">Description:</p>
                        <p className="exercise-detail-value">{exerciseDetailInfo.description}</p>
                    </>
                )}
                {exerciseDetailInfo.categoryType && <p className="exercise-detail-category">Category Type: <span className="exercise-detail-value">{exerciseDetailInfo.categoryType}</span></p>}
                {exerciseDetailInfo.bodyPartFocus && <p className="exercise-detail-body-part">Body Part Focus: <span className="exercise-detail-value">{exerciseDetailInfo.bodyPartFocus}</span></p>}
                {exerciseDetailInfo.difficultyLevel && <p className="exercise-detail-difficulty">Difficulty Level: <span className="exercise-detail-value">{exerciseDetailInfo.difficultyLevel}</span></p>}
                {exerciseDetailInfo.equipmentNeeded && <p className="exercise-detail-equipment">Equipment Needed: <span className="exercise-detail-value">{exerciseDetailInfo.equipmentNeeded}</span></p>}
            </div>
        </div>
    );
};


const ExerciseDetailPage: React.FC = () => {
    const { exerciseId } = useParams<{ exerciseId: string }>();

    return (
        <div className="exercise-detail-container">
            <ExerciseDetailComponent exerciseId={exerciseId} />
        </div>
    );
};

export default ExerciseDetailPage;
