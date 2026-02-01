import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../utils/navitgation";
import { useCallback, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import Fab from "../ui/Fab";
import Button from "../ui/Button";
import { getWorkouts } from "../services/workout";
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
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return <Button iconSize='small' iconName='pen' onPress={() => navigation.navigate('Edit Workouts')} />;
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
})