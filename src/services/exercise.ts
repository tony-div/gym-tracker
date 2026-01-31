import { db, runQuery, ExerciseEntity, WorkoutEntity } from "./sqlite";
import { Exercise } from "../interfaces/exercise";
import { Asset } from "react-native-image-picker";
import { DocumentDirectoryPath, moveFile } from "@dr.pogodin/react-native-fs";
import { unlink } from "@dr.pogodin/react-native-fs";

export const getExercises = async (workoutId: string) => {
  try {
     const exercisesRes = await runQuery<ExerciseEntity>(`
        SELECT e.* 
        FROM exercises e
        JOIN workout_exercise we ON e.exercise_id = we.exercise_id
        WHERE we.workout_id = ?
     `, [workoutId]);

     return exercisesRes.map<Exercise>(row => ({
         title: row.exercise_name,
         imagePath: row.image_uri ?? undefined,
         videoPath: row.video_uri ?? undefined,
         sets: row.sets,
         reps: row.reps,
         weight: row.weight,
         weightUnit: row.weight_unit
     }));
  } catch (e) {
      console.error(e);
      return [];
  }
}

export const saveNewExercise = async (workoutName: string, exercise: Exercise, image?: Asset, video?: Asset) => {
  if(image) {
    const imageDestPath = `file://${DocumentDirectoryPath}/${image?.fileName}`;
    await moveFile(image.uri!, imageDestPath); 
    exercise.imagePath = imageDestPath;
  }
  if(video) {
    const videoDestPath = `file://${DocumentDirectoryPath}/${video?.fileName}`;
    await moveFile(video.uri!, videoDestPath);
    exercise.videoPath = videoDestPath;
  }

  try {
     const workoutRes = await runQuery<Pick<WorkoutEntity, 'workout_id'>>('SELECT workout_id FROM workouts WHERE workout_name = ?', [workoutName]);
     if (!workoutRes.length) {
         console.error("Workout not found");
         return [];
     }
     const workoutId = workoutRes[0].workout_id;

     const insertRes = await db.execute(
       'INSERT INTO exercises (exercise_name, image_uri, video_uri, sets, reps, weight, weight_unit) VALUES (?, ?, ?, ?, ?, ?, ?)',
       [exercise.title, exercise.imagePath ?? null, exercise.videoPath ?? null, exercise.sets, exercise.reps, exercise.weight, exercise.weightUnit]
     );
     const exerciseId = insertRes.insertId;

     await db.execute('INSERT INTO workout_exercise (workout_id, exercise_id) VALUES (?, ?)', [workoutId, exerciseId!]);
  } catch (e) {
      console.error(e);
  }
}

export const deleteExercise = async (exerciseId: number) => {
  try {
    const exerciseRes = await runQuery<Pick<ExerciseEntity, 'image_uri' | 'video_uri'>>(
      'SELECT image_uri, video_uri FROM exercises WHERE exercise_id = ?',
      [exerciseId]
    );

    if (exerciseRes.length > 0) {
      const { image_uri, video_uri } = exerciseRes[0];

      if (image_uri) {
        try {
            await unlink(image_uri);
        } catch (err) {
            console.warn(`Failed to delete image at ${image_uri}`, err);
        }
      }
      if (video_uri) {
        try {
            await unlink(video_uri);
        } catch (err) {
             console.warn(`Failed to delete video at ${video_uri}`, err);
        }
      }
    }

    await db.execute('DELETE FROM workout_exercise WHERE exercise_id = ?', [exerciseId]);
    await db.execute('DELETE FROM exercises WHERE exercise_id = ?', [exerciseId]);
  } catch (e) {
    console.error("Error deleting exercise:", e);
    throw e;
  } 
}

export const unlinkExercise = async (workoutId: number, exerciseId: number) => {
  try {
    await db.execute(
      'DELETE FROM workout_exercise WHERE workout_id = ? AND exercise_id = ?',
      [workoutId, exerciseId]
    );
    } catch (e) {
    console.error("Error unlinking exercise from workout:", e);
    throw e;
    }
}