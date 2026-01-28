import { View, Text, StyleSheet, TextInput } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, RouteProp, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useContext } from 'react';
import { SetWorkoutsContext, WorkoutsContext } from './src/contexts/WorkoutsContext';
import Button from './src/ui/Button';

type RootStackParamList = {
  'Home': undefined;
  'Workout': { title: string };
  'Add Workout': undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootStack() {
  return (
    <Stack.Navigator>
      <Stack.Group>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Workout" component={WorkoutScreen} options={({ route }) => ({
          title: route.params.title || "Day"
        })}/>
      </Stack.Group>
      <Stack.Group screenOptions={{presentation: 'modal'}}>
        <Stack.Screen name='Add Workout' component={AddWorkoutModal}/>
      </Stack.Group>
    </Stack.Navigator>
  );
}

function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  let workouts = useContext(WorkoutsContext);
  return (
    <>
      <View style={styles.home}>
        {workouts.map(workout => <Button key={workout} title={workout} onPress={() => navigation.navigate('Workout', { 'title': workout })} />)}
      </View>
      <View style={styles.fab}>
        <Button onPress={() => navigation.navigate("Add Workout")} iconName='plus' />
      </View>
    </>
  );
}

function AddWorkoutModal() {
  const [workoutName, setWorkoutName] = useState('');
  const setWorkouts = useContext(SetWorkoutsContext);
  const navigation = useNavigation();
  return (
    <View style={styles.modal}>
      <View style={styles.container}>
        <TextInput placeholder='workout name' onChangeText={(text) => setWorkoutName(text)} style={styles.textInput} />
      </View>
      <Button onPress={() => {
        if(workoutName.length < 3) return;
        saveNewWorkout(workoutName).then(workouts => setWorkouts(workouts));
        navigation.goBack();
      }} title='submit' />
    </View>
  )
}

const saveNewWorkout = async (workoutName: string) => {
  const days = await AsyncStorage.getItem('days');
  let workouts = [];
  if(days != null) {
    workouts = JSON.parse(days);
  }
  workouts.push(workoutName);
  AsyncStorage.setItem('days', JSON.stringify(workouts));
  return workouts;
}

function WorkoutScreen({route}: {route: RouteProp<RootStackParamList, 'Workout'>}) {
  const workout = route.params.title;
  return (
    <View style={styles.container}>
      <Text>{workout} Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    padding: 1,
  },
  home: {
    flex: 1,
    justifyContent: 'center'
  },
  fab: {
    position: 'absolute',
    bottom: 70,
    right: 30,
  },
  textInput: {
    width: '95%',
    margin: 10,
    backgroundColor: '#373737',
    color: '#fff',
    fontSize: 15,
    borderRadius: 10,
  },
  modal: {
    display: 'flex',
    height: '90%',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
});

export default function App() {
  const [workouts, setWorkouts] = useState<string[]>([]);
  AsyncStorage.getItem('days')
  .then(string => string? JSON.parse(string): [])
  .then(object => setWorkouts(object))
  return (
    <SafeAreaProvider>
      <WorkoutsContext value={workouts}>
        <SetWorkoutsContext value={setWorkouts}>
          <NavigationContainer>
            <RootStack />
          </NavigationContainer>
        </SetWorkoutsContext>
      </WorkoutsContext>
    </SafeAreaProvider>
  );
}