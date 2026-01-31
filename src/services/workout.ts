import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveNewWorkout = async (workoutName: string) => {
  const days = await AsyncStorage.getItem('days');
  let workouts = [];
  if(days != null) {
    workouts = JSON.parse(days);
  }
  workouts.push(workoutName);
  AsyncStorage.setItem('days', JSON.stringify(workouts));
  return workouts;
}