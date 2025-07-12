import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from 'shared/theme/colors';

interface ShippingAddressProps {
  selectedAddress: {
    _id: string;
    receiverFullname: string;
    streetAndNumber: string;
    ward: string;
    district: string;
    province: string;
    isDefault: boolean;
  } | undefined;
  onPress: () => void;
}

export const ShippingAddress: React.FC<ShippingAddressProps> = ({
  selectedAddress,
  onPress,
}) => {
  return (
    <>
      
      <TouchableOpacity style={styles.selectedAddressBox} onPress={onPress}>
        {selectedAddress ? (
          <>
            <Text style={{ fontWeight: 'bold' }}>{selectedAddress.receiverFullname}</Text>
            <Text numberOfLines={1} style={{ maxWidth: '90%' }}>
              {selectedAddress.streetAndNumber}, {selectedAddress.ward}, {selectedAddress.district},{' '}
              {selectedAddress.province}
            </Text>
            {selectedAddress.isDefault && <Text style={styles.defaultLabel}>Mặc định</Text>}
          </>
        ) : (
          <Text>Chọn địa chỉ giao hàng</Text>
        )}
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginVertical: 12,
  },
  selectedAddressBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  defaultLabel: {
    color: '#FFAF42',
    fontWeight: 'bold',
    fontSize: 12,
  },
}); 