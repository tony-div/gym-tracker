import { StyleSheet, View } from "react-native";
import Button from "./Button";

export default function ButtonWitToolBar({title, tools}: {title: string, tools: {iconName: string, onPress: () => void}[]}) {
  return <Button onPress={() => {}} title={title}>
    <View style={styles.toolbar}>
      {tools.map(tool => <Button key={tool.iconName} iconSize="small" iconName={tool.iconName} onPress={tool.onPress} />)}
    </View>
  </Button>
}

const styles = StyleSheet.create({
  toolbar: {
    display: 'flex',
    flexDirection: 'row'
  }
})