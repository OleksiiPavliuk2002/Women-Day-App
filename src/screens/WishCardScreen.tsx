import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  Alert,
  Dimensions,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  withSequence,
  FadeInDown,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { addWish, Wish } from '../database/db';
import PetalsBackground from '../components/PetalsBackground';

const { width, height } = Dimensions.get('window');

const EMOJIS = ['🌸', '🌺', '🌷', '🌹', '💐', '💖', '✨', '🦋', '🌙', '💝'];
const TEMPLATES = [
  'Вітаю з 8 березня! Бажаю тобі щастя, здоров\'я та всього найкращого!',
  'Зі святом! Нехай кожен день буде наповнений радістю та любов\'ю 💖',
  'Ти найпрекрасніша! Нехай життя дарує тобі лише посмішки та квіти 🌸',
  'З Міжнародним жіночим днем! Ти заслуговуєш на все найкраще в цьому світі ✨',
];

interface ConfettiParticle {
  id: number;
  x: number;
  color: string;
}

const CONFETTI_COLORS = ['#ff6b9d', '#ffd6e7', '#ffaac8', '#c7215d', '#fff', '#ffcc00'];

export default function WishCardScreen({ navigation, route }: any) {
  const existingWish: Wish | null = route.params?.wish || null;
  const isViewing = !!existingWish;

  const [name, setName] = useState(existingWish?.name || '');
  const [message, setMessage] = useState(existingWish?.message || '');
  const [selectedEmoji, setSelectedEmoji] = useState(existingWish?.emoji || '🌸');
  const [confetti, setConfetti] = useState<ConfettiParticle[]>([]);
  const [saved, setSaved] = useState(false);

  const saveScale = useSharedValue(1);
  const cardGlow = useSharedValue(0);

  const saveStyle = useAnimatedStyle(() => ({
    transform: [{ scale: saveScale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    shadowOpacity: cardGlow.value,
  }));

  const handleSave = async () => {
    if (!name.trim() || !message.trim()) {
      Alert.alert('Заповніть поля', 'Будь-ласка, введіть ім\'я та привітання');
      return;
    }
    Keyboard.dismiss();
    saveScale.value = withSequence(
      withTiming(0.9, { duration: 100 }),
      withSpring(1.05),
      withSpring(1)
    );
    cardGlow.value = withSequence(
      withTiming(1, { duration: 300 }),
      withTiming(0.3, { duration: 1000 })
    );

    const particles: ConfettiParticle[] = Array.from({ length: 18 }, (_, i) => ({
      id: Date.now() + i,
      x: Math.random() * width,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    }));
    setConfetti(particles);
    setTimeout(() => setConfetti([]), 2500);

    try {
      await addWish({ name, message, emoji: selectedEmoji });
      setSaved(true);
      setTimeout(() => navigation.goBack(), 1800);
    } catch (e) {
      Alert.alert('Помилка', 'Не вдалося зберегти привітання');
    }
  };

  return (
    <LinearGradient
      colors={['#12000c', '#2a001a', '#12000c']}
      style={styles.container}
    >
      <PetalsBackground count={8} />

      {confetti.map(p => (
        <ConfettiItem key={p.id} x={p.x} color={p.color} />
      ))}

      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color="#ff6b9d" />
        </TouchableOpacity>
        <Animated.Text entering={FadeInDown.delay(100)} style={styles.headerTitle}>
          {isViewing ? 'Привітання' : 'Нове привітання'}
        </Animated.Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View
          entering={FadeInDown.delay(200).springify()}
          style={[styles.previewCard, glowStyle]}
        >
          <LinearGradient
            colors={['#3d0026', '#1a000f']}
            style={styles.previewInner}
          >
            <Text style={styles.previewEmoji}>{selectedEmoji}</Text>
            <Text style={styles.previewName}>{name || 'Ім\'я отримувача'}</Text>
            <Text style={styles.previewMessage}>
              {message || 'Ваше привітання з\'явиться тут...'}
            </Text>
            <View style={styles.previewDecor}>
              <Text style={{ opacity: 0.3, letterSpacing: 8 }}>🌸 🌸 🌸</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {!isViewing && (
          <>
            <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
              <Text style={styles.label}>Виберіть емодзі</Text>
              <View style={styles.emojiRow}>
                {EMOJIS.map(emoji => (
                  <TouchableOpacity
                    key={emoji}
                    onPress={() => setSelectedEmoji(emoji)}
                    style={[
                      styles.emojiBtn,
                      selectedEmoji === emoji && styles.emojiBtnSelected,
                    ]}
                  >
                    <Text style={{ fontSize: 22 }}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>

            {/* Name input */}
            <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
              <Text style={styles.label}>{'Ім\'я отримувача'}</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Наприклад: Мама, Аня, Колега..."
                placeholderTextColor="#ff6b9d55"
                selectionColor="#ff6b9d"
              />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(500)} style={styles.section}>
              <Text style={styles.label}>Привітання</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={message}
                onChangeText={setMessage}
                placeholder="Напишіть теплі слова..."
                placeholderTextColor="#ff6b9d55"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                selectionColor="#ff6b9d"
              />
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(600)} style={styles.section}>
              <Text style={styles.label}>Шаблони 📝</Text>
              {TEMPLATES.map((t, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => setMessage(t)}
                  style={styles.template}
                >
                  <Text style={styles.templateText} numberOfLines={2}>{t}</Text>
                </TouchableOpacity>
              ))}
            </Animated.View>

            <Animated.View entering={FadeInDown.delay(700)} style={styles.saveWrapper}>
              <Animated.View style={saveStyle}>
                <TouchableOpacity onPress={handleSave} activeOpacity={0.85}>
                  <LinearGradient
                    colors={saved ? ['#4caf50', '#388e3c'] : ['#ff6b9d', '#c7215d']}
                    style={styles.saveBtn}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Ionicons
                      name={saved ? 'checkmark-circle' : 'heart'}
                      size={22}
                      color="#fff"
                      style={{ marginRight: 10 }}
                    />
                    <Text style={styles.saveBtnText}>
                      {saved ? 'Збережено!' : 'Зберегти привітання'}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </Animated.View>
            </Animated.View>
          </>
        )}

        <View style={{ height: 50 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const ConfettiItem: React.FC<{ x: number; color: string }> = ({ x, color }) => {
  const translateY = useSharedValue(-20);
  const opacity = useSharedValue(1);
  const rotate = useSharedValue(0);

  useEffect(() => {
    translateY.value = withTiming(height * 0.75, { duration: 2200, easing: Easing.out(Easing.quad) });
    opacity.value = withDelay(1500, withTiming(0, { duration: 700 }));
    rotate.value = withTiming(720 + Math.random() * 360, { duration: 2200 });
  }, [opacity, rotate, translateY]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: x,
          top: height * 0.3,
          width: 10,
          height: 10,
          borderRadius: 2,
          backgroundColor: color,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 56,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    color: '#ffd6e7',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  scrollContent: { paddingHorizontal: 20, paddingTop: 12 },
  previewCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#ff6b9d44',
    shadowColor: '#ff6b9d',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 20,
    elevation: 8,
  },
  previewInner: {
    padding: 28,
    alignItems: 'center',
    minHeight: 180,
    justifyContent: 'center',
  },
  previewEmoji: { fontSize: 52, marginBottom: 12 },
  previewName: {
    fontSize: 22,
    color: '#ffd6e7',
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  previewMessage: {
    fontSize: 14,
    color: '#ffaac8',
    textAlign: 'center',
    lineHeight: 21,
    opacity: 0.85,
    fontStyle: 'italic',
  },
  previewDecor: { marginTop: 16 },
  section: { marginBottom: 20 },
  label: {
    fontSize: 13,
    color: '#ff6b9d',
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  emojiRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  emojiBtn: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#ffffff08',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  emojiBtnSelected: {
    borderColor: '#ff6b9d',
    backgroundColor: '#ff6b9d22',
  },
  input: {
    backgroundColor: '#ffffff0a',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#ff6b9d33',
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#ffd6e7',
    fontSize: 15,
  },
  textArea: {
    minHeight: 110,
    paddingTop: 14,
  },
  template: {
    backgroundColor: '#ff6b9d11',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ff6b9d22',
  },
  templateText: {
    color: '#ffaac8',
    fontSize: 13,
    lineHeight: 19,
  },
  saveWrapper: { marginTop: 8 },
  saveBtn: {
    borderRadius: 18,
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
