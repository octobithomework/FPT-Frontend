import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { get } from '../../Utils/APIHelpers';
import './ExerciseDetail.css'; // Import the CSS file for styling

const ExerciseDetailPage: React.FC = () => {
    const { ExerciseID } = useParams<{ ExerciseID: string }>();
    const [exerciseDetailInfo, setExerciseDetailInfo] = useState<any | null>(null); // Avoid using ExerciseDetail type

    const getExerciseDetail = async (id: string) => {
        try {
            const response = await get('/exercise-details/' + id);
            console.log('Response:', response);
            if (!response || !response.ok) {
                throw new Error('Failed to fetch exercise details');
            }
            const json = await response.json();

            // Accessing data individually without relying on ExerciseDetail interface
            setExerciseDetailInfo({
                name: json.name,
                description: json.description,
                categoryType: json.category_type,
                bodyPartFocus: json.body_part_focus,
                difficultyLevel: json.difficulty_level,
                equipmentNeeded: json.equipment_needed
            });
        } catch (error) {
            console.error('Error fetching exercise details:', error);
            setExerciseDetailInfo(null);
        }
    };

    useEffect(() => {
        console.log('ExerciseID:', ExerciseID); // Log the ExerciseID
        if (ExerciseID) {
            getExerciseDetail(ExerciseID);
        }
    }, [ExerciseID]); 

    if (!exerciseDetailInfo) {
        return (
            <div className="loading-container">
                <div className="loading-text">Exercise passed from URL not found in Database</div>
            </div>
        );
    }
    
    return (
        <div className="exercise-detail-card">
            <div className="exercise-detail-header">
                <h1 className="exercise-detail-name">{exerciseDetailInfo.name}</h1>
            </div>
            <div className="exercise-detail-content">
                <p className="exercise-detail-description">Description: {exerciseDetailInfo.description}</p>
                <p className="exercise-detail-category">Category Type: {exerciseDetailInfo.categoryType}</p>
                <p className="exercise-detail-body-part">Body Part Focus: {exerciseDetailInfo.bodyPartFocus}</p>
                <p className="exercise-detail-difficulty">Difficulty Level: {exerciseDetailInfo.difficultyLevel}</p>
                <p className="exercise-detail-equipment">Equipment Needed: {exerciseDetailInfo.equipmentNeeded}</p>
            </div>
            <footer className="footer">Bottom Header</footer>
        </div>
    );
};

export default ExerciseDetailPage;
