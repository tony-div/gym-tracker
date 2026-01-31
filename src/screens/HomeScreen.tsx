import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../utils/navitgation";
import { useContext, useState } from "react";
import { SetWorkoutsContext, WorkoutsContext } from "../contexts/WorkoutsContext";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, TextInput, View } from "react-native";
import Fab from "../ui/Fab";
import Button from "../ui/Button";
import { saveNewWorkout } from "../services/workout";

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  let workouts = useContext(WorkoutsContext);
  return (
    <>
      <View style={styles.home}>
        {workouts.map(workout => <Button key={workout} title={workout} onPress={() => navigation.navigate('Workout', { 'title': workout })} />)}
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