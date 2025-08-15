import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { SPACING, BORDER_RADIUS } from '../../../shared/theme/layout';
import { Fonts } from '../../../shared/theme/fonts';
import { BlogComment } from '../types/blog.types';

interface CommentItemProps {
  comment: BlogComment;
  onUserPress?: (userId: string) => void;
  onLikePress?: (commentId: string) => void;
  onReplyPress?: (commentId: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onUserPress,
  onLikePress,
  onReplyPress,
}) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.userInfo} 
        onPress={() => onUserPress?.(comment.user.id)}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>👤</Text>
        </View>
        <View style={styles.commentContent}>
          <View style={styles.commentHeader}>
            <Text style={styles.userName}>{comment.user.name}</Text>
            <Text style={styles.timestamp}>{comment.timestamp}</Text>
          </View>
          <Text style={styles.commentText}>{comment.content}</Text>
          
          <View style={styles.commentActions}>
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => onLikePress?.(comment.id)}
            >
              <Text style={styles.actionText}>Thích</Text>
              {comment.likes > 0 && (
                <Text style={styles.likeCount}> {comment.likes}</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => onReplyPress?.(comment.id)}
            >
              <Text style={styles.actionText}>Trả lời</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    paddingHorizontal: SPACING.M,
    paddingVertical: SPACING.S,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey[100],
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.ROUND,
    backgroundColor: colors.blue.main,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.S,
  },
  avatarText: {
    fontSize: 16,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.XS,
  },
  userName: {
    fontSize: 14,
    fontFamily: Fonts.roboto.bold,
    color: colors.text.primary,
    fontWeight: 'bold',
    marginRight: SPACING.S,
  },
  timestamp: {
    fontSize: 12,
    fontFamily: Fonts.roboto.regular,
    color: colors.text.secondary,
  },
  commentText: {
    fontSize: 14,
    fontFamily: Fonts.roboto.regular,
    color: colors.text.primary,
    lineHeight: 20,
    marginBottom: SPACING.XS,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.M,
    paddingVertical: SPACING.XS,
  },
  actionText: {
    fontSize: 12,
    fontFamily: Fonts.roboto.medium,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  likeCount: {
    fontSize: 12,
    fontFamily: Fonts.roboto.medium,
    color: colors.text.secondary,
    fontWeight: '500',
  },
});

export default CommentItem;
