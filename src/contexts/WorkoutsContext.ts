import { createContext } from "react";

export const WorkoutsContext = createContext<string[]>([]);
export const SetWorkoutsContext = createContext<(workouts: string[]) => void>(() => {});