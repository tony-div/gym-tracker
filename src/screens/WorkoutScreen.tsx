import { RouteProp, useFocusEffect, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../utils/navitgation";
import { useCallback, useState } from "react";
import { Exercise } from "../interfaces/exercise";
import { getExercises } from "../services/exercise";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StyleSheet, View } from "react-native";
import Fab from "../ui/Fab";
import Card from "../ui/Card";
import Button from "../ui/Button";
import { Workout } from "../interfaces/workout";

export default function WorkoutScreen({route}: {route: RouteProp<RootStackParamList, 'Workout'>}) {
  const workout = route.params.workout;
  const [exercises, setExercises] = useState<Exercise[]>([]);
  useFocusEffect(useCallback(() => {
    getExercises(workout.workoutId).then(setExercises);
  }, [setExercises, workout]));
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <>
      <View style={[styles.container, styles.row]}>
        {exercises.map(exercise => {
          return <View key={exercise.title} style={styles.exerciseCard}>
            <Card 
            key={exercise.title}
            title={exercise.title} 
            imagePath={exercise.imagePath} 
            onPress={() => navigation.navigate("Exercise", { exercise })} 
          />
          </View>
        })}
      </View>
      <Fab onPress={() => navigation.navigate("Add Exercise", {workout})} iconName='plus' />
    </>
  );
}

export function WorkoutEditButton({workout}: {workout: Workout}) {
  const naviagation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return <Button iconSize='small' iconName='pen' onPress={() => naviagation.navigate("Edit Exercises", {workout})} />;
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    padding: 1,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    maxWidth: '100%',
    flexWrap: 'wrap'
  },
  exerciseCard: {
    width: '50%'
  }
});