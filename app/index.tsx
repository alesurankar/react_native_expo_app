import { StyleSheet, Text, View, Pressable, Animated } from 'react-native';
import { useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

export default function Home() {
  const numCards = 2;
  const [flipped, setFlipped] = useState<boolean[]>(Array(numCards).fill(false));
  const [isAnimating, setIsAnimating] = useState(false);
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
    
    if (flipped[index] || isAnimating) return;
    setIsAnimating(true);

    // flip forward
    setFlipped(prev => {
      const next = [...prev];
      next[index] = true;
      return next;
    });

    Animated.spring(flipAnim[index], {
      toValue: 180,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();

    // flip back after 2 seconds
    setTimeout(() => {
      setIsAnimating(false);
      setFlipped(prev => {
        const next = [...prev];
        next[index] = false;
        return next;
      });

      Animated.spring(flipAnim[index], {
        toValue: 0,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start(() => {
        // runs AFTER animation finishes
        setFlipped(prev => {
          const next = [...prev];
          next[index] = false;
          return next;
        });

        // shuffle AFTER card is fully closed
        setOutcomes(prev =>
          prev.map(() => (Math.random() > 0.5 ? 'rocket' : 'close'))
        );
      });
    }, 1000);
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
                ]}
              >
                <Ionicons name="help-circle" size={60} color="#22d3ee" />
              </Animated.View>

              <Animated.View
                style={[
                  styles.card,
                  styles.cardBack,
                  { transform: [{ rotateY: backInterpolate(i) }] },
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