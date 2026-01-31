import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Exercise } from "../interfaces/exercise";
import { Workout } from "../interfaces/workout";

export type RootStackParamList = {
  'Home': undefined;
  'Workout': { workout: Workout };
  'Add Workout': undefined;
  'Edit Workout': { workout: Workout};
  'Edit Workouts': undefined;
  'Add Exercise': { workout: Workout };
  'Exercise': { exercise: Exercise };
};

export const Stack = createNativeStackNavigator<RootStackParamList>();
