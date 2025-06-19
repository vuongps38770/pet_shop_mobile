import React, { useEffect, useState } from 'react';
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
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store/store';
import {
  getUserInfo,
  updateAvatar,
  updateProfile,
} from '../../profile/profile.slice';
import { colors } from 'theme/colors';

const ProfileDetail = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: user, isLoading } = useSelector((state: RootState) => state.profile);

  const [editName, setEditName] = useState('');
  const [editSurName, setEditSurName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');

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
    Alert.alert(
      'Thay đổi ảnh đại diện',
      'Chọn nguồn ảnh:',
      [
        {
          text: 'Chụp ảnh',
          onPress: async () => {
            const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
            if (!permissionResult.granted) return;
            const result = await ImagePicker.launchCameraAsync({ quality: 1 });
            if (!result.canceled && result.assets[0]?.uri) {
              const file = {
                uri: result.assets[0].uri,
                type: 'image/jpeg',
                name: 'avatar.jpg',
              };
              dispatch(updateAvatar(file));
            }
          },
        },
        {
          text: 'Chọn từ thư viện',
          onPress: async () => {
            const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!granted) return;
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              quality: 1,
            });
            if (!result.canceled && result.assets[0]?.uri) {
              const file = {
                uri: result.assets[0].uri,
                type: 'image/jpeg',
                name: 'avatar.jpg',
              };
              dispatch(updateAvatar(file));
            }
          },
        },
        { text: 'Hủy', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  const handleSave = () => {
    dispatch(updateProfile({
      name: editName.trim(),
      surName: editSurName.trim(),
      phone: editPhone.trim(),
      email: editEmail.trim(),
    }))
      .unwrap()
      .then(() => {
        Alert.alert('Thành công', 'Cập nhật thông tin người dùng thành công');
        dispatch(getUserInfo());
      })
      .catch((err) => {
        Alert.alert('Lỗi', err || 'Cập nhật thông tin thất bại');
      });
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
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity style={styles.backButton}>
          <Image
            source={require('../../../../../assets/icons/back.png')} 
            style={{ width: 24, height: 24 }}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <View style={styles.avatarWrapper}>
          {user.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.defaultAvatar]} />
          )}
          <TouchableOpacity onPress={handleChangeAvatar} style={styles.editIcon}>
            <MaterialIcons name="edit" size={20} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>TÊN</Text>
          <View style={styles.inputBox}>
            <TextInput
              value={editName}
              onChangeText={setEditName}
              style={styles.input}
              placeholder="Nhập tên"
            />
          </View>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>HỌ</Text>
          <View style={styles.inputBox}>
            <TextInput
              value={editSurName}
              onChangeText={setEditSurName}
              style={styles.input}
              placeholder="Nhập họ"
            />
          </View>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>SỐ ĐIỆN THOẠI</Text>
          <View style={styles.inputBox}>
            <TextInput
              value={editPhone}
              onChangeText={setEditPhone}
              style={styles.input}
              keyboardType="phone-pad"
              placeholder="Nhập số điện thoại"
            />
          </View>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>EMAIL</Text>
          <View style={styles.inputBox}>
            <TextInput
              value={editEmail}
              onChangeText={setEditEmail}
              style={styles.input}
              keyboardType="email-address"
              placeholder="Nhập email"
            />
          </View>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>NGÀY TẠO TÀI KHOẢN</Text>
          <View style={styles.inputBox}>
            <Text style={styles.input}>{formatDate(user.createdAt)}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>SAVE</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  scrollContainer: {
    padding: 16,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 10,
    padding: 6,
  },
  avatarWrapper: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 12,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fdbca2',
  },
  defaultAvatar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  editIcon: {
    position: 'absolute',
    bottom: 12,
    right: '33%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 4,
    elevation: 4,
  },
  fieldContainer: {
    width: '100%',
    marginBottom: 16,
  },
  label: {
    fontSize: 15,
    color: colors.app.primary.main,
    fontWeight: '500',
    marginBottom: 6,
    textAlign: 'left',
  },
  inputBox: {
    backgroundColor: '#f1f6fb',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 0.1,
    borderColor: '#000',
  },
  input: {
    fontSize: 16,
    color: colors.black,
    textAlign: 'left',
  },
  saveButton: {
    backgroundColor: colors.app.primary.light,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 20,
    width: '100%',
  },
  saveButtonText: {
    color: colors.white,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
