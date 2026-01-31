import { RouteProp, useFocusEffect, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../utils/navitgation";
import { useCallback, useState } from "react";
import { Exercise } from "../interfaces/exercise";
import { getExercises, saveNewExercise } from "../services/exercise";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, useWindowDimensions, View } from "react-native";
import Fab from "../ui/Fab";
import Card from "../ui/Card";
import { Asset } from "react-native-image-picker";
import { Dropdown } from "react-native-element-dropdown";
import Button from "../ui/Button";
import { pickMedia } from "../services/media";
import VideoPlayer from "../ui/VideoPlayer";

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

export function AddExerciseModal({route}: {route: RouteProp<RootStackParamList, 'Add Exercise'>}) {
  const workout = route.params.workout;
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const [exerciseName, setExerciseName] = useState('');
  const [sets, setSets] = useState(0);
  const [reps, setReps] = useState(0);
  const [weight, setWeight] = useState(0);
  const [weightUnit, setWeightUnit] = useState<'kgs' | 'lbs' | 'plates'>('kgs');
  const [image, setImage] = useState<Asset | undefined>();
  const [imagePreviewVisible, setImagePreviewVisible] = useState(false);
  const [video, setVideo] = useState<Asset | undefined>();
  const navigation = useNavigation();
  return (
    <View style={styles.modal}>
      <View>
        <View style={styles.container}>
          <Text>Exercise name</Text>
          <TextInput onChangeText={(text) => setExerciseName(text)} style={styles.textInput} />
        </View>
        <View style={styles.row}>
          <View style={styles.rowChild}>
            <Text>Sets</Text>
            <TextInput inputMode='numeric' onChangeText={text => setSets(parseInt(text, 10))} style={styles.textInput} />
          </View>
          <View style={styles.rowChild}>
            <Text>Reps</Text>
            <TextInput inputMode='numeric' onChangeText={text => setReps(parseInt(text, 10))} style={styles.textInput} />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.rowChild}>
            <Text>Weight</Text>
            <TextInput inputMode='numeric' onChangeText={text => setWeight(parseInt(text, 10))} style={styles.textInput} />
          </View>
          <View style={[styles.container, styles.rowChild]}>
            <Text>Weight unit</Text>
            <Dropdown 
              mode='modal' 
              data={[{label: 'kgs'}, {label: 'lbs'}, {label: 'plates'}]}
              labelField='label'
              valueField='label'
              onChange={selection => setWeightUnit(selection)}
              style={styles.textInput}
              value={weightUnit}
              selectedTextStyle={styles.textInput}
            />
          </View>
        </View>
        <View>
          <Text>
            Image for exercise (optional)
          </Text>
          {image? 
            <TouchableOpacity onPress={() => setImagePreviewVisible(true)}>
              <Image resizeMode='contain' source={{uri: image.uri}} width={200} height={100}/>
            </TouchableOpacity>:
            <Button title='choose image...' onPress={() => pickMedia('photo').then(picked => setImage(picked)).then(() => setImagePreviewVisible(true))} />
          }
        </View>
        <View>
          <Text>
            Video for exercise (optional)
          </Text>
          {video?
            <VideoPlayer uri={video.uri!} />:
            <Button title='choose video...' onPress={() => pickMedia('video').then(picked => setVideo(picked))} />
          }
        </View>
        <Modal 
          animationType='slide' 
          backdropColor={'black'} 
          visible={imagePreviewVisible}
          onRequestClose={() => setImagePreviewVisible(false)}
          style={styles.imageModal}
        >
          <View style={styles.imageContainer}>
            <Image resizeMode='contain' source={{uri: image?.uri}} width={screenWidth * 0.9} height={Math.min(image?.height!, screenHeight * 0.7)} />
          </View>
          <View style={styles.row}>
            <View style={styles.rowChild}>
              <Button title='pick another photo' onPress={() => pickMedia('photo').then(picked => setImage(picked))} />
            </View>
            <View style={styles.rowChild}>
              <Button title='ok' onPress={() => setImagePreviewVisible(false)} align="centered" />
            </View>
          </View>
        </Modal>
      </View>
      <Button onPress={() => {
        if(exerciseName.length < 3) return;
        saveNewExercise(workout.workoutId, {title: exerciseName, sets, reps, weight, weightUnit}, image, video);
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
  imageModal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imageContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    maxWidth: '100%',
    flexWrap: 'wrap'
  },
  rowChild: {
    flexGrow: 1
  },
  video: {
    width: '100%',
    height: 200,
  },
  exerciseCard: {
    width: '50%'
  }
});