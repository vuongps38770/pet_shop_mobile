import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { AddressResDto } from 'src/presentation/dto/res/address.respond.dto'
import { colors } from 'theme/colors'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

interface AllAddressItemProps {
    address: AddressResDto;
    onEdit?: (address: AddressResDto) => void;
    onDelete?: (addressId: string) => void;
    onSetDefault?: (addressId: string) => void;
}

const AllAddressItem = ({ address, onEdit, onDelete, onSetDefault }: AllAddressItemProps) => {
    return (
        <View style={styles.addressItem}>
            <View style={styles.addressHeader}>
                <View style={styles.nameContainer}>
                    <Text style={styles.name}>{address.receiverFullname}</Text>
                    {address.isDefault && (
                        <View style={styles.defaultBadge}>
                            <Text style={styles.defaultText}>Mặc định</Text>
                        </View>
                    )}
                </View>
                <Text style={styles.date}>
                    {format(new Date(address.createdDate), 'dd/MM/yyyy', { locale: vi })}
                </Text>
            </View>

            <Text style={styles.address}>
                {address.streetAndNumber}, {address.ward}, {address.district}, {address.province}
            </Text>

            <View style={styles.actionContainer}>
                {!address.isDefault && (
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => onSetDefault?.(address._id)}
                    >
                        <Icon name="star" size={20} color={colors.app.primary.main} />
                        <Text style={[styles.actionText, { color: colors.app.primary.main }]}>
                            Đặt làm mặc định
                        </Text>
                    </TouchableOpacity>
                )}

                <View style={styles.rightActions}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.editButton]}
                        onPress={() => onEdit?.(address)}
                    >
                        <Icon name="edit" size={20} color={colors.text.secondary} />
                        <Text style={[styles.actionText, { color: colors.text.secondary }]}>
                            Sửa
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionButton, styles.deleteButton]}
                        onPress={() => onDelete?.(address._id)}
                    >
                        <Icon name="delete" size={20} color={colors.error} />
                        <Text style={[styles.actionText, { color: colors.error }]}>
                            Xóa
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default AllAddressItem

const styles = StyleSheet.create({
    addressItem: {
        backgroundColor: colors.white,
        borderRadius: 8,
        padding: 16,
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    addressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text.primary,
        marginRight: 8
    },
    defaultBadge: {
        backgroundColor: colors.app.primary.main,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4
    },
    defaultText: {
        color: colors.white,
        fontSize: 12,
        fontWeight: '500'
    },
    date: {
        fontSize: 12,
        color: colors.text.secondary
    },
    address: {
        fontSize: 14,
        color: colors.text.secondary,
        lineHeight: 20,
        marginBottom: 12
    },
    actionContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingTop: 12
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 4
    },
    actionText: {
        fontSize: 14,
        marginLeft: 4
    },
    rightActions: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    editButton: {
        marginRight: 16
    },
    deleteButton: {
        marginLeft: 8
    }
})