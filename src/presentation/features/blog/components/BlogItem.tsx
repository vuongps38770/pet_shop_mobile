import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { SPACING, BORDER_RADIUS } from '../../../shared/theme/layout';
import { Fonts } from '../../../shared/theme/fonts';

const { width } = Dimensions.get('window');

interface BlogPost {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  content?: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: string;
}

interface BlogItemProps {
  post: BlogPost;
  onLikePress?: (postId: string) => void;
  onCommentPress?: (postId: string) => void;
  onSharePress?: (postId: string) => void;
}

const BlogItem: React.FC<BlogItemProps> = ({
  post,
  onLikePress,
  onCommentPress,
  onSharePress,
}) => {
  return (
    <View style={styles.container}>
      {/* User Info */}
      <View style={styles.userInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>👤</Text>
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{post.user.name}</Text>
          <Text style={styles.timestamp}>{post.timestamp}</Text>
        </View>
      </View>

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

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => onLikePress?.(post.id)}
        >
          <Text style={styles.actionIcon}>❤️</Text>
          <Text style={styles.actionText}>{post.likes}</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => onCommentPress?.(post.id)}
        >
          <Text style={styles.actionIcon}>💬</Text>
          <Text style={styles.actionText}>{post.comments}</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity 
          style={styles.actionButton} 
          onPress={() => onSharePress?.(post.id)}
        >
          <Text style={styles.actionIcon}>📤</Text>
          <Text style={styles.actionText}>Chia sẻ</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    marginHorizontal: SPACING.M,
    marginVertical: SPACING.S,
    borderRadius: BORDER_RADIUS.L,
    padding: SPACING.M,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.S,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.ROUND,
    backgroundColor: colors.blue.main,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.S,
  },
  avatarText: {
    fontSize: 20,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontFamily: Fonts.roboto.bold,
    color: colors.text.primary,
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: 12,
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
    height: 200,
    borderRadius: BORDER_RADIUS.M,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: SPACING.S,
    borderTopWidth: 1,
    borderTopColor: colors.grey[200],
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.L,
  },
  actionIcon: {
    fontSize: 18,
    marginRight: SPACING.XS,
  },
  actionText: {
    fontSize: 14,
    fontFamily: Fonts.roboto.regular,
    color: colors.text.secondary,
  },
});

export default BlogItem;