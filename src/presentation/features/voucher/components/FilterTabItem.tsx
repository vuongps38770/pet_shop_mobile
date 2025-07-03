import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

interface Props {
  label: string;
  icon: any;
  active?: boolean;
  onPress: () => void;
}

export const FilterTabItem: React.FC<Props> = ({
  label,
  icon,
  active,
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <Image
        source={icon}
        style={{
          width: 24,
          height: 24,
          tintColor: active ? "#000" : "#aaa",
        }}
      />
      <Text style={[styles.label, active && styles.activeLabel]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: "center", flex: 1 },
  label: {
    fontSize: 14,
    color: "#aaa",
    marginTop: 4,
    fontWeight: "500",
    textAlign: "center",
  },
  activeLabel: {
    color: "#000",
    fontWeight: "bold",
  },
});
