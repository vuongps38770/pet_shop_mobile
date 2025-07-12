import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { assets } from "../../../shared/theme/assets";

interface Props {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  onGotoMy?: () => void;
  avatarUrl?: string;
  showLeft?: boolean
}

export const VoucherHeader: React.FC<Props> = ({
  title,
  subtitle,
  onBack,
  avatarUrl = "",
  onGotoMy,
  showLeft = true
}) => {
  return (
    <>
      <View style={styles.headerWrapper}>
        <TouchableOpacity onPress={onBack}>
          <View style={styles.backButton}>
            <Image source={assets.icons.user.back} style={{ width: 16, height: 16, tintColor: "#000" }} />

          </View>
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
        {showLeft ?
          <TouchableOpacity onPress={onGotoMy}>
            <Text>lịch sử</Text>
          </TouchableOpacity>
          : <Text>        </Text>
        }


      </View>

      <View style={styles.highlightBox}>
        <Text style={styles.highlightTitle}>{title}</Text>
        {subtitle && <Text style={styles.highlightSubtitle}>{subtitle}</Text>}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  headerWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#F4F4F4",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  highlightBox: {
    backgroundColor: "#FFA63D",
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  highlightTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  highlightSubtitle: {
    color: "#fff",
  },
});
