import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
    Pressable,
    Image
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { getProvinces, getDistricts, getWards } from "../newaddress.slice";
import { AppDispatch, RootState } from "src/presentation/store/store";
import { Ionicons } from "@expo/vector-icons";
import { LocationPicker } from "../components/LocationPicker";
import { FormInput } from "shared/components/forms/FormInput";
import { useNavigation } from "@react-navigation/native";
import { assets } from "../../../shared/theme/assets";


export const NewAddressScreen = () => {
const navigation = useNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { provinces, districts, wards } = useSelector(
    (state: RootState) => state.newAddress
  );

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    dispatch(getProvinces());
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      setSelectedDistrict("");
      setSelectedWard("");
      dispatch(getDistricts(selectedProvince));
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      setSelectedWard("");
      dispatch(getWards(selectedDistrict));
    }
  }, [selectedDistrict]);

  const handleSave = () => {
    if (
      !fullName.trim() ||
      !phoneNumber.trim() ||
      !selectedProvince ||
      !selectedDistrict ||
      !selectedWard ||
      !houseNumber.trim()
    ) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin địa chỉ.");
      return;
    }

    const newAddress = {
      fullName,
      phoneNumber,
      provinceCode: Number(selectedProvince),
      districtCode: Number(selectedDistrict),
      wardCode: Number(selectedWard),
      houseNumber,
    };

      console.log("Luu thanh cong:", newAddress);
      
      Alert.alert("Thành công", "Đã thêm địa chỉ mới", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={assets.icons.back} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add new adress</Text>
        <View style={{ width: 24 }} /> 
      </View>

      <FormInput
        label="Full name"
        value={fullName}
        onChangeText={setFullName}
        placeholder="Enter full name"
        inputWrapperStyle={{
          borderColor: fullName.trim() !== "" ? "#FFAF42" : "#ccc",
        }}
      />

      <FormInput
        label="Phone number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="Enter phone number"
        inputWrapperStyle={{
          borderColor: phoneNumber.trim() !== "" ? "#FFAF42" : "#ccc",
        }}
        leftIcon={
          <Text style={{ fontSize: 16, color: "#000", marginTop: -3 }}>
            (+1)
          </Text>
        }
      />

      <LocationPicker
        label="City"
        selectedValue={selectedProvince}
        onValueChange={setSelectedProvince}
        items={provinces}
        placeholder="Select city"
      />

      <LocationPicker
        label="District"
        selectedValue={selectedDistrict}
        onValueChange={setSelectedDistrict}
        items={districts}
        placeholder="Select district"
      />

      <LocationPicker
        label="Ward"
        selectedValue={selectedWard}
        onValueChange={setSelectedWard}
        items={wards}
        placeholder="Select ward"
      />

      <FormInput
        label="House number"
        value={houseNumber}
        onChangeText={setHouseNumber}
        placeholder="Enter house number"
        inputWrapperStyle={{
          borderColor: houseNumber.trim() !== "" ? "#FFA63D" : "#ccc",
        }}
      />

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>SAVE</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  backIcon: {
    width: 20,
    height: 20,
    color: "#000",
  },
  button: {
    backgroundColor: "#FFAF42",
    padding: 16,
    borderRadius: 20,
    marginTop: 32,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
