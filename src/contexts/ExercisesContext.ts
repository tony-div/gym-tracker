import { createContext } from "react";

export type Exercise = {
  title: string;
  imagePath?: string;
  videoPath?: string;
  sets: number;
  reps: number;
  weight: number;
  weightUnit: 'kgs' | 'lbs' | 'plates';
}

export const ExercisesContext = createContext<Exercise[]>([]);
export const SetExercisesContext = createContext<(exercises: Exercise[]) => void>(() => {});