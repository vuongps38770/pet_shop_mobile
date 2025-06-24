import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Animated, Dimensions } from 'react-native';
import { colors } from 'shared/theme/colors';
import { AddressResDto } from 'src/presentation/dto/res/address.respond.dto';

interface AddressModalProps {
  isVisible: boolean;
  onClose: () => void;
  addresses: AddressResDto[];
  selectedAddressId: string | undefined;
  onSelectAddress: (id: string) => void;
  onCreateNewAddress: () => void;
  slideAnim: Animated.Value;
}

export const AddressModal: React.FC<AddressModalProps> = ({
  isVisible,
  onClose,
  addresses,
  selectedAddressId = '',
  onSelectAddress,
  onCreateNewAddress,
  slideAnim,
}) => {
  return (
    <Modal
      visible={isVisible}
      animationType="none"
      transparent
      onRequestClose={onClose}
    >
      <Animated.View style={[styles.modalOverlay, { transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.modalContent}>
          <View style={{ alignItems: 'center', marginBottom: 8 }}>
            <View style={styles.modalHandle} />
          </View>
          <Text style={styles.title}>Chọn địa chỉ giao hàng</Text>
          {addresses.length === 0 ? (
            <Text style={{ marginBottom: 8 }}>Bạn chưa có địa chỉ nào.</Text>
          ) : (
            addresses.map((address) => (
              <TouchableOpacity
                key={address._id}
                style={[
                  styles.addressItem,
                  selectedAddressId === address._id && styles.addressItemSelected,
                ]}
                onPress={() => onSelectAddress(address._id)}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: 'bold' }}>{address.receiverFullname}</Text>
                  <Text>{address.streetAndNumber}, {address.ward}, {address.district}, {address.province}</Text>
                  {address.isDefault && <Text style={styles.defaultLabel}>Mặc định</Text>}
                  <Text style={styles.dateLabel}>Tạo: {new Date(address.createdDate).toLocaleString()}</Text>
                </View>
                {selectedAddressId === address._id && (
                  <Text style={{ color: colors.app.primary.main, fontWeight: 'bold' }}>Đã chọn</Text>
                )}
              </TouchableOpacity>
            ))
          )}
          <TouchableOpacity style={styles.createAddressBtn} onPress={onCreateNewAddress}>
            <Text style={styles.createAddressText}>+ Tạo địa chỉ mới</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeModalBtn} onPress={onClose}>
            <Text style={styles.closeModalText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    padding: 16,
    paddingBottom: 32,
    minHeight: 200,
  },
  modalHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#ccc',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginVertical: 12,
  },
  addressItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  addressItemSelected: {
    borderColor: colors.app.primary.main,
    backgroundColor: '#FFF8E1',
  },
  defaultLabel: {
    color: '#FFAF42',
    fontWeight: 'bold',
    fontSize: 12,
  },
  dateLabel: {
    color: '#888',
    fontSize: 11,
  },
  createAddressBtn: {
    marginBottom: 16,
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: '#FFAF42',
    borderRadius: 16,
  },
  createAddressText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  closeModalBtn: {
    marginTop: 12,
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 24,
    backgroundColor: '#eee',
    borderRadius: 16,
  },
  closeModalText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 14,
  },
}); 