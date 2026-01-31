import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Exercise } from "../interfaces/exercise";
import { Workout } from "../interfaces/workout";

export type RootStackParamList = {
  'Home': undefined;
  'Workout': { title: string };
  'Add Workout': undefined;
  'Edit Workout': { workout: Workout};
  'Edit Workouts': undefined;
  'Add Exercise': { workout: string };
  'Exercise': { exercise: Exercise };
};

export const Stack = createNativeStackNavigator<RootStackParamList>();
