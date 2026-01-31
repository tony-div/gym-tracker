import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../utils/navitgation";
import { useCallback, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";
import ButtonWitToolBar from "../ui/ButtonWithToolBar";
import Button from "../ui/Button";
import { Workout } from "../interfaces/workout";
import { getWorkouts } from "../services/workout";

export default function EditWorkoutsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [workouts, setWorkouts] = useState<Workout[]>();
  useFocusEffect(useCallback(() => {
    getWorkouts().then(result => setWorkouts(result));
  }, []));
  return <View style={styles.screen}>
    {workouts && workouts.map(workout => <ButtonWitToolBar key={workout.workoutId} title={workout.workoutName} tools={[{ iconName: 'pen', onPress: () => { navigation.navigate('Edit Workout')} }]} />)}
  </View>;
}

export function EditWorkoutModal() {
  const [workoutName, setWorkoutName] = useState('');
  const navigation = useNavigation();
  return (
    <View style={styles.modal}>
      <View style={styles.container}>
        <TextInput placeholder='workout name' onChangeText={(text) => setWorkoutName(text)} style={styles.textInput} />
      </View>
      <Button onPress={() => {
        if(workoutName.length < 3) return;
        
        navigation.goBack();
      }} title='submit' />
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center'
  },
  modal: {
  display: 'flex',
  height: '90%',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: 10
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
})