import { StyleSheet, Text, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'src/presentation/store/store';
import { searchPlace, createAddress, resetCreateAddressStatus, setUserAddressData } from '../address.slice';
import { colors } from 'theme/colors';
import * as Location from 'expo-location';
import { Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

const AddressPickScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const webViewRef = useRef<WebView>(null);
  const { searchedLocation, userAddressData, createAddressStatus, createAddressError } = useSelector(
    (state: RootState) => state.newAddress
  );
  const [locationPermission, setLocationPermission] = useState<boolean>(false);

  // quyền truy cập vị trí
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === 'granted');
    })();
  }, []);

  // Tự động tìm địa chỉ 
  useEffect(() => {
    if (userAddressData?.province && userAddressData.district) {
      dispatch(searchPlace({ plainText: `${userAddressData.district}, ${userAddressData.province}, Việt Nam` }));
    }
  }, []);

  //  tìm được `searchedLocation`, cập nhật lại store
  useEffect(() => {
    if (searchedLocation) {
      dispatch(
        setUserAddressData({
          ...userAddressData,
          lat: Number(searchedLocation.lat),
          lng: Number(searchedLocation.lon),
          province: userAddressData?.province ?? '',
          district: userAddressData?.district ?? '',
          ward: userAddressData?.ward ?? '',
          streetAndNumber: userAddressData?.streetAndNumber ?? '',
          receiverFullname: userAddressData?.receiverFullname ?? ''
        })
      );

      // Di chuyển bản đồ tới vị trí mới
      webViewRef.current?.injectJavaScript(`
        setMarker(${searchedLocation.lat}, ${searchedLocation.lon});
        true;
      `);
    }
  }, [searchedLocation]);

  //  Xử lý nhấn bản đồ từ WebView
  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const { lat, lng } = JSON.parse(event.nativeEvent.data);
      dispatch(
        setUserAddressData({
          ...userAddressData,
          lat,
          lng,
          province: userAddressData?.province ?? '',
          district: userAddressData?.district ?? '',
          ward: userAddressData?.ward ?? '',
          streetAndNumber: userAddressData?.streetAndNumber ?? '',
          receiverFullname: userAddressData?.receiverFullname ?? ''
        })
      );
    } catch (error) {
      console.log('Invalid WebView message:', error);
    }
  };

  //  Dùng vị trí hiện tại
  const getCurrentLocation = async () => {
    try {
      if (!locationPermission) {
        await requestLocationPermission();
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });

      const { latitude, longitude } = location.coords;

      // Gửi vào bản đồ WebView
      webViewRef.current?.injectJavaScript(`setMarker(${latitude}, ${longitude}); true;`);

      dispatch(
        setUserAddressData({
          ...userAddressData,
          lat: latitude,
          lng: longitude,
          province: userAddressData?.province ?? '',
          district: userAddressData?.district ?? '',
          ward: userAddressData?.ward ?? '',
          streetAndNumber: userAddressData?.streetAndNumber ?? '',
          receiverFullname: userAddressData?.receiverFullname ?? ''
        })
      );
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể lấy vị trí hiện tại.');
    }
  };

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setLocationPermission(true);
        getCurrentLocation();
      } else {
        Alert.alert('Cần quyền truy cập vị trí', 'Vui lòng cấp quyền trong cài đặt.', [
          { text: 'Đóng', style: 'cancel' },
          { text: 'Mở cài đặt', onPress: () => Linking.openSettings() }
        ]);
      }
    } catch (error) {
      console.log('Lỗi khi xin quyền:', error);
    }
  };

  //  Tạo địa chỉ
  const handleCreateAddress = async () => {
    if (!userAddressData?.lat || !userAddressData.lng) {
      Alert.alert('Lỗi', 'Vui lòng chọn vị trí trên bản đồ');
      return;
    }

    try {
      await dispatch(createAddress(userAddressData)).unwrap();
      Alert.alert('Thành công', 'Địa chỉ đã được tạo thành công', [
        {
          text: 'OK',
          onPress: () => navigation.goBack()
        }
      ]);
    } catch (error) {
      Alert.alert('Lỗi', createAddressError || 'Không thể tạo địa chỉ mới');
    }
  };

  useEffect(() => {
    return () => {
      dispatch(resetCreateAddressStatus());
    };
  }, []);

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
      <style>html, body, #map { height: 100%; margin: 0; }</style>
    </head>
    <body>
      <div id="map"></div>
      <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
      <script>
        const map = L.map('map').setView([10.762622, 106.660172], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19
        }).addTo(map);
        let marker;
        function setMarker(lat, lng) {
          if (marker) {
            marker.setLatLng([lat, lng]);
          } else {
            marker = L.marker([lat, lng]).addTo(map);
          }
          map.setView([lat, lng], 16);
        }
        map.on('click', function(e) {
          const { lat, lng } = e.latlng;
          setMarker(lat, lng);
          window.ReactNativeWebView.postMessage(JSON.stringify({ lat, lng }));
        });
      </script>
    </body>
    </html>
  `;

  return (
    <View style={{ flex: 1 }}>
      <WebView
        ref={webViewRef}
        source={{ html }}
        onMessage={handleMessage}
        javaScriptEnabled
        originWhitelist={['*']}
        style={{ flex: 1 }}
      />

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text>Quay lại</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.locationButton} onPress={getCurrentLocation}>
        <Text style={styles.locationButtonText}>Dùng vị trí của tôi</Text>
      </TouchableOpacity>

      <View style={styles.wrapper}>
        <TouchableOpacity
          style={[styles.button, createAddressStatus === 'pending' && styles.buttonDisabled]}
          onPress={handleCreateAddress}
          disabled={createAddressStatus === 'pending'}
        >
          {createAddressStatus === 'pending' ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.buttonText}>Chọn và lưu</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddressPickScreen;

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.app.primary.main,
    padding: 16,
    borderRadius: 20,
    marginTop: 32,
    alignItems: 'center',
    flex: 1,
    width: '80%',
    marginHorizontal: 20
  },
  wrapper: {
    position: 'absolute',
    alignItems: 'center',
    bottom: 20,
    width: '100%'
  },
  buttonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16
  },
  locationButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: colors.app.primary.main,
    padding: 12,
    borderRadius: 30,
    elevation: 5
  },
  locationButtonText: {
    color: colors.white,
    fontWeight: '500'
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: colors.white,
    padding: 12,
    borderRadius: 30,
    elevation: 5
  },
  buttonDisabled: {
    opacity: 0.7
  }
});

//code cũ này phải có gg api key nếu dùng android
{/*import { StyleSheet, Text, TouchableOpacity, View, Alert, ActivityIndicator } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import MapView, { MapPressEvent, Marker, Region } from 'react-native-maps'
import { searchPlace, createAddress, resetCreateAddressStatus } from '../address.slice'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/presentation/store/store'
import { clearSuggest, setUserAddressData } from '../address.slice'
import { colors } from 'theme/colors'
import * as Location from 'expo-location'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Linking } from 'react-native'
import { useNavigation } from '@react-navigation/native'

const AddressPickScreen = () => {
    const dispatch = useDispatch<AppDispatch>()
    const navigation = useNavigation()
    let { searchedLocation, userAddressData, createAddressStatus, createAddressError } = useSelector((state: RootState) => state.newAddress)
    const [locationPermission, setLocationPermission] = useState<boolean>(false);

    let INITIAL_REGION: Region = {
        latitude: 10.762622,
        longitude: 106.660172,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    };
    const mapRef = useRef<MapView | null>(null);

    useEffect(() => {
        (async () => {
            const { status } = await Location.requestForegroundPermissionsAsync();
            setLocationPermission(status === 'granted');
        })();
    }, []);

    useEffect(() => {
        // if (!userAddressData) {
        //     console.error('data thieeus');

        //     return
        // }
        // // ${userAddressData.streetAndNumber}, ${userAddressData.province},
        // dispatch(searchPlace({ plainText: ${userAddressData.district}, ${userAddressData.province}, Việt Nam }))
    }, [])

    useEffect(() => {
        if (searchedLocation) {
            dispatch(setUserAddressData({
                ...userAddressData,
                lat: Number(searchedLocation.lat),
                lng: Number(searchedLocation.lon),
                province: userAddressData?.province ?? "",
                district: userAddressData?.district ?? "",
                ward: userAddressData?.ward ?? "",
                streetAndNumber: userAddressData?.streetAndNumber ?? "",
                receiverFullname:userAddressData?.receiverFullname ?? ""
            }))

        }
    }, [searchedLocation])
    useEffect(() => {
        if (userAddressData?.lat && userAddressData.lng) {
            const region: Region = {
                latitude: userAddressData.lat,
                longitude: userAddressData.lng,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            }
            mapRef.current?.animateToRegion(region)
        }
    }, [userAddressData])

    const requestLocationPermission = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status === 'granted') {
                setLocationPermission(true);
                getCurrentLocation();
            } else {
                Alert.alert(
                    "Cần quyền truy cập vị trí",
                    "Để sử dụng tính năng này, vui lòng cấp quyền truy cập vị trí trong cài đặt của thiết bị.",
                    [
                        {
                            text: "Đóng",
                            style: "cancel"
                        },
                        {
                            text: "Mở cài đặt",
                            onPress: () => {
                                // Mở cài đặt ứng dụng
                                Linking.openSettings();
                            }
                        }
                    ]
                );
            }
        } catch (error) {
            console.log('Lỗi khi yêu cầu quyền truy cập vị trí:', error);
        }
    };

    const getCurrentLocation = async () => {
        try {
            if (!locationPermission) {
                await requestLocationPermission();
                return;
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High
            });

            const { latitude, longitude } = location.coords;
            const region: Region = {
                latitude,
                longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            };

            mapRef.current?.animateToRegion(region);
            dispatch(setUserAddressData({
                ...userAddressData,
                lat: latitude,
                lng: longitude,
                province: userAddressData?.province ?? "",
                district: userAddressData?.district ?? "",
                ward: userAddressData?.ward ?? "",
                streetAndNumber: userAddressData?.streetAndNumber ?? "",
                receiverFullname:userAddressData?.receiverFullname ?? ""
            }));
        } catch (error) {
            console.log('Lỗi khi lấy vị trí:', error);
            Alert.alert(
                "Lỗi",
                "Không thể lấy vị trí hiện tại. Vui lòng thử lại sau.",
                [{ text: "OK" }]
            );
        }
    };

    const onMapPress = async (event: MapPressEvent) => {
        const { coordinate } = event.nativeEvent;
        dispatch(setUserAddressData({
            ...userAddressData,
            lat: coordinate.latitude,
            lng: coordinate.longitude,
            province: userAddressData?.province ?? "",
            district: userAddressData?.district ?? "",
            ward: userAddressData?.ward ?? "",
            streetAndNumber: userAddressData?.streetAndNumber ?? "",
            receiverFullname:userAddressData?.receiverFullname ?? ""
        }))

    };

    const handleCreateAddress = async () => {
        if (!userAddressData) {
            Alert.alert("Lỗi", "Vui lòng chọn vị trí trên bản đồ");
            return;
        }

        try {
            await dispatch(createAddress(userAddressData)).unwrap();
            Alert.alert(
                "Thành công",
                "Địa chỉ đã được tạo thành công",
                [
                    {
                        text: "OK",
                        onPress: () => {
                            navigation.goBack();
                        }
                    }
                ]
            );
        } catch (error) {
            Alert.alert("Lỗi", createAddressError || "Không thể tạo địa chỉ mới");
        }
    };

    useEffect(() => {
        return () => {
            dispatch(resetCreateAddressStatus());
        };
    }, []);

    return (
        <View style={{ flex: 1, position: 'relative' }}>
            <MapView
                style={StyleSheet.absoluteFillObject}
                initialRegion={INITIAL_REGION}
                ref={mapRef}
                onPress={onMapPress}
                showsUserLocation
                showsMyLocationButton
                mapType='standard'
            >
                {userAddressData?.lat && userAddressData?.lng && (
                    <Marker
                        coordinate={{
                            latitude: userAddressData.lat,
                            longitude: userAddressData.lng,
                        }}
                        title={searchedLocation?.display_name || "vị trí"}
                        pinColor="red"
                    />
                )}

            </MapView>

            <TouchableOpacity
                style={styles.locationButton}
                onPress={getCurrentLocation}
            >
                <Text style={styles.locationButtonText}>Dùng vị trí của tôi</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Text>Quay lại</Text>
            </TouchableOpacity>
            <View style={styles.wrapper}>
                <TouchableOpacity 
                    style={[styles.button, createAddressStatus === "pending" && styles.buttonDisabled]} 
                    onPress={handleCreateAddress}
                    disabled={createAddressStatus === "pending"}
                >
                    {createAddressStatus === "pending" ? (
                        <ActivityIndicator color={colors.white} />
                    ) : (
                        <Text style={styles.buttonText}>Chọn và lưu</Text>
                    )}
                </TouchableOpacity>
            </View>

        </View>
    )
}

export default AddressPickScreen

const styles = StyleSheet.create({
    button: {
        backgroundColor: colors.app.primary.main,
        padding: 16,
        borderRadius: 20,
        marginTop: 32,
        alignItems: "center",
        flex:1,
        width:"80%",
        marginHorizontal: 20
    },
    wrapper: {
        position: 'absolute',
        alignItems: "center",
        bottom: 20,
        width:'100%'
    },
    buttonText: {
        color: colors.white,
        fontWeight: "bold",
        fontSize: 16,
    },
    locationButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: colors.app.primary.main,
        padding: 12,
        borderRadius: 30,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        backgroundColor: colors.white,
        padding: 12,
        borderRadius: 30,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    buttonDisabled: {
        opacity: 0.7
    },
    locationButtonText: {
        color: colors.white,
        fontWeight: '500'
    }
})
    */}