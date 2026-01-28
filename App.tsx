import * as React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome6 } from "@react-native-vector-icons/fontawesome6";
import { useState, useContext } from 'react';
import { SetWorkoutsContext, WorkoutsContext } from './src/contexts/WorkoutsContext';

type RootStackParamList = {
  'Home': undefined;
  'Workout': { title: string };
  'Add Workout': undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Workout" component={WorkoutScreen} options={({ route }) => ({
        title: route.params.title || "Day"
      })}/>
    </Stack.Navigator>
  );
}

function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  let workouts = useContext(WorkoutsContext);
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
  const [workouts, setWorkouts] = useState<string[]>([]);
  return (
    <SafeAreaProvider>
      <WorkoutsContext value={workouts}>
        <SetWorkoutsContext value={setWorkouts}>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
        </SetWorkoutsContext>
      </WorkoutsContext>
    </SafeAreaProvider>
  );
}