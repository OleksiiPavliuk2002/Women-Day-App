import React, { useEffect } from 'react';
import { StyleSheet, Dimensions, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withDelay,
  Easing,
  interpolate,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const PETALS = ['🌸', '🌺', '🌷', '💐', '🌹', '✿', '❀'];

interface PetalProps {
  index: number;
}

const Petal: React.FC<PetalProps> = ({ index }) => {
  const startX = Math.random() * width;
  const duration = 5000 + Math.random() * 5000;
  const delay = Math.random() * 4000;
  const size = 16 + Math.random() * 20;
  const emoji = PETALS[index % PETALS.length];

  const translateY = useSharedValue(-60);
  const rotate = useSharedValue(0);
  const sway = useSharedValue(0);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withRepeat(
        withTiming(height + 60, { duration, easing: Easing.linear }),
        -1,
        false
      )
    );
    rotate.value = withDelay(
      delay,
      withRepeat(
        withTiming(360, { duration: duration * 1.5, easing: Easing.linear }),
        -1,
        false
      )
    );
    sway.value = withDelay(
      delay,
      withRepeat(
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        -1,
        true
      )
    );
  }, [delay, duration, rotate, sway, translateY]);

  const animStyle = useAnimatedStyle(() => {
    const swayX = interpolate(sway.value, [0, 1], [-25, 25]);
    return {
      transform: [
        { translateY: translateY.value },
        { translateX: swayX },
        { rotate: `${rotate.value}deg` },
      ],
    };
  });

  return (
    <Animated.Text
      style={[
        styles.petal,
        { left: startX, fontSize: size },
        animStyle,
      ]}
    >
      {emoji}
    </Animated.Text>
  );
};

const PetalsBackground: React.FC<{ count?: number }> = ({ count = 20 }) => {
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {Array.from({ length: count }).map((_, i) => (
        <Petal key={i} index={i} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  petal: {
    position: 'absolute',
    top: 0,
  },
});

export default PetalsBackground;
