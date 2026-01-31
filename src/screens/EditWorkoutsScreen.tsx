import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../utils/navitgation";
import { useCallback, useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import ButtonWitToolBar from "../ui/ButtonWithToolBar";
import Button from "../ui/Button";
import { Workout } from "../interfaces/workout";
import { deleteWorkout, getWorkouts, renameWorkout } from "../services/workout";
import { Modal } from "react-native";

export default function EditWorkoutsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [workouts, setWorkouts] = useState<Workout[]>();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [workoutToDelete, setWorkoutToDelete] = useState<Workout | null>(null);
  useFocusEffect(useCallback(() => {
    getWorkouts().then(result => setWorkouts(result));
  }, []));
  return <View style={styles.screen}>
    {workouts && workouts.map(workout => (

      <ButtonWitToolBar 
        key={workout.workoutId} 
        title={workout.workoutName} 
        tools={[
          { 
            iconName: 'pen', 
            onPress: () => { navigation.navigate('Edit Workout', { workout: {workoutId: workout.workoutId, workoutName: workout.workoutName } }); } 
          },
          {
            iconName: 'trash',
            onPress: () => {
              setIsDeleteModalVisible(true);
              setWorkoutToDelete(workout);
            }
          }
        ]} />))}
        <Modal visible={isDeleteModalVisible} backdropColor={'black'} animationType="slide">
          <View style={styles.modal}>
            <View style={styles.container}>
              <Text>Are you sure you want to delete the workout "{workoutToDelete?.workoutName}"?</Text>
            </View>
            <Button onPress={() => {
              setIsDeleteModalVisible(false);
              setWorkoutToDelete(null);
            }} title='Cancel' />
            <Button onPress={() => {
              deleteWorkout(workoutToDelete!.workoutId).then(() => {
                getWorkouts().then(result => setWorkouts(result));
                setIsDeleteModalVisible(false);
                setWorkoutToDelete(null);
              });
            }} title='Delete' />
          </View>
        </Modal>
  </View>;
}

export function EditWorkoutModal({route}: {route: {params: {workout: Workout}}}) {
  const [workoutName, setWorkoutName] = useState(route.params.workout.workoutName);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <View style={styles.modal}>
      <View style={styles.container}>
        <TextInput placeholder='workout name' onChangeText={(text) => setWorkoutName(text)} style={styles.textInput} value={workoutName} />
      </View>
      <Button onPress={() => {
        if(workoutName.length < 3) return;
        renameWorkout(route.params.workout.workoutId, workoutName).then(() => {
          navigation.goBack();
        });
      }} title='submit' align="centered"/>
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
  dialog: {
    display: 'flex',
    height: '50%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: 'grey',
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