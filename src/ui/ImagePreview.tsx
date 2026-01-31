import { Image, Modal, StyleSheet, useWindowDimensions, View } from "react-native";
import Button from "./Button";

export default function ImagePreview({visible, onRequestClose, imageUri, pickAnotherHandler}: {
  visible: boolean;
  onRequestClose: () => void;
  imageUri: string;
  pickAnotherHandler?: () => void;
}) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  return (
    <Modal 
      animationType='slide' 
      backdropColor={'black'} 
      visible={visible}
      onRequestClose={onRequestClose}
      style={styles.imageModal}
    >
      <View style={styles.imageContainer}>
        <Image resizeMode='contain' source={{uri: imageUri}} width={screenWidth * 0.9} height={screenHeight * 0.7} />
      </View>
      <View style={styles.row}>
        <View style={styles.rowChild}>
          {pickAnotherHandler && <Button title='pick another photo' onPress={pickAnotherHandler} />}
        </View>
        <View style={styles.rowChild}>
          <Button title='ok' onPress={onRequestClose} align="centered" />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  imageModal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  imageContainer: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
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