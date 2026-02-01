import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Card({title, imagePath, alt, onPress}: {title: string, imagePath?: string, alt?: string, onPress?: () => void}) {
  return <TouchableOpacity style={styles.card} onPress={onPress}>
    <View>
      {imagePath? (
        <Image resizeMode="contain" source={{ uri: imagePath }} style={styles.cardImage}/>
      )
      : <Text style={styles.altText}>{alt}</Text>}
    </View>
    <View style={styles.cardText}>
      <Text style={styles.cardTextFont}>
        {title}
      </Text>
    </View>
  </TouchableOpacity>
}

const styles = StyleSheet.create({
  card: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    gap: 8,
    minWidth: 150,
    minHeight: 150,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    margin: 10,
    shadowColor: '#000',
  },
  cardImage: {
    width: 150,
    height: 150
  },
  cardText: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cardTextFont: {
    fontSize: 16,
  },
  altText: {
    textAlign: 'center',
    fontSize: 30,
  }
})