import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { get } from '../../Utils/APIHelpers';
import './ExerciseDetail.css'; // Import the CSS file for styling

const ExerciseDetail: React.FC = () => {
    const { exerciseId } = useParams<{ exerciseId: string }>(); // Get exerciseId from URL params
    const [exerciseDetailInfo, setExerciseDetailInfo] = useState<ExerciseDetail | null>(null)

    async function getExerciseDetail(id: string) {
        try {
            const response = await get(`/exercise-details/${id}`);
            const json = await response.json();
            return json as ExerciseDetail;
        } catch (error) {
            console.error('Error fetching exercise details:', error);
            return null;
        }
    }

    useEffect(() => {
        if (exerciseId) {
            getExerciseDetail(exerciseId).then(setExerciseDetailInfo);
        }
    }, [exerciseId]); // Fetch exercise details when exerciseId changes

    if (!exerciseDetailInfo) {
        return (
            <div className="loading-container">
                <div className="loading-text">Exercise passed from URL not found in Database</div>
            </div>
        );
    }

    return (
        <div className="exercise-detail-container">
            <h1>{exerciseDetailInfo.name}</h1>
            <p>Description: {exerciseDetailInfo.description}</p>
            <p>Category Type: {exerciseDetailInfo.categoryType}</p>
            <p>Body Part Focus: {exerciseDetailInfo.bodyPartFocus}</p>
            <p>Difficulty Level: {exerciseDetailInfo.difficultLevel}</p>
            <p>Equipment Needed: {exerciseDetailInfo.equipmentNeeded}</p>
            <footer className="footer">Bottom Header</footer>
        </div>
    );
};

interface ExerciseDetail {
    exerciseId: number;
    name: string;
    description: string;
    categoryType: string;
    bodyPartFocus: string;
    difficultLevel: string;
    equipmentNeeded: string;
}

export default ExerciseDetail;
