import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../utils/navitgation";
import { useState } from "react";
import { Asset } from "react-native-image-picker";
import { useNavigation } from "@react-navigation/native";
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Button from "../ui/Button";
import { SafeAreaView } from "react-native-safe-area-context";
import { Dropdown } from "react-native-element-dropdown";
import { pickMedia } from "../services/media";
import VideoPlayer from "../ui/VideoPlayer";
import ImagePreview from "../ui/ImagePreview";
import { saveNewExercise } from "../services/exercise";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { unlink } from "@dr.pogodin/react-native-fs";

export default function AddExerciseModal({route}: {route: RouteProp<RootStackParamList, 'Add Exercise'>}) {
  const workout = route.params.workout;
  const [exerciseName, setExerciseName] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState<'kgs' | 'lbs' | 'plates'>('kgs');
  const [image, setImage] = useState<Asset | undefined>();
  const [imagePreviewVisible, setImagePreviewVisible] = useState(false);
  const [video, setVideo] = useState<Asset | undefined>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <SafeAreaView style={styles.modal}>
      <ScrollView>
        <View style={styles.container}>
          <Text>Exercise name</Text>
          <TextInput onChangeText={(text) => setExerciseName(text)} style={styles.textInput} />
        </View>
        <View style={styles.row}>
          <View style={styles.rowChild}>
            <Text>Sets</Text>
            <TextInput inputMode='numeric' onChangeText={text => setSets(text)} style={styles.textInput} />
          </View>
          <View style={styles.rowChild}>
            <Text>Reps</Text>
            <TextInput inputMode='numeric' onChangeText={text => setReps(text)} style={styles.textInput} />
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.rowChild}>
            <Text>Weight</Text>
            <TextInput inputMode='numeric' onChangeText={text => setWeight(text)} style={styles.textInput} />
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
              <Button title='choose another video...' onPress={() => pickMedia('video').then(picked => setVideo(picked))} />
              <Button title='delete video' onPress={() => {setVideo(undefined); unlink(video?.uri!);}} />
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
      </ScrollView>
      <Button onPress={() => {
        if(exerciseName.length < 3) return;
        saveNewExercise(
          workout.workoutId, 
          {
            title: exerciseName, 
            sets: parseInt(sets, 10), 
            reps: parseInt(reps, 10), 
            weight: parseInt(weight, 10), 
            weightUnit
          }, 
          image, 
          video
        );
        navigation.goBack();
      }} title='submit' align="centered" />
    </SafeAreaView>
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
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
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
});