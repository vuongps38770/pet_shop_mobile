import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { SPACING, BORDER_RADIUS } from '../../../shared/theme/layout';
import { Fonts } from '../../../shared/theme/fonts';
import { BlogPost } from '../types/blog.types';

const { width } = Dimensions.get('window');

interface PostDetailItemProps {
  post: BlogPost;
  onLikePress?: (postId: string) => void;
  onCommentPress?: (postId: string) => void;
  onSharePress?: (postId: string) => void;
  onUserPress?: (userId: string) => void;
}

const PostDetailItem: React.FC<PostDetailItemProps> = ({
  post,
  onLikePress,
  onCommentPress,
  onSharePress,
  onUserPress,
}) => {
  return (
    <View style={styles.container}>
      {/* User Info */}
      <TouchableOpacity 
        style={styles.userInfo} 
        onPress={() => onUserPress?.(post.user.id)}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>👤</Text>
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{post.user.name}</Text>
          <Text style={styles.timestamp}>{post.timestamp}</Text>
        </View>
      </TouchableOpacity>

      {/* Content */}
      {post.content && (
        <Text style={styles.content}>{post.content}</Text>
      )}

      {/* Image */}
      {post.image && (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: post.image }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      )}

      {/* Stats */}
      <View style={styles.stats}>
        <Text style={styles.statsText}>
          {post.likes} lượt thích • {post.comments} bình luận
        </Text>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => onLikePress?.(post.id)}
        >
          <Text style={[styles.actionIcon, post.isLiked && styles.likedIcon]}>
            {post.isLiked ? '❤️' : '🤍'}
          </Text>
          <Text style={[styles.actionText, post.isLiked && styles.likedText]}>
            Thích
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => onCommentPress?.(post.id)}
        >
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionText}>Bình luận</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => onSharePress?.(post.id)}
        > */}
          {/* <Text style={styles.actionIcon}>📤</Text>
          <Text style={styles.actionText}>Chia sẻ</Text> */}
        {/* </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    padding: SPACING.M,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey[200],
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.S,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.ROUND,
    backgroundColor: colors.blue.main,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.S,
  },
  avatarText: {
    fontSize: 24,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontFamily: Fonts.roboto.bold,
    color: colors.text.primary,
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: 14,
    fontFamily: Fonts.roboto.regular,
    color: colors.text.secondary,
    marginTop: 2,
  },
  content: {
    fontSize: 16,
    fontFamily: Fonts.roboto.regular,
    color: colors.text.primary,
    lineHeight: 24,
    marginBottom: SPACING.S,
  },
  imageContainer: {
    marginBottom: SPACING.S,
    borderRadius: BORDER_RADIUS.M,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: BORDER_RADIUS.M,
  },
  stats: {
    paddingVertical: SPACING.S,
    borderBottomWidth: 1,
    borderBottomColor: colors.grey[200],
    marginBottom: SPACING.S,
  },
  statsText: {
    fontSize: 14,
    fontFamily: Fonts.roboto.medium,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.S,
    paddingHorizontal: SPACING.M,
    borderRadius: BORDER_RADIUS.S,
  },
  actionIcon: {
    fontSize: 20,
    marginRight: SPACING.XS,
  },
  actionText: {
    fontSize: 14,
    fontFamily: Fonts.roboto.medium,
    color: colors.text.secondary,
    fontWeight: '500',
  },
  likedIcon: {
    color: colors.red.main,
  },
  likedText: {
    color: colors.red.main,
  },
});

export default PostDetailItem;
