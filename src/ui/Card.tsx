import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Card({title, imagePath, onPress}: {title: string, imagePath?: string, onPress: () => void}) {
  return <TouchableOpacity style={styles.card} onPress={onPress}>
    <View>
      <Image resizeMode="contain" source={{ uri: imagePath }} style={styles.cardImage} />
    </View>
    <View style={styles.cardText}>
      <Text>
        {title}
      </Text>
    </View>
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
    width: '100%',
    height: 100
  },
  cardText: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center'
  }
})