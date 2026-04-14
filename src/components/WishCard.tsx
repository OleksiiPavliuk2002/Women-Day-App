import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { Wish } from "../database/db";

interface Props {
  wish: Wish;
  onDelete: () => void;
  onPress: () => void;
}

const WishCard: React.FC<Props> = ({ wish, onDelete, onPress }) => {
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.97);
  };
  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("uk-UA", { day: "numeric", month: "long" });
    } catch {
      return "";
    }
  };

  return (
    <Animated.View style={[styles.wrapper, animStyle]}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <LinearGradient
          colors={["#2d0018", "#1a000f"]}
          style={styles.card}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.leftAccent} />

          <View style={styles.emojiContainer}>
            <Text style={styles.emoji}>{wish.emoji}</Text>
          </View>

          <View style={styles.content}>
            <Text style={styles.name}>{wish.name}</Text>
            <Text style={styles.message} numberOfLines={2}>
              {wish.message}
            </Text>
            {wish.created_at && (
              <Text style={styles.date}>{formatDate(wish.created_at)}</Text>
            )}
          </View>

          <TouchableOpacity
            onPress={onDelete}
            style={styles.deleteBtn}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <Ionicons name="trash-outline" size={18} color="#ff6b9d66" />
          </TouchableOpacity>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
  },
  card: {
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ff6b9d22",
    overflow: "hidden",
  },
  leftAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: "#ff6b9d",
    borderTopLeftRadius: 18,
    borderBottomLeftRadius: 18,
  },
  emojiContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#ff6b9d18",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    marginLeft: 8,
  },
  emoji: { fontSize: 24 },
  content: { flex: 1 },
  name: {
    fontSize: 16,
    color: "#ffd6e7",
    fontWeight: "700",
    marginBottom: 4,
  },
  message: {
    fontSize: 13,
    color: "#ffaac8",
    lineHeight: 19,
    opacity: 0.8,
  },
  date: {
    fontSize: 11,
    color: "#ff6b9d88",
    marginTop: 6,
    letterSpacing: 0.3,
  },
  deleteBtn: {
    padding: 4,
    marginLeft: 8,
  },
});

export default WishCard;
