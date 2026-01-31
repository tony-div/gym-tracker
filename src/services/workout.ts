import { Workout } from "../interfaces/workout";
import { db, runQuery, WorkoutEntity } from "./sqlite";

export const getWorkouts = async () => {
  try {
    const results = await runQuery<WorkoutEntity>('SELECT workout_id, workout_name FROM workouts');
    return results.map<Workout>(r => {return {workoutId: r.workout_id, workoutName: r.workout_name};});
  } catch (e) {
    console.error(e);
    return [];
  }
}

export const saveNewWorkout = async (workoutName: string) => {
  try {
    await db.execute('INSERT INTO workouts (workout_name) VALUES (?)', [workoutName]);
    return await getWorkouts();
  } catch (e) {
    console.error('Error saving workout:', e);
    return [];
  }
}

export const renameWorkout = async (workoutId: number, newName: string) => {
  try {
    const query = `UPDATE workouts SET workout_name = ? WHERE workout_id = ?`;
    await db.execute(query, [newName, workoutId]);
    return await getWorkouts();
  } catch (e) {
    console.error('Error renaming workout:', e);
    return [];
  }
}

export const deleteWorkout = async (workoutId: number) => {
  try {
    await db.execute('DELETE FROM workout_exercise WHERE workout_id = ?', [workoutId]);
    await db.execute('DELETE FROM workouts WHERE workout_id = ?', [workoutId]);
  } catch (e) {
    console.error('Error deleting workout:', e);
  }
}