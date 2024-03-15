export interface Routine {
    routineId: number;
    name: string;
    description: string;
    visibility: 'PUBLIC' | 'PRIVATE' | '';
    created: string;
    exercises: RoutineExercise[];
}

export interface RoutineExercise {
    routineExerciseId: number;
    order?: number;
    repetitions?: number;
    sets?: number;
    restingTime?: number;
    exerciseId: number;
    name: string;
    description?: string;
    categoryType?: string;
    bodyPartFocus?: string;
    difficultyLevel?: string;
    equipmentNeeded?: string;
}
