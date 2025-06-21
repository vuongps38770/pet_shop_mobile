import React, { use, useCallback, useEffect, useState } from "react";
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
import { getProvinces, getDistricts, getWards, getSuggestionPlace } from "../address.slice";
import { AppDispatch, RootState } from "src/presentation/store/store";
import { Ionicons } from "@expo/vector-icons";
import { LocationPicker } from "../components/LocationPicker";
import { FormInput } from "shared/components/forms/FormInput";
import { useNavigation } from "@react-navigation/native";
import { assets } from "../../../shared/theme/assets";
import { colors } from "theme/colors";
import { LocationDTO } from "src/presentation/dto/res/newaddress-respond.dto";
import { useMainNavigation } from "shared/hooks/navigation-hooks/useMainNavigationHooks";
import { FlatList } from "react-native-gesture-handler";
import { debounce } from "lodash";
import { clearSuggest,setUserAddressData } from '../address.slice'
import AvoidKeyboardDummyView from "shared/components/AvoidKeyboardDummyView";
import provincestest from 'src/app/constants/test-address.json'
import { LogBox } from 'react-native';
import { AddressReqDto } from "src/presentation/dto/req/address.req.dto";
LogBox.ignoreLogs([
  'VirtualizedLists should never be nested', // Ẩn cảnh báo này
]);
export const NewAddressScreen = () => {
  const navigation = useMainNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const { provinces, districts, wards } = useSelector(
    (state: RootState) => state.newAddress
  );

  const [selectedProvince, setSelectedProvince] = useState<LocationDTO | null>();
  const [selectedDistrict, setSelectedDistrict] = useState<LocationDTO | null>();
  const [selectedWard, setSelectedWard] = useState<LocationDTO | null>();
  const [houseNumber, setHouseNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const { addressSuggestionList, fetchAddressSuggestionStatus, } = useSelector((state: RootState) => state.newAddress)
  const [currentBoxLat, setCurrentBoxLat] = useState<number | undefined>(undefined);
  const [currentBoxLon, setCurrentBoxLon] = useState<number | undefined>(undefined);
  useEffect(() => { dispatch(clearSuggest()) }, [])
  useEffect(() => {
    dispatch(getProvinces());
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      setSelectedDistrict(null);
      setSelectedWard(null);
      dispatch(getDistricts(selectedProvince.code.toString()));
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      setSelectedWard(null);
      dispatch(getWards(selectedDistrict.code.toString()));
    }
  }, [selectedDistrict]);

  useEffect(() => {
    if (!selectedProvince) return
    const selected = provincestest.find(p => p.code === selectedProvince.code);
    const lat = selected?.lat;
    const lon = selected?.lon;
    setCurrentBoxLat(lat);
    setCurrentBoxLon(lon);

    console.log(`Selected province: ${selectedProvince.name}, Lat: ${lat}, Lon: ${lon}`);
  }, [selectedProvince])

  const debouncedFetchSuggestions = useCallback(
    debounce((text: string) => {
      dispatch(getSuggestionPlace({ lat: currentBoxLat, lon: currentBoxLon, plainText: text }));
    }, 1000),
    []
  );

  const handleSearchLocation = (text: string) => {

    if (!selectedDistrict?.name || !selectedProvince?.name || !selectedWard?.name) return
    console.log(`${text}, ${selectedWard.name}, ${selectedDistrict.name}, ${selectedProvince.name}`);

    debouncedFetchSuggestions(`${text}, ${selectedWard.name}, ${selectedDistrict.name}, ${selectedProvince.name}, Việt Nam`);
  };





  // theo dõi thay đổi địa chỉ
  useEffect(() => {
    if (!selectedWard || !selectedDistrict || !selectedProvince) {
      dispatch(clearSuggest());
      return;
    }
    handleSearchLocation(houseNumber);
  }, [houseNumber, selectedWard, selectedDistrict, selectedProvince])

  const handleSave = () => {
    if (
      !fullName.trim() ||
      !phoneNumber.trim() ||
      !selectedProvince ||
      !selectedDistrict ||
      !selectedWard ||
      !fullName||
      !houseNumber.trim()
    ) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin địa chỉ.");
      return;
    }

    const newAddress:AddressReqDto = {
      district:selectedDistrict.name,
      province:selectedProvince.name,
      streetAndNumber:houseNumber,
      ward:selectedWard.name,
      receiverFullname:fullName
    };
    dispatch(setUserAddressData(newAddress))

    //   console.log("Luu thanh cong:", newAddress);


    navigation.navigate("AddressPickScreen")

    // Alert.alert("Thành công", "Đã thêm địa chỉ mới", [
    //   {
    //     text: "OK",
    //     onPress: () => navigation.goBack(),
    //   },
    // ]);
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
          borderColor: fullName.trim() !== "" ? colors.app.primary.main : "#ccc",
        }}
      />

      <FormInput
        label="Phone number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="Enter phone number"
        inputWrapperStyle={{
          borderColor: phoneNumber.trim() !== "" ? colors.app.primary.main : "#ccc",
        }}
        leftIcon={
          <Text style={{ fontSize: 16, color: "#000", marginTop: -3 }}>

          </Text>
        }
      />

      <LocationPicker
        label="City"
        selectedValue={selectedProvince?.code.toString() ?? ""}
        onValueChange={setSelectedProvince}
        items={provinces}
        placeholder="Select city"
      />

      <LocationPicker
        label="District"
        selectedValue={selectedDistrict?.code.toString() ?? ""}
        onValueChange={setSelectedDistrict}
        items={districts}
        placeholder="Select district"
      />

      <LocationPicker
        label="Ward"
        selectedValue={selectedWard?.code.toString() ?? ""}
        onValueChange={setSelectedWard}
        items={wards}
        placeholder="Select ward"
      />

      <FormInput
        label="House number"
        value={houseNumber}
        onChangeText={(text) => {
          setHouseNumber(text);
          handleSearchLocation(text);
        }}
        placeholder="Enter house number"
        inputWrapperStyle={{
          borderColor: houseNumber.trim() !== "" ? "#FFA63D" : "#ccc",
        }}
      />



      {fetchAddressSuggestionStatus === 'pending' && (
        <View style={{ padding: 16 }}>
          <Text>Loading suggestions...</Text>
        </View>
      )}
      {(fetchAddressSuggestionStatus === 'success' && addressSuggestionList.length > 0) ?(
        <FlatList
          data={addressSuggestionList}
          keyExtractor={(item) => item.place_id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.suggestionItem}
              onPress={() => {

              }}
            >
              <Text style={styles.suggestionText}>{item.display_name}</Text>
            </TouchableOpacity>
          )}
          style={styles.suggestionsList}
        />
      ):null}

      <AvoidKeyboardDummyView />
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
  suggestionsList: {
    maxHeight: 200, // Giới hạn chiều cao danh sách gợi ý
    borderTopWidth: 1,
    borderTopColor: '#eee',
    // backgroundColor: 'white', // Đã được bao bởi searchContainer
    // paddingHorizontal: 10,
    // paddingVertical: 5,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  suggestionText: {
    fontSize: 16,
    color: '#333',
  },
});
