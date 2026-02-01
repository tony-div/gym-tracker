import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { useEffect } from 'react';
import HomeScreen, { AddWorkoutModal, HomeEditButton } from './src/screens/HomeScreen';
import EditWorkoutsScreen, { EditWorkoutModal } from './src/screens/EditWorkoutsScreen';
import { Stack } from './src/utils/navitgation';
import WorkoutScreen, { AddExerciseModal, WorkoutEditButton } from './src/screens/WorkoutScreen';
import ExerciseScreen from './src/screens/ExerciseScreen';
import { initDb } from './src/services/sqlite';
import EditExercisesScreen, { EditExerciseScreen } from './src/screens/EditExercisesScreen';

function RootStack() {
  return (
    <Stack.Navigator>
      <Stack.Group>
        <Stack.Screen name="Home" component={HomeScreen} options={{
          headerRight: HomeEditButton
        }} />
        <Stack.Screen name="Workout" component={WorkoutScreen} options={({ route }) => ({
          title: route.params.workout.workoutName || "Day",
          headerRight: () => <WorkoutEditButton workout={route.params.workout} />
        })} />
        <Stack.Screen name="Exercise" component={ExerciseScreen} options={({ route }) => ({
          title: route.params.exercise.title || "Exercise"
        })} />
        <Stack.Screen name="Edit Workouts" component={EditWorkoutsScreen} />
      </Stack.Group>
      <Stack.Group screenOptions={{presentation: 'modal'}}>
        <Stack.Screen name='Add Workout' component={AddWorkoutModal} />
        <Stack.Screen name='Edit Workout' component={EditWorkoutModal} />
        <Stack.Screen name='Edit Exercises' component={EditExercisesScreen} options={({ route }) => ({
          title: `Edit Workout: ${route.params.workout.workoutName}`
        })}/>
        <Stack.Screen name='Edit Exercise' component={EditExerciseScreen} />
        <Stack.Screen name='Add Exercise' component={AddExerciseModal} />
      </Stack.Group>
    </Stack.Navigator>
  );
}

export default function App() {
  useEffect(() => {
    initDb();
  }, []);
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootStack/>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}