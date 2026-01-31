import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { FontAwesome6 } from "@react-native-vector-icons/fontawesome6";

export default function Button({
  title, 
  onPress, 
  align='start', 
  iconName, 
  iconSize='normal', 
  children
  }: {
    title?: string, 
    onPress: () => void, 
    align?: 'start' | 'centered', 
    iconName?: string, 
    iconSize?: 'small' | 'normal',
    children?: React.JSX.Element
  }) {
  return <TouchableOpacity style={[styles.button, (align === 'start'? undefined: styles.centered), iconName === undefined? styles.buttonNoIcon: {}]} onPress={onPress}>
    <Text style={styles.buttonText}>
      {iconName && <FontAwesome6 name={iconName as any} size={iconSize === 'small'? 20: 30} color="#000" iconStyle='solid' />}
      {title}
    </Text>
    {children}
  </TouchableOpacity>;
}

const styles = StyleSheet.create({
  button: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    fontSize: 15,
  },
  centered: {
    justifyContent: 'center'
  },
  buttonText: {
    textAlign: 'center'
  },
  buttonNoIcon: {
    width: '95%',
    margin: 10,
  }
})