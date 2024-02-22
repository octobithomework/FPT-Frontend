import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { get } from '../../Utils/APIHelpers';
import './ExerciseDetail.css'; // Import the CSS file for styling
import gymBackground from '../../Assets/gym-background.jpg'; // Import the background image

interface ExerciseDetail {
    name: string;
    description: string;
    categoryType: string;
    bodyPartFocus: string;
    difficultyLevel: string;
    equipmentNeeded: string;
}

interface ExerciseDetailProps {
    exerciseID?: string; // Make exerciseID prop optional
}

const ExerciseDetailComponent: React.FC<ExerciseDetailProps> = ({ exerciseID }: ExerciseDetailProps) => {
    const [exerciseDetailInfo, setExerciseDetailInfo] = useState<ExerciseDetail | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    const getExerciseDetail = async (id: string) => {
        try {
            const response = await get('/exercise-details/' + id);
            if (!response || !response.ok) {
                throw new Error('Failed to fetch exercise details');
            }
            const json = await response.json();
            console.log('JSON response from server:', json); // Add this line to log the JSON response


            setExerciseDetailInfo({
                name: json.name,
                description: json.description,
                categoryType: json.categoryType, 
                bodyPartFocus: json.bodyPartFocus,
                difficultyLevel: json.difficultyLevel,
                equipmentNeeded: json.equipmentNeeded
            });
        } catch (error) {
            console.error('Error fetching exercise details:', error);
            setExerciseDetailInfo(null);
        }
    };

    useEffect(() => {
        if (exerciseID) {
            getExerciseDetail(exerciseID);
        }
    }, [exerciseID]);

    if (!exerciseDetailInfo || !exerciseID) {
        return null; // Don't render anything if exerciseDetailInfo is not available or exerciseID is undefined
    }
    
    return (
        <div className="exercise-detail-modal-overlay">
            <div className="exercise-detail-modal" ref={modalRef}>
                <div className="exercise-detail-header">
                    <h1 className="exercise-detail-name">{exerciseDetailInfo.name}</h1>
                </div>
                <div className="exercise-detail-content">
                    <p className="exercise-detail-description">Description:</p>
                    <p>{exerciseDetailInfo.description}</p> {/* Description on a new line */}                    
                    <p className="exercise-detail-category">Category Type: {exerciseDetailInfo.categoryType}</p>
                    <p className="exercise-detail-body-part">Body Part Focus: {exerciseDetailInfo.bodyPartFocus}</p>
                    <p className="exercise-detail-difficulty">Difficulty Level: {exerciseDetailInfo.difficultyLevel}</p>
                    <p className="exercise-detail-equipment">Equipment Needed: {exerciseDetailInfo.equipmentNeeded}</p>
                </div>
            </div>
        </div>
    );
};

const ExerciseDetailPage: React.FC = () => {
    const { ExerciseID } = useParams<{ ExerciseID: string }>();

    return (
        <div className="exercise-detail-page">
            <div className="background" style={{ backgroundImage: `url(${gymBackground})` }} />
            <div className="modal-container">
                <ExerciseDetailComponent exerciseID={ExerciseID} />
            </div>
        </div>
    );
};

export default ExerciseDetailPage;




//Example:

/*

import React, { useState } from 'react';
import { ExerciseDetailPage } from './ExerciseDetailPage'; 

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <h1>Your Main Content Goes Here</h1>
      <button onClick={openModal}>Open Exercise Detail</button>
      {isModalOpen && <ExerciseDetailPage onClose={closeModal} />}
    </div>
  );
};

export default App;

*/