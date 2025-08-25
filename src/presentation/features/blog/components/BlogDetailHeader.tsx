import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { SPACING, BORDER_RADIUS } from '../../../shared/theme/layout';
import { Fonts } from '../../../shared/theme/fonts';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ProfileIcon from 'assets/icons/bottomTab/user-active.svg'
interface BlogDetailHeaderProps {
  onBackPress?: () => void;
  onProfilePress?: () => void;
  title?: string;
}

const BlogDetailHeader: React.FC<BlogDetailHeaderProps> = ({
  onBackPress,
  onProfilePress,
  title
}) => {
  return (
    <View style={styles.container}>
        <View style={styles.searchIcon}>
          <TouchableOpacity  onPress={onBackPress}>
            <Icon name="arrow-back" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>

      <Text style={styles.title}>{title}</Text>

      <TouchableOpacity style={styles.iconButton} onPress={onProfilePress}>
        <View style={styles.profileIcon}>
          {/* <ProfileIcon width={24} height={24} /> */}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.app.primary.main,
    paddingHorizontal: SPACING.M,
    paddingVertical: SPACING.S,
    height: 56,
  },
  title: {
    fontSize: 18,
    fontFamily: Fonts.roboto.bold,
    color: colors.white,
    fontWeight: 'bold',
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 20,
  },
});

export default BlogDetailHeader;
