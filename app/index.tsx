import { StyleSheet, Text, View, Button, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState("Hello from React Native 🚀");
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{message}</Text>

      <Button
        title="Press Button"
        onPress={() => setMessage("You pressed the Button")}
      />

      <Pressable
        style={({pressed}) => [
          styles.pressable,
          { transform: [{ scale: pressed ? 0.95 : 1 }] },
        ]}
        onPress={() => setMessage("You pressed the Pressable")}
      >
        <Ionicons name="rocket" size={20} color="white"/>
        <Text style={styles.pressableText}>Launch</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  text: {
    fontSize: 18,
  },
  pressable: {
    backgroundColor: '#00ffcc',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
  },
  pressableText: {
    fontWeight: 'bold',
  },
});