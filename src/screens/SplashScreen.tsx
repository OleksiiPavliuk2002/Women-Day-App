import React, { useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  withSpring,
  Easing,
  withRepeat
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { initDB } from '../database/db';
import PetalsBackground from '../components/PetalsBackground';

export default function SplashScreen({ navigation }: any) {
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslate = useSharedValue(30);
  const dateOpacity = useSharedValue(0);
  const ringScale = useSharedValue(0);
  const ringOpacity = useSharedValue(0.8);

  useEffect(() => {
    initDB().catch(console.error);

    ringScale.value = withRepeat(
      withSequence(
        withTiming(1.4, { duration: 1200, easing: Easing.out(Easing.quad) }),
        withTiming(1, { duration: 800 })
      ),
      -1,
      false
    );
    ringOpacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 1200 }),
        withTiming(0.5, { duration: 800 })
      ),
      -1,
      false
    );

    logoScale.value = withDelay(300, withSpring(1, { damping: 10, stiffness: 80 }));
    logoOpacity.value = withDelay(300, withTiming(1, { duration: 600 }));

    textOpacity.value = withDelay(900, withTiming(1, { duration: 700 }));
    textTranslate.value = withDelay(900, withTiming(0, { duration: 700, easing: Easing.out(Easing.cubic) }));

    dateOpacity.value = withDelay(1400, withTiming(1, { duration: 700 }));

    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, 3200);

    return () => clearTimeout(timer);
  }, [dateOpacity, logoOpacity, logoScale, ringOpacity, ringScale, textOpacity, textTranslate, navigation]);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: ringScale.value }],
    opacity: ringOpacity.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslate.value }],
  }));

  const dateStyle = useAnimatedStyle(() => ({
    opacity: dateOpacity.value,
  }));

  return (
    <LinearGradient
      colors={['#1a0010', '#3d0026', '#6b003d', '#3d0026', '#1a0010']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <PetalsBackground count={15} />

      <Animated.View style={[styles.ring, ringStyle]} />

      <Animated.View style={[styles.logoContainer, logoStyle]}>
        <Text style={styles.logo}>🌹</Text>
      </Animated.View>

      <Animated.View style={textStyle}>
        <Text style={styles.title}>З 8 Березня!</Text>
        <Text style={styles.subtitle}>Вітаємо прекрасних жінок</Text>
      </Animated.View>

      <Animated.View style={[styles.dateBadge, dateStyle]}>
        <Text style={styles.dateText}>8 БЕРЕЗНЯ</Text>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ring: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 2,
    borderColor: '#ff6b9d',
  },
  logoContainer: {
    marginBottom: 30,
  },
  logo: {
    fontSize: 90,
  },
  title: {
    fontFamily: 'serif',
    fontSize: 42,
    color: '#ffd6e7',
    textAlign: 'center',
    fontWeight: '700',
    letterSpacing: 2,
    textShadowColor: '#ff6b9d',
    textShadowRadius: 20,
    textShadowOffset: { width: 0, height: 0 },
  },
  subtitle: {
    fontSize: 15,
    color: '#ffaac8',
    textAlign: 'center',
    marginTop: 8,
    letterSpacing: 1,
    opacity: 0.85,
  },
  dateBadge: {
    position: 'absolute',
    bottom: 80,
    paddingHorizontal: 28,
    paddingVertical: 10,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#ff6b9d55',
    backgroundColor: '#ff6b9d22',
  },
  dateText: {
    color: '#ff6b9d',
    fontSize: 13,
    letterSpacing: 6,
    fontWeight: '600',
  },
});
