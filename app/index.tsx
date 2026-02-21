import { StyleSheet, Text, View, Pressable, Animated, Vibration } from 'react-native';
import { useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function Home() {
  const numCards = 2;

  const [flipped, setFlipped] = useState<boolean[]>(Array(numCards).fill(false));

  type CardOutcome = 'rocket' | 'close';

  const [outcomes, setOutcomes] = useState<CardOutcome[]>(
    Array(numCards)
      .fill(0)
      .map(() => (Math.random() > 0.5 ? 'rocket' : 'close'))
  );

  const flipAnim: Animated.Value[] = Array(numCards)
    .fill(0)
    .map(() => useRef(new Animated.Value(0)).current);

  const flipCard = (index: number) => {
    if (flipped[index]) return; // already flipped

    // Flip forward
    setFlipped((prev) => {
      const newFlipped = [...prev];
      newFlipped[index] = true;
      return newFlipped;
    });

    Animated.spring(flipAnim[index], {
      toValue: 180,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();

    // Flip back after 2 seconds
    setTimeout(() => {
      Animated.spring(flipAnim[index], {
        toValue: 0,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();

      setFlipped((prev) => {
        const newFlipped = [...prev];
        newFlipped[index] = false;
        return newFlipped;
      });

      // Shuffle outcomes **after the card flips back**
      setOutcomes((prev) =>
        prev.map(() => (Math.random() > 0.5 ? 'rocket' : 'close'))
      );
    }, 2000);
  };

  const frontInterpolate = (index: number) =>
    flipAnim[index].interpolate({
      inputRange: [0, 180],
      outputRange: ['0deg', '180deg'],
    });

  const backInterpolate = (index: number) =>
    flipAnim[index].interpolate({
      inputRange: [0, 180],
      outputRange: ['180deg', '360deg'],
    });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>XP Card Flip</Text>

      <View style={styles.cardsContainer}>
        {Array.from({ length: numCards }).map((_, i: number) => (
          <Pressable key={i} onPress={() => flipCard(i)}>
            <View>
              {/* Front */}
              <Animated.View
                style={[
                  styles.card,
                  { transform: [{ rotateY: frontInterpolate(i) }] },
                  { backfaceVisibility: 'hidden' }, // just hide the front when flipped
                ]}
              >
                <Ionicons name="help-circle" size={60} color="#22d3ee" />
              </Animated.View>

              <Animated.View
                style={[
                  styles.card,
                  styles.cardBack,
                  { transform: [{ rotateY: backInterpolate(i) }] },
                  { backfaceVisibility: 'hidden' }, // also hide back when not flipped
                ]}
              >
                <Ionicons
                  name={outcomes[i]}
                  size={60}
                  color={outcomes[i] === 'rocket' ? '#22d3ee' : 'red'}
                />
              </Animated.View>
            </View>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    gap: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  cardsContainer: {
    flexDirection: 'row',
    gap: 40,
  },
  card: {
    width: 100,
    height: 100,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backfaceVisibility: 'hidden',
  },
  cardBack: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 100,
    height: 100,
    backgroundColor: '#1e293b',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  }
});