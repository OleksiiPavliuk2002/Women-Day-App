import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  FadeInDown,
  Layout,
  ZoomIn,
  withRepeat,
  withSequence,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { getWishes, deleteWish, Wish } from "../database/db";
import PetalsBackground from "../components/PetalsBackground";
import WishCard from "../components/WishCard";

const HERO_QUOTES = [
  "Жінка - це квітка життя 🌸",
  "Краса — це сила ✨",
  "Ти достойна всього найкращого 💖",
  "Зі святом, прекрасна! 🌹",
];

export default function HomeScreen({ navigation }: any) {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const quoteOpacity = useSharedValue(1);
  const fabScale = useSharedValue(1);

  const loadWishes = async () => {
    const data = await getWishes();
    setWishes(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadWishes();
    }, []),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      quoteOpacity.value = withTiming(0, { duration: 400 }, () => {
        quoteOpacity.value = withTiming(1, { duration: 400 });
      });
      setTimeout(() => {
        setQuoteIndex((i) => (i + 1) % HERO_QUOTES.length);
      }, 400);
    }, 3500);
    return () => clearInterval(interval);
  }, [quoteOpacity]);

  useEffect(() => {
    fabScale.value = withRepeatPulse();
  }, [fabScale]);

  function withRepeatPulse() {
    return withRepeat(
      withSequence(
        withTiming(1.12, { duration: 800 }),
        withTiming(1, { duration: 800 }),
      ),
      -1,
      true,
    );
  }

  const quoteStyle = useAnimatedStyle(() => ({ opacity: quoteOpacity.value }));
  const fabStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fabScale.value }],
  }));

  const handleDelete = (id: number) => {
    Alert.alert("Видалити привітання?", undefined, [
      { text: "Скасувати", style: "cancel" },
      {
        text: "Видалити",
        style: "destructive",
        onPress: async () => {
          await deleteWish(id);
          loadWishes();
        },
      },
    ]);
  };

  return (
    <LinearGradient
      colors={["#12000c", "#2a001a", "#12000c"]}
      style={styles.container}
    >
      <PetalsBackground count={12} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadWishes}
            tintColor="#ff6b9d"
          />
        }
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View
          entering={FadeInDown.delay(100).springify()}
          style={styles.header}
        >
          <Text style={styles.headerEmoji}>🌹</Text>
          <Text style={styles.headerTitle}>8 Березня</Text>
          <Text style={styles.headerSub}>Міжнародний жіночий день</Text>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(300)}
          style={styles.quoteCard}
        >
          <LinearGradient
            colors={["#ff6b9d33", "#c7215d22"]}
            style={styles.quoteGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Animated.Text style={[styles.quoteText, quoteStyle]}>
              {HERO_QUOTES[quoteIndex]}
            </Animated.Text>
          </LinearGradient>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400)} style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNum}>{wishes.length}</Text>
            <Text style={styles.statLabel}>Привітань</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>💌</Text>
            <Text style={styles.statLabel}>{'З любов\'ю'}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNum}>∞</Text>
            <Text style={styles.statLabel}>Ніжности</Text>
          </View>
        </Animated.View>

        <Animated.Text
          entering={FadeInDown.delay(500)}
          style={styles.sectionTitle}
        >
          Привітання 💐
        </Animated.Text>

        {wishes.length === 0 ? (
          <Animated.View entering={ZoomIn.delay(600)} style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🌸</Text>
            <Text style={styles.emptyText}>Додайте перше привітання!</Text>
            <Text style={styles.emptySubtext}>Натисніть кнопку нижче ↓</Text>
          </Animated.View>
        ) : (
          wishes.map((wish, index) => (
            <Animated.View
              key={wish.id}
              entering={FadeInDown.delay(index * 100 + 400).springify()}
              layout={Layout.springify()}
            >
              <WishCard
                wish={wish}
                onDelete={() => handleDelete(wish.id!)}
                onPress={() => navigation.navigate("WishCard", { wish })}
              />
            </Animated.View>
          ))
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      <Animated.View style={[styles.fab, fabStyle]}>
        <TouchableOpacity
          onPress={() => navigation.navigate("WishCard", { wish: null })}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={["#ff6b9d", "#c7215d"]}
            style={styles.fabInner}
          >
            <Ionicons name="add" size={30} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 60 },
  header: { alignItems: "center", marginBottom: 24 },
  headerEmoji: { fontSize: 56, marginBottom: 8 },
  headerTitle: {
    fontSize: 48,
    fontWeight: "800",
    color: "#ffd6e7",
    letterSpacing: 3,
    textShadowColor: "#ff6b9d",
    textShadowRadius: 30,
    textShadowOffset: { width: 0, height: 0 },
  },
  headerSub: {
    fontSize: 14,
    color: "#ffaac8",
    letterSpacing: 2,
    marginTop: 4,
    opacity: 0.7,
    textTransform: "uppercase",
  },
  quoteCard: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ff6b9d44",
  },
  quoteGradient: {
    paddingVertical: 22,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  quoteText: {
    fontSize: 18,
    color: "#ffd6e7",
    textAlign: "center",
    fontStyle: "italic",
    lineHeight: 26,
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: "#ffffff08",
    borderRadius: 20,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#ff6b9d22",
    justifyContent: "space-around",
    alignItems: "center",
  },
  statItem: { alignItems: "center", flex: 1 },
  statNum: { fontSize: 24, color: "#ff6b9d", fontWeight: "700" },
  statLabel: {
    fontSize: 11,
    color: "#ffaac8",
    marginTop: 4,
    opacity: 0.7,
    letterSpacing: 0.5,
  },
  statDivider: { width: 1, height: 40, backgroundColor: "#ff6b9d33" },
  sectionTitle: {
    fontSize: 20,
    color: "#ffd6e7",
    fontWeight: "700",
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 60,
    backgroundColor: "#ffffff06",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#ff6b9d22",
    borderStyle: "dashed",
  },
  emptyEmoji: { fontSize: 50, marginBottom: 16 },
  emptyText: { fontSize: 16, color: "#ffaac8", fontWeight: "600" },
  emptySubtext: { fontSize: 13, color: "#ff6b9d88", marginTop: 8 },
  fab: {
    position: "absolute",
    bottom: 36,
    right: 24,
    shadowColor: "#ff6b9d",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 10,
  },
  fabInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: "center",
    justifyContent: "center",
  },
});
