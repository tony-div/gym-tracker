import { StyleSheet, View } from "react-native";
import Button from "./Button";

export default function Fab({onPress, iconName}: {onPress: () => void, iconName: string}) {
  return <View style={styles.fab}>
    <Button onPress={onPress} iconName={iconName} />
  </View>
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 70,
    right: 30,
  },
})