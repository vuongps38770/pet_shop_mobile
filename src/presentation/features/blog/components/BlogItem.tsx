import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { SPACING, BORDER_RADIUS } from '../../../shared/theme/layout';
import { Fonts } from '../../../shared/theme/fonts';
import { PostResDto } from 'src/presentation/dto/res/post.res.dto';
import { HeartAnimatedIcon } from 'shared/components/HeartAnimatedIcon';
import ImageVideoSlider from 'shared/components/image-video-slider';
import { formatDate } from 'app/utils/time';

const { width } = Dimensions.get('window');



interface BlogItemProps {
  post: {
    user: {
      name: string,
      avatar:string
    }
    createdAt: string,
    content: string,
    mediaList?: {
      url: string,
      type:string
    }[],
    _id: string,
    totalLikes: number,
    isLiked:boolean
  };
  onLikePress?: (postId: string) => void;
  onCommentPress?: (postId: string) => void;
  onSharePress?: (postId: string) => void;
  isVisible?: boolean;
}

const BlogItem: React.FC<BlogItemProps> = ({
  post,
  onLikePress,
  onCommentPress,
  onSharePress,
  isVisible=true
}) => {
  return (
    <View style={styles.container}>
      {/* User Info */}
      <View style={styles.userInfo}>
        <View style={styles.avatar}>
          <Image source={{uri:post.user.avatar}} style={{width:44, height:44, borderRadius:50}}/>
        </View>
        <View style={styles.userDetails}>
          <Text style={styles.userName}>{post.user.name}</Text>
          <Text style={styles.timestamp}>{formatDate(post.createdAt)}</Text>
        </View>
      </View>

      {/* Content */}
      {post.content && (
        <Text style={styles.content}>{post.content}</Text>
      )}

      {/* Image */}
      {post.mediaList && post.mediaList.length>0 && (
        <View style={styles.imageContainer}>

          <ImageVideoSlider
            height={300}
            medias={post.mediaList.map((item)=>({
              type:item.type,
              urls:item.url
            }))}
            autoScroll={false}
            isVisible={isVisible}
          />
        </View>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          // onPress={() => onLikePress?.(post._id)}
        >
          <HeartAnimatedIcon isFavorite={post.isLiked} onPress={() => onLikePress?.(post._id)} size={24} unFavoriteIconColor={colors.black}/>
          <Text style={styles.actionText}>{post.totalLikes}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onCommentPress?.(post._id)}
        >
          <Text style={styles.actionIcon}>💬</Text>
          {/* <Text style={styles.actionText}>{post.comments}</Text> */}
        </TouchableOpacity>


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