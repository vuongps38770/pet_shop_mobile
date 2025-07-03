import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface StatItem {
  label: string;
  value: number;
  active?: boolean;
  onPress?: () => void;
  valueColor?: string;
}

interface StatGroupProps {
  items: StatItem[];
}

export const StatGroup: React.FC<StatGroupProps> = ({ items }) => {
  return (
    <View style={styles.row}>
      {items.map((item, index) => {
        const content = (
          <>
            <Text
              style={[
                styles.number,
                item.active && styles.activeNumber,
              ]}
            >
              {item.value}
            </Text>
            <Text style={styles.label}>{item.label}</Text>
          </>
        );

        return item.onPress ? (
          <TouchableOpacity
            key={index}
            onPress={item.onPress}
            style={[styles.box, item.active && styles.activeBox]}
          >
            {content}
          </TouchableOpacity>
        ) : (
          <View key={index} style={styles.box}>
            {content}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginBottom: 12,
  },
  box: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 4,
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: "#fff",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 0,
  },
  activeBox: {
    backgroundColor: "#E0F0FF",
  },
  number: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFAF42",
  },
  activeNumber: {
    color: "#007AFF",
  },
  label: {
    color: "#555",
    fontSize: 13,
    marginTop: 4,
  },
});
