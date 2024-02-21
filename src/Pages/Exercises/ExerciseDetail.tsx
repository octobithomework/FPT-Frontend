import React, { Component, ReactNode, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { get } from '../../Utils/APIHelpers';
import './ExerciseDetail.css'; // Import the CSS file for styling

type ExerciseDetail = {
    exerciseId: number;
    name: string;
    description: string;
    categoryType: string;
    bodyPartFocus: string;
    difficultLevel: string;
    equipmentNeeded: string;
}

const ExerciseDetailPage: React.FC = () => {
    const { ExerciseID } = useParams<{ ExerciseID: string }>(); // Get ExerciseID from URL params
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
        if (ExerciseID) {
            getExerciseDetail(ExerciseID).then(setExerciseDetailInfo);
        }
    }, [ExerciseID]); // Fetch exercise details when ExerciseID changes

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

export default ExerciseDetailPage;