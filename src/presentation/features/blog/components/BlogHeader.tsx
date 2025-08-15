import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { SPACING, BORDER_RADIUS } from '../../../shared/theme/layout';
import { Fonts } from '../../../shared/theme/fonts';

interface BlogHeaderProps {
  onSearchPress?: () => void;
  onProfilePress?: () => void;
}

const BlogHeader: React.FC<BlogHeaderProps> = ({
  onSearchPress,
  onProfilePress,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconButton} onPress={onSearchPress}>
        <View style={styles.searchIcon}>
          <Text style={styles.iconText}>🔍</Text>
        </View>
      </TouchableOpacity>
      
      <Text style={styles.title}>Cộng đồng</Text>
      
      <TouchableOpacity style={styles.iconButton} onPress={onProfilePress}>
        <View style={styles.profileIcon}>
          <Text style={styles.iconText}>👤</Text>
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

export default BlogHeader;
