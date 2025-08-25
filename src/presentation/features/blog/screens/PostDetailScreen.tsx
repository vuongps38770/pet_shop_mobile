import React, { useCallback, useEffect } from 'react';
import { View, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { SPACING } from '../../../shared/theme/layout';
import PostDetailHeader from '../components/PostDetailHeader';
import PostDetailItem from '../components/PostDetailItem';
import CommentInput from '../components/CommentInput';
import CommentList from '../components/CommentList';
import { BlogPost, BlogComment } from '../types/blog.types';
import { RouteProp, useRoute } from '@react-navigation/native';
import { MainStackParamList } from 'src/presentation/navigation/main-navigation/types';
import { useMainNavigation } from 'shared/hooks/navigation-hooks/useMainNavigationHooks';
import { BlogDetailHeader, BlogItem } from '../components';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from 'src/presentation/store/store';
import { useUserInfo } from 'shared/hooks/useUserInfo';
import { useComment } from '../hooks/useComment';
import { fetchPostComments, resetComment } from '../blog.slice';
import { PostCommentResDto } from 'src/presentation/dto/res/post.res.dto';

const PostDetailScreen: React.FC = () => {
  const route = useRoute<RouteProp<MainStackParamList, 'PostDetailScreen'>>();
  const navigation = useMainNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const postId = route?.params?.postId || '';
  const post = route?.params?.post || null;
  const { postCommentsPagination, postCommentsStatus } = useSelector((state: RootState) => state.blog)
  const { user } = useUserInfo()

  // Sử dụng useComment hook
  const {
    commentText,
    setCommentText,
    replyTo,
    isLoading: commentLoading,
    handleCreateComment,
    handleDeleteComment,
    handleLikeComment,
    handleReplyToComment,
    handleCancelReply,
    handleToggleExpanded,
  } = useComment(postId);

  // Load comments khi component mount
  useEffect(() => {
    if (postId) {
      dispatch(resetComment())
      dispatch(fetchPostComments({ postId, page: 1, limit: 20 }));
    }
  }, [postId, dispatch]);

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
    handleLikeComment(commentId);
  }, [handleLikeComment]);

  const handleCommentReplyPress = useCallback((comment: PostCommentResDto,) => {
    if (comment) {
      handleReplyToComment(comment);
    }
  }, [postCommentsPagination?.data, handleReplyToComment]);

  const handleCommentDeletePress = useCallback((commentId: string) => {
    handleDeleteComment(commentId);
  }, [handleDeleteComment]);

  const handleSubmitComment = useCallback(() => {
    handleCreateComment();
  }, [handleCreateComment]);

  if (!post)
    return null;
  return (
    <View
      style={styles.container}
    >

      <BlogDetailHeader
        onBackPress={handleBackPress}
        title={`Bài viết của ${post.user.name}`}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={90}
      >
        <ScrollView style={styles.contentContainer} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
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

          <CommentList
            comments={postCommentsPagination?.data || []}
            onUserPress={handleUserPress}
            onLikePress={handleCommentLikePress}
            onReplyPress={handleCommentReplyPress}
            onDeletePress={handleCommentDeletePress}
            onToggleExpanded={handleToggleExpanded}
          />
        </ScrollView>

        <CommentInput
          value={commentText}
          onChangeText={setCommentText}
          onSubmit={handleSubmitComment}
          onCancelReply={handleCancelReply}
          replyTo={replyTo || undefined}
          placeholder="Viết bình luận..."
          userAvatar={user?.avatar}
          isLoading={commentLoading}
        />
      </KeyboardAvoidingView>


    </View >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.default,
  },
  contentContainer: {
    flex: 1,
  },
  listContainer: {
    flexGrow: 1,
  },
});

export default PostDetailScreen;
