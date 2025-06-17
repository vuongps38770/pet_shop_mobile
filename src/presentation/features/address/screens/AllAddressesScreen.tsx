import { StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from 'src/presentation/store/store'
import { getMyAddresses } from '../address.slice'
import { colors } from 'theme/colors'
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import AllAddressItem from '../components/AllAddressItem'
import { useMainNavigation } from 'shared/hooks/navigation-hooks/useMainNavigationHooks'

const AllAddressesScreen = () => {
    const dispatch = useDispatch<AppDispatch>()
    const navigation = useMainNavigation()
    const { myAddresses, fetchMyAddressesStatus, fetchMyAddressesError } = useSelector((state: RootState) => state.newAddress)

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

    const handleDelete = (addressId: string) => {
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
                    onPress: () => {
                        // TODO: Implement delete functionality
                        console.log('Delete address:', addressId)
                    }
                }
            ]
        )
    }

    const handleSetDefault = (addressId: string) => {
        // TODO: Implement set default functionality
        console.log('Set default address:', addressId)
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
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-back" size={24} color={colors.text.primary} />
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
        padding: 16,
        backgroundColor: colors.white,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    backButton: {
        marginRight: 16
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text.primary
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
    }
})