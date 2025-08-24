import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { SPACING } from '../../../shared/theme/layout';
import PostDetailHeader from '../components/PostDetailHeader';
import PostDetailItem from '../components/PostDetailItem';
import CommentItem from '../components/CommentItem';
import CommentInput from '../components/CommentInput';
import { BlogPost, BlogComment } from '../types/blog.types';
import { RouteProp, useRoute } from '@react-navigation/native';
import { MainStackParamList } from 'src/presentation/navigation/main-navigation/types';
import { useMainNavigation } from 'shared/hooks/navigation-hooks/useMainNavigationHooks';
import { BlogItem } from '../components';
import { PostCommentResDto } from 'src/presentation/dto/res/post.res.dto';
import { useSelector } from 'react-redux';
import { RootState } from 'src/presentation/store/store';
import { useUserInfo } from 'shared/hooks/useUserInfo';


const PostDetailScreen: React.FC = () => {
  const route = useRoute<RouteProp<MainStackParamList, 'PostDetailScreen'>>();
  const navigation = useMainNavigation();
  const postId = route?.params?.postId || '';
  const post = route?.params?.post || null;
  const {postCommentsPagination} = useSelector((state:RootState)=>state.blog)
  const {user} = useUserInfo()

  const [commentText, setCommentText] = useState('');

  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleSharePress = useCallback(() => {
    Alert.alert('Chia sẻ', 'Chia sẻ bài viết này');
  }, []);

  const handleMorePress = useCallback(() => {
    Alert.alert('Tùy chọn', 'Các tùy chọn khác');
  }, []);

  const handleLikePress = useCallback((postId: string) => {
    Alert.alert('Thích', `Đã thích bài viết ${postId}`);
  }, []);

  const handleCommentPress = useCallback((postId: string) => {
    Alert.alert('Bình luận', `Bình luận cho bài viết ${postId}`);
  }, []);

  const handleSharePostPress = useCallback((postId: string) => {
    Alert.alert('Chia sẻ', `Chia sẻ bài viết ${postId}`);
  }, []);

  const handleUserPress = useCallback((userId: string) => {
    Alert.alert('Hồ sơ', `Xem hồ sơ người dùng ${userId}`);
  }, []);

  const handleCommentLikePress = useCallback((commentId: string) => {

  }, []);

  const handleCommentReplyPress = useCallback((commentId: string) => {
    Alert.alert('Trả lời', `Trả lời bình luận ${commentId}`);
  }, []);

  const handleSubmitComment = useCallback(() => {

  }, [commentText]);

  const renderComment = useCallback(({ item }: { item: PostCommentResDto }) => (
    <CommentItem
      comment={item}
      onUserPress={handleUserPress}
      onLikePress={handleCommentLikePress}
      onReplyPress={handleCommentReplyPress}
    />
  ), [handleUserPress, handleCommentLikePress, handleCommentReplyPress]);

  const keyExtractor = useCallback((item: PostCommentResDto) => item._id, []);

  if (!post)
    return null;
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <PostDetailHeader
        onBackPress={handleBackPress}
        onSharePress={handleSharePress}
        onMorePress={handleMorePress}
      />


      <FlatList
        data={postCommentsPagination?.data || []}
        renderItem={renderComment}
        keyExtractor={keyExtractor}
        ListHeaderComponent={() => {
          return (
            <BlogItem
              post={{
                _id: post._id,
                content: post.content,
                createdAt: post.createdAt,
                mediaList: post.mediaList?.map((i) => ({
                  url: i.url,
                  type: i.type
                })),
                totalLikes: post.totalLikes || 0,
                user: {
                  name: post.user.name,
                  avatar: post.user.avatar
                },
                isLiked: post.likedByMe || false
              }}
              onLikePress={handleLikePress}
              onCommentPress={handleCommentPress}
              onSharePress={handleSharePress}
              isVisible={true}
            />
          )
        }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />

      <CommentInput
        value={commentText}
        onChangeText={setCommentText}
        onSubmit={handleSubmitComment}
        placeholder="Viết bình luận..."
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  listContainer: {
    flexGrow: 1,
  },
});

export default PostDetailScreen;
