import React, { useEffect, useState } from 'react';
import { get } from '../../Utils/APIHelpers';

const ExerciseDetailComponent: React.FC = () => {
    const [exerciseDetailInfo, setExerciseDetailInfo] = useState<ExerciseDetail | null>(null)

    async function getExerciseDetail(id: number) {
        const response = await get('/exercise-details/' + id)
        const json = await response.json()
        return json as ExerciseDetail
    }

    useEffect(() => {
        // Pass id in here, can change how you do this if you'd like
        getExerciseDetail(1).then(setExerciseDetailInfo)
    }, [])

    return (
        <div className="">
            {exerciseDetailInfo?.name}
        </div>
);
};

interface ExerciseDetail {
    exercise_id: number;
    name: string;
    description: string;
    category_type: string;
    body_part_focus: string;
    difficulty_level: string;
    equipment_needed: string;
}

export default ExerciseDetailComponent;
