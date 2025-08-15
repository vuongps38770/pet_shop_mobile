import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { SPACING, BORDER_RADIUS } from '../../../shared/theme/layout';

interface CreatePostInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onImagePress?: () => void;
  onEmojiPress?: () => void;
  userAvatar?: string;
}

const CreatePostInput: React.FC<CreatePostInputProps> = ({
  value,
  onChangeText,
  onImagePress,
  onEmojiPress,
  userAvatar,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>👤</Text>
        </View>
      </View>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder="Bạn đang nghĩ gì?"
          placeholderTextColor={colors.grey[500]}
          multiline
          numberOfLines={2}
        />
        
        <View style={styles.iconContainer}>
          <TouchableOpacity style={styles.iconButton} onPress={onImagePress}>
            <Text style={styles.iconText}>🖼️</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.iconButton} onPress={onEmojiPress}>
            <Text style={styles.iconText}>😊</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: SPACING.M,
    paddingVertical: SPACING.S,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey[200],
  },
  avatarContainer: {
    marginRight: SPACING.S,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.ROUND,
    backgroundColor: colors.blue.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 20,
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.grey[100],
    borderRadius: BORDER_RADIUS.M,
    paddingHorizontal: SPACING.S,
    paddingVertical: SPACING.XS,
    minHeight: 48,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text.primary,
    fontFamily: 'Roboto-Regular',
    paddingVertical: SPACING.XS,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.XS,
  },
  iconText: {
    fontSize: 18,
  },
});

export default CreatePostInput;
