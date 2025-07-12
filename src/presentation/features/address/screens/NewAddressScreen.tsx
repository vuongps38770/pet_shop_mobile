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
  Image,
  StatusBar,
  Platform
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

  const [fullNameError, setFullNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Validate tên
  const validateFullName = (name: string) => {
    if (!name.trim()) return 'Vui lòng nhập họ và tên';
    if (/[^a-zA-ZÀ-ỹà-ỹ\s]/.test(name)) return 'Tên không được chứa số hoặc ký tự đặc biệt';
    if (name.trim().split(' ').length < 2) return 'Vui lòng nhập đầy đủ họ và tên';
    return '';
  };

  // Validate số điện thoại
  const validatePhone = (phone: string) => {
    if (!phone.trim()) return 'Vui lòng nhập số điện thoại';
    if (!/^0\d{9}$/.test(phone)) return 'Số điện thoại phải bắt đầu bằng 0 và đủ 10 số';
    return '';
  };

  // Khi thay đổi tên
  const handleFullNameChange = (text: string) => {
    setFullName(text);
    setFullNameError(validateFullName(text));
  };

  // Khi thay đổi sđt
  const handlePhoneChange = (text: string) => {
    setPhoneNumber(text);
    setPhoneError(validatePhone(text));
  };

  const handleSave = () => {
    const nameErr = validateFullName(fullName);
    const phoneErr = validatePhone(phoneNumber);
    setFullNameError(nameErr);
    setPhoneError(phoneErr);
    if (nameErr || phoneErr) {
      Alert.alert("Lỗi", nameErr || phoneErr);
      return;
    }
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
          <Image source={assets.icons.back} style={[styles.backIcon, {tintColor: colors.black}]} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thêm địa chỉ mới</Text>
        <View style={{ width: 24 }} />
      </View>

      <FormInput
        label="Họ và tên"
        value={fullName}
        onChangeText={handleFullNameChange}
        placeholder="Nhập họ và tên"
        inputWrapperStyle={{
          borderColor: fullName.trim() !== "" ? colors.app.primary.main : "#ccc",
        }}
        error={fullNameError}
      />

      <FormInput
        label="Số điện thoại"
        value={phoneNumber}
        onChangeText={handlePhoneChange}
        placeholder="Nhập số điện thoại"
        inputWrapperStyle={{
          borderColor: phoneNumber.trim() !== "" ? colors.app.primary.main : "#ccc",
        }}
        error={phoneError}
      />

      <LocationPicker
        label="Tỉnh/Thành phố"
        selectedValue={selectedProvince?.code.toString() ?? ""}
        onValueChange={setSelectedProvince}
        items={provinces}
        placeholder="Chọn tỉnh/thành phố"
      />

      <LocationPicker
        label="Quận/Huyện"
        selectedValue={selectedDistrict?.code.toString() ?? ""}
        onValueChange={setSelectedDistrict}
        items={districts}
        placeholder="Chọn quận/huyện"
      />

      <LocationPicker
        label="Phường/Xã"
        selectedValue={selectedWard?.code.toString() ?? ""}
        onValueChange={setSelectedWard}
        items={wards}
        placeholder="Chọn phường/xã"
      />

      <FormInput
        label="Số nhà, tên đường"
        value={houseNumber}
        onChangeText={(text) => {
          setHouseNumber(text);
          handleSearchLocation(text);
        }}
        placeholder="Nhập số nhà, tên đường"
        inputWrapperStyle={{
          borderColor: houseNumber.trim() !== "" ? colors.app.primary.main : "#ccc",
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
        <Text style={styles.buttonText}>Tiếp tục</Text>
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
    paddingTop: Platform.OS === 'android' ? 0 : 24,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.black,
  },
  backIcon: {
    width: 20,
    height: 20,
    tintColor: colors.white,
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
