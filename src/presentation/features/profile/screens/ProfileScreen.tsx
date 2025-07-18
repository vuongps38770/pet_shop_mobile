import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useDispatch } from "react-redux";

import { Typography } from 'shared/components/Typography';
import { AppDispatch } from "src/presentation/store/store";
import { assets } from 'shared/theme/assets';
import { colors } from 'shared/theme/colors';
import { logOut, checkPhone } from '../../auth/auth.slice'
import AppModal from "shared/components/modals/AppModal";
import { useMainNavigation } from "shared/hooks/navigation-hooks/useMainNavigationHooks";
import { useUserInfo } from "shared/hooks/useUserInfo";
import Icon from 'react-native-vector-icons/MaterialIcons';

const ProfileScreen = () => {
  const groupedMenuItems = [
    [
      {
        id: "1",
        title: "Thông tin cá nhân",
        icon: "person",
        color: colors.app.primary.main,
      },
      {
        id: "2",
        title: "Địa chỉ",
        icon: "location-on",
        color: colors.app.primary.main,
      },
    ],
    [
      // {
      //   id: "3",
      //   title: "Giỏ hàng",
      //   icon: "shopping-cart",
      //   color: colors.app.primary.main,
      // },
      {
        id: "4",
        title: "Yêu thích",
        icon: "favorite",
        color: colors.app.primary.main,
      },
      {
        id: "5",
        title: "Voucher",
        icon: "card-giftcard",
        color: colors.app.primary.main,
      },
      {
        id: "6",
        title: "Thông báo",
        icon: "notifications",
        color: colors.app.primary.main,
      },
    ],
    [
      {
        id: "7-shop",
        title: "Nhắn tin với shop",
        icon: "chat",
        color: colors.app.primary.main,
      },
      {
        id: "7",
        title: "Câu hỏi thường gặp",
        icon: "help-outline",
        color: colors.app.primary.main,
      },
      {
        id: "8",
        title: "Đăng xuất",
        icon: "logout",
        color: '#e53935',
      },
    ],
  ];
  const [isModalVisible, setIsModalVisible] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const navigator = useMainNavigation();
  const { user, isLoading, error } = useUserInfo();
  const handleLogout = () => {
    setIsModalVisible(true);
  };

  return (
    <ScrollView style={styles.container}>
      <AppModal
        visible={isModalVisible}
        content="Bạn có chắc muốn đăng xuất?"
        title="Đăng xuất tài khoản"
        onNegativePress={() => { setIsModalVisible(!isModalVisible) }}
        onPositivePress={async () => { 
          await dispatch(logOut()).unwrap();
          dispatch({ type: 'RESET_ALL_STATE' });
         }}
        onClose={() => { setIsModalVisible(!isModalVisible) }}
      />
      <View style={styles.header}>
        <Typography variant="h5" style={styles.headerTitle}>
          Hồ sơ
        </Typography>
      </View>

      <View style={styles.userInfo}>
        <Image
          source={{ uri: user?.avatar }}
          style={styles.avatar}
        />
        <Typography variant="h5" style={styles.userName}>
          {user?.name}
        </Typography>
      </View>

      {groupedMenuItems.map((group, index) => (
        <View key={index} style={styles.menuGroup}>
          {group.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem}
              onPress={() => {
                if (item.id == "8") {
                  handleLogout()
                }
                else if (item.id == "4") {
                  navigator.navigate("FavouriteScreen")
                }
                else if (item.id == "2") {
                  navigator.navigate("AllAddressesScreen");
                }
                else if (item.id == "1") {
                  navigator.navigate("ProfileDetail");
                } else if (item.id == "5") {
                  navigator.navigate("VoucherScreen");
                } else if (item.id == "7-shop") {
                  navigator.navigate("ChatList");
                } else if (item.id == "6") {
                  navigator.navigate("Notification");
                }
              }}>
              <View
                style={[styles.iconContainer, { backgroundColor: item.color }]}
              >
                <Icon name={item.icon} size={22} color={item.id === "8" ? colors.white : colors.white} />
              </View>
              <Typography variant="body1" style={styles.menuText}>
                {item.title}
              </Typography>
              <Icon name="chevron-right" size={22} color={colors.grey[700]} style={styles.arrowIcon} />
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

export default ProfileScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey[200],
  },
  backButton: {
    padding: 8,
  },
  backIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    marginLeft: 10,
    fontSize: 20,
    fontWeight: "bold",
    color: colors.black,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.white,
    marginBottom: 10,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.orange.light,
    marginRight: 16,
  },
  userName: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.black,
  },
  menuGroup: {
    backgroundColor: colors.grey[200],
    borderRadius: 16,
    padding: 8,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuIcon: {
    width: 30,
    height: 34,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: colors.black,
    fontWeight: "500",
  },
  arrowIcon: {
    // width: 16,
    // height: 16,
    // tintColor: "black",
  },
});
