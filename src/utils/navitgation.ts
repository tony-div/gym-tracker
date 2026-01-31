import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Exercise } from "../contexts/ExercisesContext";

export type RootStackParamList = {
  'Home': undefined;
  'Workout': { title: string };
  'Add Workout': undefined;
  'Edit Workout': undefined;
  'Edit Workouts': undefined;
  'Add Exercise': { workout: string };
  'Exercise': { exercise: Exercise };
};

export const Stack = createNativeStackNavigator<RootStackParamList>();
