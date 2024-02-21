import React, { Component, ReactNode, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { get } from '../../Utils/APIHelpers';
import './ExerciseDetail.css'; // Import the CSS file for styling

// changed to use type instead of interface
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
    // Get ExerciseID from URL params
    const { ExerciseID } = useParams<{ ExerciseID: string }>(); 
    //null if no information is available, setter function setExerciseDetailInfo is used to update this variables state
    const [exerciseDetailInfo, setExerciseDetailInfo] = useState<ExerciseDetail | null>(null)
    
    //gets exercise details from backend
    async function getExerciseDetail(id: string) {
        try {
            //hit the endpoint
            const response = await get('/exercise-details/' + id)
            console.log('Response:', response);
            //error handling
            if (!response || !response.ok) {
                throw new Error('Failed to fetch exercise details');
            }
            //get json from response and put it in variable exercise Detail
            const json = await response.json();
            return json as ExerciseDetail;
        } catch (error) {
            console.error('Error fetching exercise details:', error);
            return null;
        }
    }
    
    useEffect(() => {
        //if the exerciseID in the url exists
        if (ExerciseID) {
            // execute the above function to query the db 
            //.then setExerciseDetailInfo is used to update the state of exerciseDetailInfo with the exercise details fetched from the backend API.
            getExerciseDetail(ExerciseID).then(setExerciseDetailInfo);
        }
    }, [ExerciseID]); 

    //checks if exerciseDetailInfo is falsy
    if (!exerciseDetailInfo) {
        return (
            <div className="loading-container">
                <div className="loading-text">Exercise passed from URL not found in Database</div>
            </div>
        );
    }
    //render info from query here upon success, can be made nicer to look at once functionality is confirmed
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