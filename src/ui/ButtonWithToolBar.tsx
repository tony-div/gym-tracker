import { View } from "react-native";
import Button from "./Button";

export default function ButtonWitToolBar({title, tools}: {title: string, tools: {iconName: string, onPress: () => void}[]}) {
  return <Button onPress={() => {}} title={title}>
    <View>
      {tools.map(tool => <Button key={tool.iconName} iconName={tool.iconName} onPress={tool.onPress} />)}
    </View>
  </Button>
}