import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Card({title, imagePath, onPress}: {title: string, imagePath: string, onPress: () => void}) {
  return <TouchableOpacity style={styles.card} onPress={onPress}>
    <View>
      <Image source={{ uri: imagePath }} style={styles.cardImage} />
    </View>
    <Text>
      {title}
    </Text>
  </TouchableOpacity>
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    margin: 10,
    shadowColor: '#000',
  },
  cardImage: {
    width: 150,
    height: 75
  }
})