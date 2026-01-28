import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { FontAwesome6 } from "@react-native-vector-icons/fontawesome6";

export default function Button({title, onPress, align='start', iconName}: {title?: string, onPress: () => void, align?: 'start' | 'centered', iconName?: string}) {
  return <TouchableOpacity style={align === 'start'? [styles.button]: [styles.button, styles.centered]} onPress={onPress}>
    <Text style={styles.buttonText}>
      {iconName?? <FontAwesome6 name="plus" size={30} color="#000" iconStyle='solid' />}
      {title}
    </Text>
  </TouchableOpacity>;
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    margin: 10,
    shadowColor: '#000',
    width: '95%',
    fontSize: 15,
  },
  centered: {
    justifyContent: 'center'
  },
  buttonText: {
    textAlign: 'center'
  },
})