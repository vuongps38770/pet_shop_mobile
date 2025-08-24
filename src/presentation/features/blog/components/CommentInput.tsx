import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Image, Animated } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { SPACING, BORDER_RADIUS } from '../../../shared/theme/layout';
import { Fonts } from '../../../shared/theme/fonts';
import { PostCommentResDto } from 'src/presentation/dto/res/post.res.dto';

interface CommentInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
  onCancelReply?: () => void;
  placeholder?: string;
  userAvatar?: string;
  replyTo?: PostCommentResDto | null;
  isLoading?: boolean;
}

const CommentInput: React.FC<CommentInputProps> = ({
  value,
  onChangeText,
  onSubmit,
  onCancelReply,
  placeholder = "Thêm bình luận",
  userAvatar,
  replyTo,
  isLoading = false,
}) => {
  const isSubmitDisabled = !value.trim() || isLoading;
  const spinValue = React.useRef(new Animated.Value(0)).current;

  // Animation cho spinner
  React.useEffect(() => {
    if (isLoading) {
      const spinAnimation = Animated.loop(
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      );
      spinAnimation.start();
    } else {
      spinValue.setValue(0);
    }
  }, [isLoading, spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Xử lý khi replyTo thay đổi
  React.useEffect(() => {
    // Tất cả reply đều phải có @tên
    if (replyTo && !value.includes(`@${replyTo.user.name}`)) {
      onChangeText(`@${replyTo.user.name} `);
    }
    
    console.log('CommentInput replyTo changed:', {
      replyToId: replyTo?._id,
      replyToName: replyTo?.user.name,
      replyToRootId: replyTo?.root_id,
      replyToParentId: replyTo?.parent_id,
      isReplyToReply: replyTo?.parent_id && replyTo?.parent_id !== replyTo?.root_id,
      currentValue: value,
      shouldShowAtName: replyTo && !value.includes(`@${replyTo.user.name}`)
    });
  }, [replyTo]);

  // Tự động thêm @tên vào đầu nội dung khi reply
  const handleReplyStart = () => {
    if (replyTo && !value.startsWith(`@${replyTo.user.name}`)) {
      onChangeText(`@${replyTo.user.name} ${value}`);
    }
  };

  return (
    <View style={styles.container}>
      {replyTo && (
        <View style={styles.replyToContainer}>
          <Text style={styles.replyToText}>
            <Text>Trả lời</Text>
            <Text style={styles.replyToName}>@{replyTo.user.name}</Text>
            {replyTo.parent_id && replyTo.parent_id !== replyTo.root_id && (
              <Text style={styles.replyToContext}>(reply con)</Text>
            )}
            {replyTo.parent_id && replyTo.parent_id === replyTo.root_id && (
              <Text style={styles.replyToContext}>(reply gốc)</Text>
            )}
          </Text>
          <TouchableOpacity onPress={onCancelReply} style={styles.cancelReplyButton}>
            <Text style={styles.cancelReplyText}>✕</Text>
          </TouchableOpacity>
        </View>
      )}
      
      <View style={styles.inputRow}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            {userAvatar ? (
              <Image 
                source={{ uri: userAvatar }} 
                style={styles.avatarImage}
              />
            ) : (
              <Text style={styles.avatarText}>👤</Text>
            )}
          </View>
        </View>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            placeholder={replyTo ? `Trả lời @${replyTo.user.name}...` : placeholder}
            placeholderTextColor={colors.grey[500]}
            multiline
            numberOfLines={2}
            onFocus={handleReplyStart}
          />
        </View>
        
        <TouchableOpacity 
          style={[styles.submitButton, isSubmitDisabled && styles.submitButtonDisabled]}
          onPress={onSubmit}
          disabled={isSubmitDisabled}
        >
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <Animated.View style={[styles.spinner, { transform: [{ rotate: spin }] }]} />
              <Text style={[styles.submitText, styles.loadingText]}>
                {replyTo ? 'Đang gửi...' : 'Đang đăng...'}
              </Text>
            </View>
          ) : (
            <Text style={[styles.submitText, isSubmitDisabled && styles.submitTextDisabled]}>
              {replyTo ? 'Trả lời' : 'Đăng'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.grey[200],
  },
  replyToContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.M,
    paddingVertical: SPACING.XS,
    backgroundColor: colors.grey[50],
    borderBottomWidth: 1,
    borderBottomColor: colors.grey[200],
  },
  replyToText: {
    fontSize: 12,
    color: colors.text.secondary,
    fontFamily: Fonts.roboto.regular,
    flexDirection: 'row',
    alignItems: 'center',
  },
  replyToName: {
    color: colors.blue.main,
    fontWeight: '600',
    marginLeft: SPACING.XS,
  },
  replyToContext: {
    fontSize: 12,
    color: colors.text.secondary,
    fontFamily: Fonts.roboto.regular,
    fontStyle: 'italic',
    marginLeft: SPACING.XS,
  },
  cancelReplyButton: {
    padding: SPACING.XS,
  },
  cancelReplyText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: SPACING.M,
    paddingVertical: SPACING.S,
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
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: BORDER_RADIUS.ROUND,
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
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    width: 16,
    height: 16,
    borderWidth: 2,
    borderColor: colors.white,
    borderTopColor: 'transparent',
    borderRadius: 10,
    marginRight: SPACING.XS,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: Fonts.roboto.medium,
  },
});

export default CommentInput;
