import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { SPACING, BORDER_RADIUS } from '../../../shared/theme/layout';
import { Fonts } from '../../../shared/theme/fonts';

interface CommentInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
  placeholder?: string;
  userAvatar?: string;
}

const CommentInput: React.FC<CommentInputProps> = ({
  value,
  onChangeText,
  onSubmit,
  placeholder = "Thêm bình luận",
  userAvatar,
}) => {
  const isSubmitDisabled = !value.trim();

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
          placeholder={placeholder}
          placeholderTextColor={colors.grey[500]}
          multiline
          numberOfLines={2}
        />
      </View>
      
      <TouchableOpacity 
        style={[styles.submitButton, isSubmitDisabled && styles.submitButtonDisabled]}
        onPress={onSubmit}
        disabled={isSubmitDisabled}
      >
        <Text style={[styles.submitText, isSubmitDisabled && styles.submitTextDisabled]}>
          Đăng
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: SPACING.M,
    paddingVertical: SPACING.S,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.grey[200],
  },
  avatarContainer: {
    marginRight: SPACING.S,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.ROUND,
    backgroundColor: colors.blue.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: colors.grey[100],
    borderRadius: BORDER_RADIUS.M,
    paddingHorizontal: SPACING.S,
    paddingVertical: SPACING.XS,
    minHeight: 40,
    maxHeight: 80,
  },
  input: {
    fontSize: 14,
    color: colors.text.primary,
    fontFamily: Fonts.roboto.regular,
    paddingVertical: SPACING.XS,
  },
  submitButton: {
    marginLeft: SPACING.S,
    paddingHorizontal: SPACING.M,
    paddingVertical: SPACING.S,
    borderRadius: BORDER_RADIUS.S,
    backgroundColor: colors.app.primary.main,
  },
  submitButtonDisabled: {
    backgroundColor: colors.grey[300],
  },
  submitText: {
    fontSize: 14,
    fontFamily: Fonts.roboto.medium,
    color: colors.white,
    fontWeight: '500',
  },
  submitTextDisabled: {
    color: colors.grey[500],
  },
});

export default CommentInput;
