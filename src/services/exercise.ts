import AsyncStorage from "@react-native-async-storage/async-storage";
import { Exercise } from "../contexts/ExercisesContext";
import { Asset } from "react-native-image-picker";
import { copyFile, DocumentDirectoryPath } from "@dr.pogodin/react-native-fs";

export const saveNewExercise = async (workout: string, exercise: Exercise, image?: Asset, video?: Asset) => {
  const days = await AsyncStorage.getItem(`workouts[${workout}]`);
  let exercises = [];
  if(image) {
    const imageDestPath = `file://${DocumentDirectoryPath}/${image?.fileName}`;
    console.log('image src path: ', image.uri);
    console.log('image dest path: ', imageDestPath);
    copyFile(image.uri!, imageDestPath) 
    exercise.imagePath = imageDestPath;
  }
  if(video) {
    const videoDestPath = `file://${DocumentDirectoryPath}/${video?.fileName}`;
    console.log('video src path: ', video.uri);
    console.log('video dest path: ', videoDestPath);
    copyFile(video.uri!, videoDestPath);
    exercise.videoPath = videoDestPath;
  }
  if(days != null) {
    exercises = JSON.parse(days);
  }
  exercises.push(exercise);
  AsyncStorage.setItem(`workouts[${workout}]`, JSON.stringify(exercises));
  return exercises;
}