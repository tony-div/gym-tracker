export interface Exercise {
  title: string;
  imagePath?: string;
  videoPath?: string;
  sets: number;
  reps: number;
  weight: number;
  weightUnit: 'kgs' | 'lbs' | 'plates';
}