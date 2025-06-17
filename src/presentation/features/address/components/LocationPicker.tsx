import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { LocationDTO } from "src/presentation/dto/res/newaddress-respond.dto";
import { LAYOUT, SPACING } from "../../../shared/theme/layout";

interface LocationPickerProps {
  label: string;
  selectedValue: string;
  onValueChange: (value: LocationDTO) => void;
  items: LocationDTO[];
  placeholder?: string;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  label,
  selectedValue,
  onValueChange,
  items,
  placeholder = "Select an option",
}) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={[styles.inputWrapper, selectedValue ? styles.activeBorder : styles.inactiveBorder]}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={(value) => {
            const selectedItem = items.find(item => item.code.toString() === value);
            if (selectedItem) {
              onValueChange(selectedItem); 
            }
          }}
          style={styles.picker}
          dropdownIconColor="#000"
        >
          <Picker.Item label={placeholder} value="" />
          {items.map((item) => (
            <Picker.Item
              key={item.code}
              label={item.name}
              value={item.code.toString()}
            />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.M,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: SPACING.XS,
    color: "#333",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderBottomWidth: 2,
    borderRadius: 16,
    paddingHorizontal: 4,
    paddingVertical: 4,
    backgroundColor: "#fff",
  },
  activeBorder: {
    borderColor: "#FFAF42",
  },
  inactiveBorder: {
    borderColor: "#ccc",
  },
  picker: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    height: 55,
  },
});
