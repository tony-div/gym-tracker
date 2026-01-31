import { RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../utils/navitgation";
import { Text, View } from "react-native";

export default function ExerciseScreen({route}: {route: RouteProp<RootStackParamList, 'Exercise'>}) {
  const exercise = route.params.exercise;
  return <View>
    <Text>
      hi
    </Text>
  </View>
}