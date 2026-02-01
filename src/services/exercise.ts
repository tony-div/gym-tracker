import { db, runQuery, ExerciseEntity } from "./sqlite";
import { Exercise } from "../interfaces/exercise";
import { Asset } from "react-native-image-picker";
import { DocumentDirectoryPath, moveFile } from "@dr.pogodin/react-native-fs";
import { unlink } from "@dr.pogodin/react-native-fs";

export const getExercises = async (workoutId: number) => {
  try {
     const exercisesRes = await runQuery<ExerciseEntity>(`
        SELECT e.* 
        FROM exercises e
        JOIN workout_exercise we ON e.exercise_id = we.exercise_id
        WHERE we.workout_id = ?
     `, [workoutId]);

     return exercisesRes.map<Exercise>(row => ({
      exerciseId: row.exercise_id,
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

export const saveNewExercise = async (workoutId: number, exercise: Omit<Exercise, 'exerciseId'>, image?: Asset, video?: Asset) => {
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

export const updateExercise = async (exercise: Exercise, image?: Asset, video?: Asset) => {
  try {
    const currentData = await runQuery<ExerciseEntity>(
      'SELECT * FROM exercises WHERE exercise_id = ?',
      [exercise.exerciseId]
    );

    if (currentData.length === 0) return;

    const existingExercise = currentData[0];
    let finalImageUri = image?.uri ?? null;
    let finalVideoUri = video?.uri ?? null;

    if (image && image.uri !== existingExercise.image_uri) {
      if (existingExercise.image_uri) {
        try {
          await unlink(existingExercise.image_uri);
        } catch (e) {
          console.warn("Failed to delete old image", e);
        }
      }
      const imageDestPath = `file://${DocumentDirectoryPath}/${image.fileName}`;
      await moveFile(image.uri!, imageDestPath);
      finalImageUri = imageDestPath;
    }

    if (video && video.uri !== existingExercise.video_uri) {
      if (existingExercise.video_uri) {
        try {
          await unlink(existingExercise.video_uri);
        } catch (e) {
          console.warn("Failed to delete old video", e);
        }
      }
      const videoDestPath = `file://${DocumentDirectoryPath}/${video.fileName}`;
      await moveFile(video.uri!, videoDestPath);
      finalVideoUri = videoDestPath;
    } 
    await db.execute(
      `UPDATE exercises 
       SET exercise_name = ?, image_uri = ?, video_uri = ?, sets = ?, reps = ?, weight = ?, weight_unit = ?
       WHERE exercise_id = ?`,
      [
        exercise.title,
        finalImageUri,
        finalVideoUri,
        exercise.sets,
        exercise.reps,
        exercise.weight,
        exercise.weightUnit,
        exercise.exerciseId
      ]
    );
  } catch (e) {
    console.error("Error updating exercise:", e);
    throw e;
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