import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../utils/navitgation";
import { useCallback, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StyleSheet, TextInput, View } from "react-native";
import Fab from "../ui/Fab";
import Button from "../ui/Button";
import { getWorkouts, saveNewWorkout } from "../services/workout";
import { Workout } from "../interfaces/workout";

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [workouts, setWorkouts] = useState<Workout[]>();
  useFocusEffect(useCallback(() => {
    getWorkouts().then(result => setWorkouts(result));
  }, []));
  return (
    <>
      <View style={styles.home}>
        {workouts && workouts.map(workout => <Button key={workout.workoutId} title={workout.workoutName} onPress={() => navigation.navigate('Workout', { workout })} />)}
      </View>
      <Fab onPress={() => navigation.navigate("Add Workout")} iconName='plus' />
    </>
  );
}

export function HomeEditButton() {
  const naviagation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return <Button iconSize='small' iconName='pen' onPress={() => naviagation.navigate('Edit Workouts')} />;
}

export function AddWorkoutModal() {
  const [workoutName, setWorkoutName] = useState('');
  const navigation = useNavigation();
  return (
    <View style={styles.modal}>
      <View style={styles.container}>
        <TextInput placeholder='workout name' onChangeText={(text) => setWorkoutName(text)} style={styles.textInput} />
      </View>
      <Button onPress={() => {
        if(workoutName.length < 3) return;
        saveNewWorkout(workoutName);
        navigation.goBack();
      }} title='submit' align="centered" />
    </View>
  )
}

const styles = StyleSheet.create({
  home: {
    flex: 1,
    justifyContent: 'center'
  },
  container: {
    display: 'flex',
    padding: 1,
  },
  textInput: {
    margin: 5,
    backgroundColor: '#373737',
    color: '#fff',
    fontSize: 15,
    borderRadius: 10,
    flexGrow: 1,
  },
  modal: {
    display: 'flex',
    height: '90%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 10
  },
})