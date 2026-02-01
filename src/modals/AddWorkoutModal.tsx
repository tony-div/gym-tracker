import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, TextInput, View } from "react-native";
import Button from "../ui/Button";
import { saveNewWorkout } from "../services/workout";

export default function AddWorkoutModal() {
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