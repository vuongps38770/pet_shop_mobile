import { StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/presentation/store/store'
import { getMyAddresses } from '../address.slice'
import { colors } from 'theme/colors'
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import AllAddressItem from '../components/AllAddressItem'
import { useMainNavigation } from 'shared/hooks/navigation-hooks/useMainNavigationHooks'
import { StatusBar, Platform } from 'react-native'
import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from 'app/config/axios';

// Thunk xóa địa chỉ
export const deleteAddress = createAsyncThunk(
  'address/deleteAddress',
  async (addressId: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/address/delete/${addressId}`);
      return addressId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi xóa địa chỉ');
    }
  }
);

// Thunk đặt làm mặc định
export const setDefaultAddress = createAsyncThunk(
  'address/setDefaultAddress',
  async (addressId: string, { rejectWithValue }) => {
    try {
      await axiosInstance.patch(`/address/set-default/${addressId}`);
      return addressId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Lỗi khi đặt làm mặc định');
    }
  }
);

const AllAddressesScreen = () => {
    const dispatch = useDispatch<AppDispatch>()
    const navigation = useMainNavigation()
    const { myAddresses, fetchMyAddressesStatus, fetchMyAddressesError } = useSelector((state: RootState) => state.newAddress)
    const [actionLoading, setActionLoading] = useState(false)

    useEffect(() => {
        dispatch(getMyAddresses())
    }, [])

    const sortedAddresses = [...myAddresses].sort((a, b) => {
        if (a.isDefault) return -1
        if (b.isDefault) return 1
        return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
    })

    const handleEdit = (address: any) => {
        // TODO: Implement edit functionality
        console.log('Edit address:', address)
    }

    const handleDelete = async (addressId: string) => {
        Alert.alert(
            "Xác nhận xóa",
            "Bạn có chắc chắn muốn xóa địa chỉ này?",
            [
                {
                    text: "Hủy",
                    style: "cancel"
                },
                {
                    text: "Xóa",
                    style: "destructive",
                    onPress: async () => {
                        setActionLoading(true)
                        try {
                            await dispatch(deleteAddress(addressId)).unwrap()
                            await dispatch(getMyAddresses())
                        } catch (e) {
                            Alert.alert('Lỗi', 'Không thể xóa địa chỉ!')
                        } finally {
                            setActionLoading(false)
                        }
                    }
                }
            ]
        )
    }

    const handleSetDefault = async (addressId: string) => {
        setActionLoading(true)
        try {
            await dispatch(setDefaultAddress(addressId)).unwrap()
            await dispatch(getMyAddresses())
        } catch (e) {
            Alert.alert('Lỗi', 'Không thể đặt làm mặc định!')
        } finally {
            setActionLoading(false)
        }
    }

    const renderContent = () => {
        if (fetchMyAddressesStatus === "pending") {
            return (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={colors.app.primary.main} />
                </View>
            )
        }

        if (fetchMyAddressesStatus === "error") {
            return (
                <View style={styles.centerContainer}>
                    <Text style={styles.errorText}>{fetchMyAddressesError}</Text>
                </View>
            )
        }

        if (sortedAddresses.length === 0) {
            return (
                <View style={styles.centerContainer}>
                    <Text style={styles.emptyText}>Chưa có địa chỉ nào</Text>
                </View>
            )
        }

        return (
            <FlatList
                data={sortedAddresses}
                renderItem={({ item }) => (
                    <AllAddressItem
                        address={item}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onSetDefault={handleSetDefault}
                    />
                )}
                keyExtractor={item => item._id}
                contentContainerStyle={styles.listContainer}
            />
        )
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={colors.app.primary.main} barStyle="light-content" />
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-back" size={24} color={colors.white} />
                </TouchableOpacity>
                <Text style={styles.title}>Địa chỉ của tôi</Text>
            </View>

            {renderContent()}

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('NewAddressScreen')}
            >
                <Icon name="add" size={24} color={colors.white} />
                <Text style={styles.addButtonText}>Thêm địa chỉ mới</Text>
            </TouchableOpacity>

            {actionLoading && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color={colors.app.primary.main} />
                </View>
            )}
        </View>
    )
}

export default AllAddressesScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.default
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: Platform.OS === 'android' ? 0 : 24,
        paddingBottom: 12,
        paddingHorizontal: 16,
        backgroundColor: colors.app.primary.main,
        borderBottomWidth: 1,
        borderBottomColor: colors.app.primary.main,
    },
    backButton: {
        marginRight: 16
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.white,
    },
    listContainer: {
        padding: 16
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    errorText: {
        color: colors.error,
        fontSize: 16
    },
    emptyText: {
        color: colors.text.secondary,
        fontSize: 16
    },
    addButton: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: colors.app.primary.main,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 8,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    addButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.15)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
})