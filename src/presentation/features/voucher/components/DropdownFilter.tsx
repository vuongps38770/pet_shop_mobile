import React from "react";
import { TouchableOpacity, View, Text, Image, StyleSheet } from "react-native";
import { assets } from "../../../shared/theme/assets";

interface Props {
  label: string;
  onPress?: () => void;
}

export const DropdownFilter: React.FC<Props> = ({ label, onPress }) => {
  return (
    <TouchableOpacity style={styles.dropdownButton} onPress={onPress}>
      <View style={styles.dropdownContent}>
        <Text style={styles.dropdownText}>{label}</Text>
        <Image source={assets.icons.voucher.path} style={styles.pathIcon} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  dropdownButton: {
    flex: 1,
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#eee",
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  dropdownContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  dropdownText: {
    fontWeight: "600",
    color: "#000",
    fontSize: 14,
    marginRight: 4,
  },
  pathIcon: {
    tintColor: "#000",
    marginLeft: 25,
  },
});
