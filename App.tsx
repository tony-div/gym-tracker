import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, RouteProp, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome6 } from "@react-native-vector-icons/fontawesome6";
import { useState, useContext } from 'react';
import { SetWorkoutsContext, WorkoutsContext } from './src/contexts/WorkoutsContext';

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
        <TouchableOpacity onPress={() => navigation.navigate("Add Workout")}>
          <Text>
            <FontAwesome6 name="plus" size={30} color="#000" iconStyle='solid' />
          </Text>
        </TouchableOpacity>
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
      <TouchableOpacity style={styles.button} onPress={() => {
        if(workoutName.length < 3) return;
        saveNewWorkout(workoutName).then(workouts => setWorkouts(workouts));
        navigation.goBack();
      }}>
        <View>
          <Text style={styles.buttonText}>submit</Text>
        </View>
      </TouchableOpacity>
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

function Button({title, onPress}: {title: string, onPress: () => void}) {
  return <TouchableOpacity style={styles.card} onPress={onPress}>
    <Text>
      {title}
    </Text>
  </TouchableOpacity>;
}

function Card({title, imagePath, onPress}: {title: string, imagePath: string, onPress: () => void}) {
  return <TouchableOpacity style={styles.card} onPress={onPress}>
    <View>
      <Image source={{ uri: imagePath }} style={styles.cardImage} />
    </View>
    <Text>
      {title}
    </Text>
  </TouchableOpacity>
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
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    margin: 10,
    shadowColor: '#000',
  },
  fab: {
    position: 'absolute',
    bottom: 70,
    right: 30,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#fff'
  },
  textInput: {
    width: '95%',
    margin: 10,
    backgroundColor: '#373737',
    color: '#fff',
    fontSize: 15,
    borderRadius: 10,
  },
  button: {
    width: '95%',
    margin: 10,
    backgroundColor: '#fff',
    fontSize: 15,
    borderRadius: 10,
    textAlign: 'center',
    padding: 10,
    justifyContent: 'center'
  },
  buttonText: {
    textAlign: 'center'
  },
  modal: {
    display: 'flex',
    height: '90%',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  cardImage: {
    width: 150,
    height: 75
  }
});

export default function App() {
  const [workouts, setWorkouts] = useState<string[]>([]);
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