import { useState } from "react";
import { Workout } from "../interfaces/workout";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../utils/navitgation";
import { TextInput, View } from "react-native";
import Button from "../ui/Button";
import { StyleSheet } from "react-native";
import { renameWorkout } from "../services/workout";
import { SafeAreaView } from "react-native-safe-area-context";

export default function EditWorkoutModal({route}: {route: {params: {workout: Workout}}}) {
  const [workoutName, setWorkoutName] = useState(route.params.workout.workoutName);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <SafeAreaView>
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
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
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
  textInput: {
    margin: 5,
    backgroundColor: '#373737',
    color: '#fff',
    fontSize: 15,
    borderRadius: 10,
    flexGrow: 1,
  },
})