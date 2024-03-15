import React from 'react';
import { useParams } from 'react-router-dom';
import RoutineDetailComponent from './RoutineDetailComponent';

const RoutineDetailPage: React.FC = () => {
    const { routineId } = useParams<{ routineId: string }>();

    return (
        <RoutineDetailComponent routineId={routineId} popoverTrigger={null}></RoutineDetailComponent>
    );
};

export default RoutineDetailPage;