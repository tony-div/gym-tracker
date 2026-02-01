import { RouteProp, useFocusEffect } from "@react-navigation/native";
import { RootStackParamList } from "../utils/navitgation";
import { useCallback, useState } from "react";
import { Asset } from "react-native-image-picker";
import { useNavigation } from "@react-navigation/native";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { pickMedia } from "../services/media";
import Button from "../ui/Button";
import VideoPlayer from "../ui/VideoPlayer";
import ImagePreview from "../ui/ImagePreview";
import { deleteExercise, getExercises, updateExercise } from "../services/exercise";
import ButtonWitToolBar from "../ui/ButtonWithToolBar";
import { Exercise } from "../interfaces/exercise";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { unlink } from "@dr.pogodin/react-native-fs";

export default function EditExercisesScreen({route}: {route: RouteProp<RootStackParamList, 'Edit Exercises'>}) {
  const workout = route.params.workout;
  const [exercises, setExercises] = useState<Exercise[]>([]);
    useFocusEffect(useCallback(() => {
      getExercises(workout.workoutId).then(setExercises);
    }, [setExercises, workout]));
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <View style={styles.container}>
      {exercises.map(exercise => (
        <ButtonWitToolBar 
          key={exercise.exerciseId}
          title={exercise.title}
          tools={[
            { 
              iconName: 'pen', 
              onPress: () => {navigation.navigate('Edit Exercise', { exercise })} 
            },
            {
              iconName: 'trash',
              onPress: () => {deleteExercise(exercise.exerciseId).then(() => {
                getExercises(workout.workoutId).then(setExercises);
              })}
            }
          ]}
        />
      ))}
    </View>
  )
}

export function EditExerciseScreen({route}: {route: RouteProp<RootStackParamList, 'Edit Exercise'>}) {
  const exercise = route.params.exercise;
  const [exerciseName, setExerciseName] = useState(exercise.title);
  const [sets, setSets] = useState<string>(exercise.sets.toString());
  const [reps, setReps] = useState<string>(exercise.reps.toString());
  const [weight, setWeight] = useState<string>(exercise.weight.toString());
  const [weightUnit, setWeightUnit] = useState<'kgs' | 'lbs' | 'plates'>(exercise.weightUnit);
  const [image, setImage] = useState<Asset | undefined>(exercise.imagePath ? {uri: exercise.imagePath} : undefined);
  const [imagePreviewVisible, setImagePreviewVisible] = useState(false);
  const [video, setVideo] = useState<Asset | undefined>(exercise.videoPath ? {uri: exercise.videoPath} : undefined);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <View style={styles.modal}>
      <View>
        <View style={styles.container}>
          <Text>Exercise name</Text>
          <TextInput value={exerciseName} onChangeText={(text) => setExerciseName(text)} style={styles.textInput} />
        </View>
        <View style={styles.row}>
          <View style={styles.rowChild}>
            <Text>Sets</Text>
            <TextInput inputMode='numeric' value={sets.toString()} onChangeText={text => setSets(text)} style={styles.textInput} />
          </View>
          <View style={styles.rowChild}>
            <Text>Reps</Text>
            <TextInput inputMode='numeric' value={reps.toString()} onChangeText={text => setReps(text)} style={styles.textInput} />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.rowChild}>
            <Text>Weight</Text>
            <TextInput inputMode='numeric' value={weight.toString()} onChangeText={text => setWeight(text)} style={styles.textInput} />
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
            <>
              <VideoPlayer uri={video.uri!} />
              <View style={styles.row}>
                <Button title='choose another video...' onPress={() => pickMedia('video').then(picked => setVideo(picked))} />
                <Button title='delete video' onPress={() => {setVideo(undefined); unlink(video?.uri!);}} />
              </View>
            </>:
            <Button title='choose video...' onPress={() => pickMedia('video').then(picked => setVideo(picked))} />
          }
        </View>
        <ImagePreview 
          visible={imagePreviewVisible} 
          onRequestClose={() => setImagePreviewVisible(false)} 
          imageUri={image?.uri!}
          pickAnotherHandler={() => pickMedia('photo').then(picked => setImage(picked))}
          deleteHandler={() => {setImage(undefined); setImagePreviewVisible(false); unlink(image?.uri!);}}
        />
      </View>
      <Button onPress={() => {
        if(exerciseName.length < 3) return;
        updateExercise({
          exerciseId: exercise.exerciseId,
          title: exerciseName,
          sets: parseInt(sets, 10),
          reps: parseInt(reps, 10),
          weight: parseInt(weight, 10),
          weightUnit,
        }, image, video);
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
  exerciseCard: {
    width: '50%'
  }
});