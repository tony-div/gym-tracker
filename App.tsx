import * as React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  Home: undefined;
  Day: { title: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Day" component={Day} options={({ route }) => ({
        title: route.params.title || "Day"
      })}/>
    </Stack.Navigator>
  );
}

function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  let days: string[] = ['day 1', 'day 2', 'day 3'];
  AsyncStorage.getItem('days').then(result => {
    if (result) {
      days = JSON.parse(result);
    }
  });
  return (
    <View style={styles.container}>
      {days.map(day => <Card title={day} onPress={() => navigation.navigate('Day', { 'title': day })} />)}
    </View>
  );
}

function Day() {
  return (
    <View style={styles.container}>
      <Text>Day Screen</Text>
    </View>
  );
}

function Card({title, onPress}: {title: string, onPress: () => void}) {
  return <Pressable style={styles.card} onPress={onPress}>
    <Text>
      {title}
    </Text>
  </Pressable>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    margin: 10,
    shadowColor: '#000',
  }
});

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}