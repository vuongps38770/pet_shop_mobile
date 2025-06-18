import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

const PendingScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.status}>Đang chờ thanh toán</Text>
      <Text style={styles.warning}>
        Cùng Shop bảo vệ quyền lợi của bạn -{" "}
        <Text style={styles.bold}>KHÔNG CHUYỂN TIỀN TRƯỚC</Text> cho Shipper khi
        đơn hàng chưa được giao tới với bất kỳ lý do gì
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("MainScreen" as never)} 
        >
          <Text style={styles.backText}>Trở về</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.orderButton}
          
        >
          <Text style={styles.orderText}>Đơn mua</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PendingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFAF42",
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  status: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 24,
  },
  warning: {
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 20,
  },
  bold: {
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 20,
  },
  backButton: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginRight: 12,
  },
  backText: {
    width: 60,
    textAlign: "center",
    color: "#FFAF42",
    fontWeight: "bold",
  },
  orderButton: {
    borderColor: "#fff",
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  orderText: {
    width: 60,
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
});
