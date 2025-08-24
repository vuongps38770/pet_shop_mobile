import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { SPACING, BORDER_RADIUS } from '../../../shared/theme/layout';
import { Fonts } from '../../../shared/theme/fonts';
import { PostCommentResDto } from 'src/presentation/dto/res/post.res.dto';
import { formatDate } from 'app/utils/time';
import { useUserInfo } from 'shared/hooks/useUserInfo';

interface CommentItemProps {
  comment: PostCommentResDto;
  onUserPress?: (userId: string) => void;
  onLikePress?: (commentId: string) => void;
  onReplyPress?: (comment: PostCommentResDto) => void;
  onDeletePress?: (commentId: string) => void;
  onViewRepliesPress?: (commentId: string) => void;
  showReplies?: boolean;
  isLoadingReplies?: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onUserPress,
  onLikePress,
  onReplyPress,
  onDeletePress,
  onViewRepliesPress,
  showReplies = false,
  isLoadingReplies = false,
}) => {
  const { user } = useUserInfo();
  const isMyComment = user?._id === comment.user._id;

  const handleDeletePress = () => {
    Alert.alert(
      "Xóa bình luận",
      "Bạn có chắc muốn xóa bình luận này?",
      [
        { text: "Hủy", style: "cancel" },
        { text: "Xóa", style: "destructive", onPress: () => onDeletePress?.(comment._id) }
      ]
    );
  };

  const handleReplyPress = () => {
    console.log('Reply to comment:', {
      commentId: comment._id,
      commentContent: comment.content,
      hasRootId: !!comment.root_id,
      rootId: comment.root_id,
      parentId: comment.parent_id
    });
    onReplyPress?.(comment);
  };

  const renderContent = () => {
    
    if (comment.replyRegex && comment.parent_id) {
      const parts = comment.content.split(comment.replyRegex);
      
      if (parts.length === 2) {
        if (comment.parent_id === comment.root_id) {
          return <Text style={styles.commentText}>{parts[1]}</Text>;
        } else {
          return (
            <Text style={styles.commentText}>
              <Text style={styles.replyText}>{comment.replyRegex}</Text>
              {parts[1]}
            </Text>
          );
        }
      }
    }
    
    // Comment gốc hoặc không có replyRegex
    return <Text style={styles.commentText}>{comment.content}</Text>;
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.userInfo} 
        onPress={() => onUserPress?.(comment.user._id)}
      >
        <View style={styles.avatar}>
          {comment.user.avatar ? (
            <Image 
              source={{ uri: comment.user.avatar }} 
              style={styles.avatarImage}
            />
          ) : (
            <Text style={styles.avatarText}>
              {comment.user.name||""}
            </Text>
          )}
        </View>
        <View style={styles.commentContent}>
          <View style={styles.commentHeader}>
            <Text style={styles.userName}>{comment.user.name}</Text>
            <Text style={styles.timestamp}>{formatDate(comment.createdAt).toLocaleString()}</Text>
            {isMyComment && (
              <TouchableOpacity onPress={handleDeletePress} style={styles.deleteButton}>
                <Text style={styles.deleteText}>Xóa</Text>
              </TouchableOpacity>
            )}
          </View>
          {renderContent()}
          
          <View style={styles.commentActions}>
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => onLikePress?.(comment._id)}
            >
              <Text style={styles.actionText}>Thích</Text>
              {comment.likeList.length > 0 && (
                <Text style={styles.likeCount}>{comment.likeList.length}</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={handleReplyPress}
            >
              <Text style={styles.actionText}>Trả lời</Text>
            </TouchableOpacity>

            {comment.replyCount && comment.replyCount > 0 && (
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => onViewRepliesPress?.(comment._id)}
                disabled={isLoadingReplies}
              >
                <Text style={styles.actionText}>
                  {isLoadingReplies ? 'Đang tải...' : (showReplies ? `Xem ${comment.replyCount} phản hồi` : `Hiện ${comment.replyCount} phản hồi`)}
                </Text>
              </TouchableOpacity>
            )}
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
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: BORDER_RADIUS.ROUND,
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
    flex: 1,
  },
  deleteButton: {
    paddingHorizontal: SPACING.XS,
  },
  deleteText: {
    fontSize: 12,
    color: colors.red.main,
    fontWeight: '500',
  },
  commentText: {
    fontSize: 14,
    fontFamily: Fonts.roboto.regular,
    color: colors.text.primary,
    lineHeight: 20,
    marginBottom: SPACING.XS,
  },
  replyText: {
    color: colors.blue.main,
    fontWeight: '600',
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.M,
  },
  actionText: {
    fontSize: 14,
    color: colors.text.secondary,
    fontFamily: Fonts.roboto.regular,
  },
  likeCount: {
    fontSize: 14,
    color: colors.text.secondary,
    fontFamily: Fonts.roboto.medium,
    marginLeft: SPACING.XS,
  },
});

export default CommentItem;
