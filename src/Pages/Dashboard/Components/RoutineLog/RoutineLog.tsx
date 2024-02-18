// CompletedRoutinesList.js
import React from 'react';

import { Routine } from '../../../../Interfaces/Routine';
import './RoutineLog.css';

const RoutineLog = ({ completedRoutines }: { completedRoutines: Routine[] }) => {
    return (
        <div className="routine-log-container">
            <div className="routine-log-box">
                {completedRoutines.map((routine) => (
                    <div key={routine.routineLogId} className="routine-entry">
                        <div className="name-date-container">
                            <p className="name">{routine.name}</p>
                            <p className="date">Date: {new Date(routine.date).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="description">{routine.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RoutineLog;
