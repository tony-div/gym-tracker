import { open } from '@op-engineering/op-sqlite';

export const db = open({
  name: 'workout_tracker.sqlite',
});

export interface WorkoutEntity {
  workout_id: number;
  workout_name: string;
}

export interface ExerciseEntity {
  exercise_id: number;
  exercise_name: string;
  image_uri: string | null;
  video_uri: string | null;
  sets: number;
  reps: number;
  weight: number;
  weight_unit: 'kgs' | 'lbs' | 'plates';
}

export const runQuery = async <T>(query: string, params?: any[]) => {
  const results = await db.execute(query, params);
  const data: T[] = [];
  if (results.rows && results.rows.length > 0) {
    for (let i = 0; i < results.rows.length; i++) {
        data.push(results.rows[i] as T);
    }
  }
  return data;
}

export const initDb = () => {
  db.transaction(async (tx) => {
    tx.execute(`
      CREATE TABLE IF NOT EXISTS workouts (
        workout_id INTEGER PRIMARY KEY AUTOINCREMENT,
        workout_name TEXT NOT NULL
      );
    `);

    tx.execute(`
      CREATE TABLE IF NOT EXISTS exercises (
        exercise_id INTEGER PRIMARY KEY AUTOINCREMENT,
        exercise_name TEXT NOT NULL,
        image_uri TEXT,
        video_uri TEXT,
        sets INTEGER,
        reps INTEGER,
        weight REAL,
        weight_unit TEXT CHECK(weight_unit IN ('kgs', 'lbs', 'plates'))
      );
    `);

    tx.execute(`
      CREATE TABLE IF NOT EXISTS workout_exercise (
        workout_id INTEGER,
        exercise_id INTEGER,
        PRIMARY KEY (workout_id, exercise_id),
        FOREIGN KEY (workout_id) REFERENCES workouts (workout_id) ON DELETE CASCADE,
        FOREIGN KEY (exercise_id) REFERENCES exercises (exercise_id) ON DELETE CASCADE
      );
    `);
  });
};
