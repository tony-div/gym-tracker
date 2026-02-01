import { RouteProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../utils/navitgation";
import { StyleSheet, ScrollView, View, Image, TouchableOpacity, useWindowDimensions } from "react-native";
import Card from "../ui/Card";
import ImagePreview from "../ui/ImagePreview";
import { useState } from "react";
import VideoPlayer from "../ui/VideoPlayer";
import Button from "../ui/Button";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Exercise } from "../interfaces/exercise";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ExerciseScreen({route}: {route: RouteProp<RootStackParamList, 'Exercise'>}) {
  const exercise = route.params.exercise;
  const [imagePreviewVisible, setImagePreviewVisible] = useState(false);
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  return (
    <SafeAreaView>
      <View style={styles.screen}>
        <View style={styles.scollableContent}>
          <ScrollView>
            <View style={styles.section}>
              <Card title="weight" alt={`${exercise.weight} ${exercise.weightUnit} `} />
              <Card title="sets" alt={`${exercise.sets}`} />
              <Card title="reps" alt={`${exercise.reps}`} />
            </View>
            {exercise.imagePath && (
              <View style={styles.section}>
                  <>
                    <TouchableOpacity onPress={() => setImagePreviewVisible(true)}>
                      <Image source={{uri: exercise.imagePath}} style={{width: screenWidth * 0.9, height: screenHeight * 0.3}} />
                    </TouchableOpacity>
                    <ImagePreview imageUri={exercise.imagePath} visible={imagePreviewVisible} onRequestClose={() => setImagePreviewVisible(false)} readonly />
                  </>
              </View>
            )}
            <View style={styles.section}>
              {exercise.videoPath && (
                <VideoPlayer uri={exercise.videoPath} />
              )}
            </View>
          </ScrollView>
        </View>
        {/* <Button title="start exercise" onPress={() => {}} align="centered" /> */}
      </View>
    </SafeAreaView>
  )
}

export function ExerciseEditButton({exercise}: {exercise: Exercise}) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <Button iconName="pen" iconSize="small" onPress={() => {navigation.navigate('Edit Exercise', { exercise })}} />
  )
}

const styles = StyleSheet.create({
  screen: {
    display: 'flex',
    flexDirection: 'column',
  },
  scollableContent: {
    height: '100%',
    flexGrow: 1,
  },
  section: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 10,
  }
});