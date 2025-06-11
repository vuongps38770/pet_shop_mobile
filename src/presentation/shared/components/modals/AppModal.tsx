import React from 'react';
import { StyleSheet, Text, View, Modal, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';

interface AppModalProps {
  visible: boolean;
  onClose: () => void; // Hàm đóng modal khi nhấn backdrop hoặc từ bên ngoài
  title: string;
  content: string | React.ReactNode; // Nội dung modal, có thể là string hoặc JSX
  positiveButtonText?: string;
  onPositivePress?: () => void;
  negativeButtonText?: string;
  onNegativePress?: () => void;
  hidePositiveButton?: boolean;
  hideNegativeButton?: boolean;
  isImageVisible?: boolean; // Tùy chọn hiển thị icon/ảnh thành công
}

const AppModal: React.FC<AppModalProps> = ({
  visible,
  onClose,
  title,
  content,
  positiveButtonText,
  onPositivePress,
  negativeButtonText,
  onNegativePress,
  hidePositiveButton = false,
  hideNegativeButton = false,
  isImageVisible = false, // Mặc định ẩn ảnh
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose} // Xử lý khi nhấn nút back trên Android
    >
      <TouchableOpacity
        style={styles.centeredView}
        activeOpacity={1}
        onPressOut={onClose} // Đóng modal khi nhấn ra ngoài backdrop
      >
        <View style={styles.modalView} onStartShouldSetResponder={() => true}>
          {isImageVisible && (
            <View style={styles.successIconContainer}>
              <Text style={styles.successIcon}>✓</Text>
            </View>
          )}

          <Text style={styles.modalTitle}>{title}</Text>
          {typeof content === 'string' ? (
            <Text style={styles.modalContent}>{content}</Text>
          ) : (
            content
          )}

          <View style={styles.buttonContainer}>
            {!hideNegativeButton && (
              <TouchableOpacity
                style={[styles.button, styles.negativeButton]}
                onPress={onNegativePress}
              >
                <Text style={styles.negativeButtonText}>{negativeButtonText || 'Hủy'}</Text>
              </TouchableOpacity>
            )}
            {!hidePositiveButton && (
              <TouchableOpacity
                style={[styles.button, styles.positiveButton]}
                onPress={onPositivePress}
              >
                <Text style={styles.positiveButtonText}>{positiveButtonText || 'Đồng ý'}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default AppModal;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Backdrop mờ
  },
  modalView: {
    margin: 20,
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%', // Chiều rộng modal
    maxWidth: 400,
  },
  successIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.app.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  successIcon: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.white,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 15,
    textAlign: 'center',
  },
  modalContent: {
    fontSize: 16,
    color: colors.text.secondary,
    marginBottom: 25,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    minWidth: 100,
    alignItems: 'center',
    marginHorizontal: 5,
    flex: 1,
  },
  positiveButton: {
    backgroundColor: colors.app.primary.main,
  },
  positiveButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  negativeButton: {
    backgroundColor: colors.grey[300],
    borderWidth: 1,
    borderColor: colors.grey[400],
  },
  negativeButtonText: {
    color: colors.text.primary,
    fontWeight: 'bold',
    fontSize: 16,
  },
});