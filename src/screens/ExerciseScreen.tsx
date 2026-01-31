import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../utils/navitgation";
import { StyleSheet, ScrollView, View, Image, TouchableOpacity, useWindowDimensions } from "react-native";
import Card from "../ui/Card";
import ImagePreview from "../ui/ImagePreview";
import { useState } from "react";
import VideoPlayer from "../ui/VideoPlayer";
import Button from "../ui/Button";

export default function ExerciseScreen({route}: {route: RouteProp<RootStackParamList, 'Exercise'>}) {
  const exercise = route.params.exercise;
  const [imagePreviewVisible, setImagePreviewVisible] = useState(false);
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  return (
    <View style={styles.screen}>
      <View style={styles.scollableContent}>

        <ScrollView>
          <View style={styles.section}>
            <Card title="weight" alt={`${exercise.weight} ${exercise.weightUnit} `} />
            <Card title="sets" alt={`${exercise.sets}`} />
            <Card title="reps" alt={`${exercise.reps}`} />
          </View>
          <View style={styles.section}>
            {exercise.imagePath && (
              <>
                <TouchableOpacity onPress={() => setImagePreviewVisible(true)}>
                  <Image source={{uri: exercise.imagePath}} style={{width: screenWidth * 0.9, height: screenHeight * 0.3}} />
                </TouchableOpacity>
                <ImagePreview imageUri={exercise.imagePath} visible={imagePreviewVisible} onRequestClose={() => setImagePreviewVisible(false)} />
              </>
            )}
          </View>
          <View style={styles.section}>
            {exercise.videoPath && (
              <VideoPlayer uri={exercise.videoPath} />
            )}
          </View>
        </ScrollView>
      </View>
      <Button title="start exercise" onPress={() => {}} align="centered" />
    </View>
  )
}

const styles = StyleSheet.create({
  screen: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: 10,
  },
  scollableContent: {
    height: '90%',
  },
  section: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginVertical: 10,
  }
});