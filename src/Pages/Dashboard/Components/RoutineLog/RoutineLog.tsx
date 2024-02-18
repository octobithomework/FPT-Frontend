// CompletedRoutinesList.js
import React from 'react';
import { Routine } from '../../../../Interfaces/Routine';
import './RoutineLog.css';

interface RoutineLogProps {
    completedRoutines: Routine[];
    currentMonth: number;
    currentYear: number;
    selectedDate: string | null;
}

const RoutineLog: React.FC<RoutineLogProps> = ({ completedRoutines, currentMonth, currentYear, selectedDate }) => {
    const filteredRoutines = completedRoutines.filter(routine => {
        console.log(routine.date)
        if (selectedDate) {
            return routine.date === selectedDate;
        }
        const routineDate = new Date(routine.date);
        const routineMonth = routineDate.getMonth() + 1;
        const routineYear = routineDate.getFullYear();
        return routineMonth === currentMonth && routineYear === currentYear;
    });

    return (
        <div className="routine-log-container">
            <div className="routine-log-box">
                {filteredRoutines.length > 0 ? (
                    filteredRoutines.map((routine) => (
                        <div key={routine.routineLogId} className="routine-entry">
                            <div className="name-date-container">
                                <p className="name">{routine.name}</p>
                                <p className="date">{new Date(routine.date + 'T00:00:00').toLocaleDateString()}</p>
                            </div>
                            <div>
                                <p className="description">{routine.description}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="routine-entry no-routines">No routines completed in this month.</p>
                )}
            </div>
        </div>
    );
};

export default RoutineLog;
