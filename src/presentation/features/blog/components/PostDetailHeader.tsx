import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { SPACING } from '../../../shared/theme/layout';
import { Fonts } from '../../../shared/theme/fonts';

interface PostDetailHeaderProps {
  onBackPress?: () => void;
  onSharePress?: () => void;
  onMorePress?: () => void;
}

const PostDetailHeader: React.FC<PostDetailHeaderProps> = ({
  onBackPress,
  onSharePress,
  onMorePress,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.iconButton} onPress={onBackPress}>
        <Text style={styles.iconText}>←</Text>
      </TouchableOpacity>
      
      <Text style={styles.title}>Chi tiết bài viết</Text>
      
      <View style={styles.rightActions}>
        <TouchableOpacity style={styles.iconButton} onPress={onSharePress}>
          <Text style={styles.iconText}>📤</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.iconButton} onPress={onMorePress}>
          <Text style={styles.iconText}>⋯</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    paddingHorizontal: SPACING.M,
    paddingVertical: SPACING.S,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey[200],
  },
  title: {
    fontSize: 16,
    fontFamily: Fonts.roboto.bold,
    color: colors.text.primary,
    fontWeight: 'bold',
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 20,
    color: colors.text.primary,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default PostDetailHeader;
