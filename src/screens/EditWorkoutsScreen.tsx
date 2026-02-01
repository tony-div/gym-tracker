import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../utils/navitgation";
import { useCallback, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import ButtonWitToolBar from "../ui/ButtonWithToolBar";
import Button from "../ui/Button";
import { Workout } from "../interfaces/workout";
import { deleteWorkout, getWorkouts } from "../services/workout";
import { Modal } from "react-native";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditWorkoutsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [workouts, setWorkouts] = useState<Workout[]>();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [workoutToDelete, setWorkoutToDelete] = useState<Workout | null>(null);
  useFocusEffect(useCallback(() => {
    getWorkouts().then(result => setWorkouts(result));
  }, []));
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.screen}>
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center'
  },
  modal: {
  display: 'flex',
  height: '100%',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: 10
  },
  container: {
    display: 'flex',
    padding: 1,
  },
})