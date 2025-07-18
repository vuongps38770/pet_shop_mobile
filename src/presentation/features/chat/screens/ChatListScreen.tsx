import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useMainNavigation } from 'shared/hooks/navigation-hooks/useMainNavigationHooks';
import { Ionicons } from '@expo/vector-icons';
import { colors } from 'theme/colors';
import { Fonts } from 'theme/fonts';

const ChatListScreen = () => {
  const navigation = useMainNavigation();

  const handlePress = () => {
    navigation.navigate('ChatWithAdmin');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.app.primary.main} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nhắn tin với Shop</Text>
      </View>
      <TouchableOpacity style={styles.item} onPress={handlePress}>
        <Ionicons name="storefront-outline" size={28} color={colors.app.primary.main} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>Nhắn tin với Shop</Text>
          <Text style={styles.subtitle}>Hỗ trợ, tư vấn, giải đáp thắc mắc</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color={colors.grey[400]} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
    padding: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey[200],
    elevation: 2,
  },
  backBtn: {
    marginRight: 8,
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: Fonts.roboto.bold,
    color: colors.app.primary.main,
    marginLeft: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    margin: 16,
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
  },
  title: {
    fontSize: 16,
    fontFamily: Fonts.roboto.bold,
    color: colors.app.primary.main,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: Fonts.roboto.regular,
    color: colors.text.secondary,
    marginTop: 2,
  },
});

export default ChatListScreen; 