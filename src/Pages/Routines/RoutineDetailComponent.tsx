import React, { useEffect, useState } from 'react';
import { get } from '../../Utils/APIHelpers';

const RoutineDetailComponent: React.FC = () => {
    const [routineDetailInfo, setRoutineDetailInfo] = useState<RoutineDetail[]>([])

    async function getRoutineDetail(id: number) {
        const response = await get('/routine-details/' + id)
        const json = await response.json()
        return json as RoutineDetail[]
    }

    useEffect(() => {
        // Pass id in here, can change how you do this if you'd like
        getRoutineDetail(1).then(setRoutineDetailInfo)
    }, [])

    return (
        <div className="">
            {routineDetailInfo.map(routine => (
                <div>
                    {routine.exerciseName}|{routine.sets}
                </div>
            ))}
        </div>
);
};

interface RoutineDetail {
    exerciseName: String;
    routineName: String;
    description: String;
    order: number;
    repetitions: number;
    sets: number;
    restingTime: number;
}

export default RoutineDetailComponent;
