import React from 'react';
import { RoutineLogItem } from '../../../../Interfaces/RoutineLogItem';
import { Link } from 'react-router-dom';
import './RoutineLog.css';

interface RoutineLogProps {
    completedRoutines: RoutineLogItem[];
    currentMonth: number;
    currentYear: number;
    selectedDate: string | null;
    selectedId: string | null;
    clearFilters: () => void;
}

const RoutineLog: React.FC<RoutineLogProps> = ({ completedRoutines, currentMonth, currentYear, selectedDate, selectedId, clearFilters }) => {
    const filteredRoutines = completedRoutines.filter(routine => {
        if (selectedDate && selectedId) {
            return routine.routineLogId.toString() === selectedId;
        }

        if (selectedDate && !selectedId) {
            return routine.date === selectedDate;
        }

        if (!selectedDate && !selectedId) {
            const routineDate = new Date(routine.date);
            const routineMonth = routineDate.getMonth() + 1;
            const routineYear = routineDate.getFullYear();
            return routineMonth === currentMonth && routineYear === currentYear;
        }

        return false; // Ensure a boolean is returned for all paths
    });

    const renderNoRoutinesMessage = () => {
        if (selectedDate) {
            return <p className="routine-entry no-routines">No routines completed on this day.</p>;
        }
        return <p className="routine-entry no-routines">No routines completed in this month.</p>;
    };

    // Determine if the clear filters button should be disabled
    const isClearFiltersDisabled = !selectedDate && !selectedId;

    return (
        <div className="routine-log-container">
            <div className="routine-log-box">
                <div className="btn-container">
                    <button onClick={clearFilters} className="clear-filters-btn" disabled={isClearFiltersDisabled}>Clear Filters</button> { }
                </div>

                {filteredRoutines.length > 0 ? (
                    filteredRoutines.map((routine) => (
                        <div key={routine.routineLogId} className="routine-entry">
                            <Link to={`/routine-details/${routine.routineLogId}`}>
                                <div className="name-date-container">
                                    <p className="name">{routine.name}</p>
                                    <p className="date">Completed: {new Date(routine.date + 'T00:00:00').toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="description">{routine.description}</p>
                                </div>
                            </Link>
                        </div>
                    ))
                ) : (
                    renderNoRoutinesMessage()
                )}
            </div>
        </div>
    );
};

export default RoutineLog;
