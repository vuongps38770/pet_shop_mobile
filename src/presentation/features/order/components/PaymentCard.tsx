// components/PaymentMethodCard.tsx
import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { RadioButton } from "react-native-paper";
import { colors } from "shared/theme/colors";

interface PaymentCardProps {
  title:string;
  selected: boolean;
  onSelect: () => void;
  icon: any;
  value:string
}

export const PaymentCard: React.FC<PaymentCardProps> = ({
  title,
  selected,
  onSelect,
  icon,
  value
}) => {


  return (
    <TouchableOpacity
      style={[
        styles.cardContainer,
        {
          borderColor: selected ? colors.app.primary.main : "#ccc",
          borderWidth: 2,
        },
      ]}
      onPress={onSelect}
    >
      <View style={styles.cardContent}>
        <Image source={icon} style={styles.cardLogo} />
        <View style={styles.cardInfo}>
          <Text style={styles.cardType}>{title}</Text>
          <Text style={styles.cardNumberWhite}>1501 **** **** 0001</Text>
        </View>
        <RadioButton
          value={value}
          status={selected ? "checked" : "unchecked"}
          onPress={onSelect}
          color={colors.app.primary.main}
          uncheckedColor="#000"
        />
      </View>
    </TouchableOpacity>
  );
};


const styles = StyleSheet.create({
cardContainer: {
    backgroundColor: "#F4F4F4",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
        borderWidth: 2,
        shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
        shadowRadius: 6,
    elevation: 5,
  
  },
cardSelected: {
    borderWidth: 2,
    borderColor: "#FFF",
},
cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardLogo: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 15,
  },
  cardInfo: {
    flex: 1,
    justifyContent: "center",
  },
  cardType: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  cardNumberWhite: {
    fontSize: 14,
    color: "#000",
    marginTop: 2,
  },
});
  


