import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { SetWorkoutsContext, WorkoutsContext } from './src/contexts/WorkoutsContext';
import { Exercise, ExercisesContext, SetExercisesContext } from './src/contexts/ExercisesContext';
import HomeScreen, { AddWorkoutModal, HomeEditButton } from './src/screens/HomeScreen';
import EditWorkoutsScreen from './src/screens/EditWorkoutsScreen';
import { Stack } from './src/utils/navitgation';
import WorkoutScreen, { AddExerciseModal } from './src/screens/WorkoutScreen';
import ExerciseScreen from './src/screens/ExerciseScreen';

function RootStack() {
  return (
    <Stack.Navigator>
      <Stack.Group>
        <Stack.Screen name="Home" component={HomeScreen} options={{
          headerRight: HomeEditButton
        }} />
        <Stack.Screen name="Workout" component={WorkoutScreen} options={({ route }) => ({
          title: route.params.title || "Day"
        })}/>
        <Stack.Screen name="Exercise" component={ExerciseScreen} options={({ route }) => ({
          title: route.params.exercise.title || "Exercise"
        })} />
        <Stack.Screen name="Edit Workouts" component={EditWorkoutsScreen} />
      </Stack.Group>
      <Stack.Group screenOptions={{presentation: 'modal'}}>
        <Stack.Screen name='Add Workout' component={AddWorkoutModal} />
        <Stack.Screen name='Edit Workout' component={AddWorkoutModal} />
        <Stack.Screen name='Add Exercise' component={AddExerciseModal} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

export default function App() {
  const [workouts, setWorkouts] = useState<string[]>([]);
  AsyncStorage.getItem('days')
  .then(string => string? JSON.parse(string): [])
  .then(object => setWorkouts(object))
  const [exercises, setExercises] = useState<Exercise[]>([]);
  return (
    <SafeAreaProvider>
      <WorkoutsContext value={workouts}>
        <SetWorkoutsContext value={setWorkouts}>
          <ExercisesContext value={exercises}>
            <SetExercisesContext value={setExercises}>
              <NavigationContainer>
                <RootStack/>
              </NavigationContainer>
            </SetExercisesContext>
          </ExercisesContext>
        </SetWorkoutsContext>
      </WorkoutsContext>
    </SafeAreaProvider>
  );
}