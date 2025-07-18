import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import {
  Alert,
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
  ScrollView,
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import {
  getUserInfo,
  updateAvatar,
  updateProfile,
} from '../../profile/profile.slice';
import { colors } from '../../../shared/theme/colors';
import { Fonts } from '../../../shared/theme/fonts';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import ImageViewing from 'react-native-image-viewing';
import { Image as RNImage } from 'react-native';
import { useMainNavigation } from 'shared/hooks/navigation-hooks/useMainNavigationHooks';

const ProfileDetail = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useMainNavigation()
  const { data: user, isLoading } = useSelector((state: RootState) => state.profile);

  const [editName, setEditName] = useState('');
  const [editSurName, setEditSurName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isImagePickerVisible, setIsImagePickerVisible] = useState(false);
  const [isAvatarViewerVisible, setAvatarViewerVisible] = useState(false);
  const [avatarRotation, setAvatarRotation] = useState(0);

  // Bottom sheet ref
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  useEffect(() => {
    dispatch(getUserInfo());
  }, [dispatch]);
  
  useEffect(() => {
    if (user) {
      setEditName(user.name);
      setEditSurName(user.surName);
      setEditPhone(user.phone);
      setEditEmail(user.email);
    }
  }, [user]);

  const handleChangeAvatar = () => {
    setIsImagePickerVisible(true);
    bottomSheetRef.current?.expand();
  };

  const handleCameraPress = async () => {
    bottomSheetRef.current?.close();
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Quyền truy cập', 'Cần quyền truy cập camera để chụp ảnh');
      return;
    }
    
    try {
      const result = await ImagePicker.launchCameraAsync({ 
        quality: 1,
        allowsEditing: true,
        aspect: [1, 1],
      });
      
      if (!result.canceled && result.assets[0]?.uri) {
        const file = {
          uri: result.assets[0].uri,
          type: 'image/jpeg',
          name: 'avatar.jpg',
        };
        dispatch(updateAvatar(file));
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể mở camera');
    }
  };

  const handleGalleryPress = async () => {
    bottomSheetRef.current?.close();
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) {
      Alert.alert('Quyền truy cập', 'Cần quyền truy cập thư viện ảnh');
      return;
    }
    
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: 'images',
        allowsEditing: true,
        quality: 1,
        aspect: [1, 1],
      });
      
      if (!result.canceled && result.assets[0]?.uri) {
        const file = {
          uri: result.assets[0].uri,
          type: 'image/jpeg',
          name: 'avatar.jpg',
        };
        dispatch(updateAvatar(file));
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể mở thư viện ảnh');
    }
  };

  const handleRemoveAvatar = () => {
    bottomSheetRef.current?.close();
    Alert.alert(
      'Xóa ảnh đại diện',
      'Bạn có chắc muốn xóa ảnh đại diện hiện tại?',
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Xóa', 
          style: 'destructive',
          onPress: () => {
            // Dispatch action to remove avatar
            // dispatch(removeAvatar());
          }
        },
      ]
    );
  };

  const handleEditPhone = () => {
    // TODO: Implement phone editing logic with OTP verification
    Alert.alert('Thông báo', 'Tính năng sửa số điện thoại sẽ được cập nhật sau');
  };

  const handleEditEmail = () => {
    // TODO: Implement email editing logic with email verification
    navigation.navigate('AddEmailScreen')
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setIsImagePickerVisible(false);
    }
  }, []);

  const handleSave = () => {
    dispatch(updateProfile({
      name: editName.trim(),
      surName: editSurName.trim(),
      // phone và email sẽ được xử lý riêng sau này
    }))
      .unwrap()
      .then(() => {
        Alert.alert('Thành công', 'Cập nhật thông tin người dùng thành công');
        dispatch(getUserInfo());
        setIsEditing(false);
      })
      .catch((err) => {
        Alert.alert('Lỗi', err || 'Cập nhật thông tin thất bại');
      });
  };

  const handleCancel = () => {
    if (user) {
      setEditName(user.name);
      setEditSurName(user.surName);
      // phone và email sẽ được xử lý riêng sau này
    }
    setIsEditing(false);
  };

  const formatDate = (isoDate: string): string => {
    const date = new Date(isoDate);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${date.getFullYear()}`;
  };

  if (isLoading || !user) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.app.primary.main} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.app.primary.main} barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={()=>navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hồ sơ cá nhân</Text>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => setIsEditing(!isEditing)}
        >
          <Icon 
            name={isEditing ? "close" : "edit"} 
            size={24} 
            color={colors.white} 
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <TouchableOpacity
            onPress={() => user.avatar && setAvatarViewerVisible(true)}
            style={styles.avatarWrapper}
            activeOpacity={0.8}
          >
            {user.avatar ? (
              <Image source={{ uri: user.avatar }} style={[styles.avatar, { transform: [{ rotate: `${avatarRotation}deg` }] }]} />
            ) : (
              <View style={styles.defaultAvatar}>
                <Icon name="person" size={48} color={colors.white} />
              </View>
            )}
            <TouchableOpacity onPress={handleChangeAvatar} style={styles.editAvatarButton}>
              <Icon name="camera-alt" size={20} color={colors.white} />
            </TouchableOpacity>
          </TouchableOpacity>
          <Text style={styles.userName}>{user.name} {user.surName}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>

        {/* Profile Fields */}
        <View style={styles.fieldsContainer}>
          <View style={styles.fieldCard}>
            <View style={styles.fieldHeader}>
              <Icon name="person" size={20} color={colors.app.primary.main} />
              <Text style={styles.fieldLabel}>Thông tin cá nhân</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.fieldTitle}>Tên</Text>
              {isEditing ? (
                <TextInput
                  value={editName}
                  onChangeText={setEditName}
                  style={styles.editableInput}
                  placeholder="Nhập tên"
                  placeholderTextColor={colors.text.hint}
                />
              ) : (
                <Text style={styles.fieldValue}>{user.name}</Text>
              )}
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldTitle}>Họ</Text>
              {isEditing ? (
                <TextInput
                  value={editSurName}
                  onChangeText={setEditSurName}
                  style={styles.editableInput}
                  placeholder="Nhập họ"
                  placeholderTextColor={colors.text.hint}
                />
              ) : (
                <Text style={styles.fieldValue}>{user.surName}</Text>
              )}
            </View>
          </View>

          <View style={styles.fieldCard}>
            <View style={styles.fieldHeader}>
              <Icon name="contact-phone" size={20} color={colors.app.primary.main} />
              <Text style={styles.fieldLabel}>Liên hệ</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.fieldTitle}>Số điện thoại</Text>
              <View style={styles.fieldRight}>
                <Text style={styles.fieldValue}>{user.phone}</Text>
                <TouchableOpacity style={styles.editFieldButton} onPress={handleEditPhone}>
                  <Icon name="edit" size={16} color={colors.app.primary.main} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.fieldTitle}>Email</Text>
              <View style={styles.fieldRight}>
                <Text style={styles.fieldValue}>{user.email}</Text>
                <TouchableOpacity style={styles.editFieldButton} onPress={handleEditEmail}>
                  <Icon name="edit" size={16} color={colors.app.primary.main} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.fieldCard}>
            <View style={styles.fieldHeader}>
              <Icon name="info" size={20} color={colors.app.primary.main} />
              <Text style={styles.fieldLabel}>Thông tin tài khoản</Text>
            </View>
            
            <View style={styles.fieldRow}>
              <Text style={styles.fieldTitle}>Ngày tạo</Text>
              <Text style={styles.fieldValue}>{formatDate(user.createdAt)}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        {isEditing && (
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Icon name="save" size={20} color={colors.white} />
              <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Image Viewer Modal */}
      <ImageViewing
        images={user.avatar ? [{ uri: user.avatar }] : []}
        imageIndex={0}
        visible={isAvatarViewerVisible}
        onRequestClose={() => setAvatarViewerVisible(false)}
      />

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backdropComponent={renderBackdrop}
        enablePanDownToClose={true}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.bottomSheetIndicator}
      >
        <BottomSheetView style={styles.bottomSheetContent}>
          <View style={styles.bottomSheetHeader}>
            <Text style={styles.bottomSheetTitle}>Chọn ảnh đại diện</Text>
          </View>
          
          <TouchableOpacity
            style={styles.bottomSheetOption}
            onPress={handleCameraPress}
          >
            <View style={styles.optionLeft}>
              <View style={[styles.optionIcon, { backgroundColor: colors.app.primary.lightest }]}>
                <Icon name="camera-alt" size={24} color={colors.app.primary.main} />
              </View>
              <Text style={styles.bottomSheetOptionText}>Chụp ảnh</Text>
            </View>
            <Icon name="chevron-right" size={20} color={colors.text.secondary} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.bottomSheetOption}
            onPress={handleGalleryPress}
          >
            <View style={styles.optionLeft}>
              <View style={[styles.optionIcon, { backgroundColor: colors.app.primary.lightest }]}>
                <Icon name="photo-library" size={24} color={colors.app.primary.main} />
              </View>
              <Text style={styles.bottomSheetOptionText}>Chọn từ thư viện</Text>
            </View>
            <Icon name="chevron-right" size={20} color={colors.text.secondary} />
          </TouchableOpacity>
          
          {user?.avatar && (
            <TouchableOpacity
              style={styles.bottomSheetOption}
              onPress={handleRemoveAvatar}
            >
              <View style={styles.optionLeft}>
                <View style={[styles.optionIcon, { backgroundColor: colors.red.light }]}>
                  <Icon name="delete" size={24} color={colors.red.main} />
                </View>
                <Text style={[styles.bottomSheetOptionText, { color: colors.red.main }]}>Xóa ảnh đại diện</Text>
              </View>
              <Icon name="chevron-right" size={20} color={colors.red.main} />
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={styles.bottomSheetCancel}
            onPress={() => bottomSheetRef.current?.close()}
          >
            <Text style={styles.bottomSheetCancelText}>Hủy</Text>
          </TouchableOpacity>
        </BottomSheetView>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default ProfileDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background.default,
  },
  header: {
    backgroundColor: colors.app.primary.main,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    elevation: 4,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: Fonts.roboto.bold,
    color: colors.white,
    flex: 1,
    textAlign: 'center',
  },
  editButton: {
    padding: 8,
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: colors.white,
    marginBottom: 20,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: colors.app.primary.light,
  },
  defaultAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.app.primary.main,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: colors.app.primary.light,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.app.primary.main,
    borderRadius: 20,
    padding: 8,
    elevation: 4,
  },
  userName: {
    fontSize: 24,
    fontFamily: Fonts.roboto.bold,
    color: colors.text.primary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    fontFamily: Fonts.roboto.regular,
    color: colors.text.secondary,
  },
  fieldsContainer: {
    paddingHorizontal: 20,
  },
  fieldCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey[200],
  },
  fieldLabel: {
    fontSize: 18,
    fontFamily: Fonts.roboto.bold,
    color: colors.text.primary,
    marginLeft: 8,
  },
  fieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey[100],
  },
  fieldTitle: {
    fontSize: 16,
    fontFamily: Fonts.roboto.medium,
    color: colors.text.secondary,
    flex: 1,
  },
  fieldValue: {
    fontSize: 16,
    fontFamily: Fonts.roboto.regular,
    color: colors.text.primary,
    flex: 1,
    textAlign: 'right',
    marginRight: 8,
  },
  fieldRight: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
    justifyContent: 'flex-end',
  },
  editFieldButton: {
    padding: 4,
    borderRadius: 12,
    backgroundColor: colors.app.primary.lightest,
  },
  editableInput: {
    fontSize: 16,
    fontFamily: Fonts.roboto.regular,
    color: colors.text.primary,
    flex: 2,
    textAlign: 'right',
    backgroundColor: colors.grey[50],
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.app.primary.light,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: colors.grey[200],
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontFamily: Fonts.roboto.bold,
    color: colors.text.primary,
  },
  saveButton: {
    flex: 2,
    backgroundColor: colors.app.primary.main,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: Fonts.roboto.bold,
    color: colors.white,
    marginLeft: 8,
  },
  bottomSheetBackground: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  bottomSheetIndicator: {
    backgroundColor: colors.grey[300],
    width: 40,
    height: 4,
  },
  bottomSheetContent: {
    padding: 20,
  },
  bottomSheetHeader: {
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey[200],
  },
  bottomSheetTitle: {
    fontSize: 20,
    fontFamily: Fonts.roboto.bold,
    color: colors.text.primary,
  },
  bottomSheetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 4,
    marginBottom: 8,
    borderRadius: 12,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  bottomSheetOptionText: {
    fontSize: 16,
    fontFamily: Fonts.roboto.medium,
    color: colors.text.primary,
  },
  bottomSheetCancel: {
    marginTop: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: colors.grey[100],
    borderRadius: 12,
    alignItems: 'center',
  },
  bottomSheetCancelText: {
    fontSize: 16,
    fontFamily: Fonts.roboto.bold,
    color: colors.text.secondary,
  },
});
