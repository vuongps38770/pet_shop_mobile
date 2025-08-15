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


const PostDetailScreen: React.FC = () => {
  const route = useRoute<RouteProp<MainStackParamList, 'PostDetailScreen'>>();
  const navigation = useMainNavigation();
  const postId = route?.params?.postId || '1';
  
  // Mock data - trong thực tế sẽ fetch từ API dựa trên postId
  const post: BlogPost = {
    id: postId,
    user: {
      id: '1',
      name: 'Nguyễn Văn A',
    },
    content: 'Chú mèo nhà tôi rất thích chơi bóng đá! 🐱⚽',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=300&fit=crop',
    likes: 12,
    comments: 5,
    timestamp: '2 giờ trước',
    isLiked: false,
  };

  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<BlogComment[]>([
    {
      id: '1',
      postId: post.id,
      user: {
        id: '2',
        name: 'Trần Thị B',
      },
      content: 'Mèo nhà bạn thật đáng yêu! 😍',
      timestamp: '1 giờ trước',
      likes: 3,
    },
    {
      id: '2',
      postId: post.id,
      user: {
        id: '3',
        name: 'Lê Văn C',
      },
      content: 'Bóng đá là môn thể thao yêu thích của mèo nhà mình luôn! ⚽',
      timestamp: '30 phút trước',
      likes: 1,
    },
    {
      id: '3',
      postId: post.id,
      user: {
        id: '4',
        name: 'Phạm Thị D',
      },
      content: 'Có ai biết cách dạy mèo chơi bóng không? Mình muốn thử! 🐱',
      timestamp: '15 phút trước',
      likes: 0,
    },
  ]);

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
    setComments(prevComments =>
      prevComments.map(comment =>
        comment.id === commentId
          ? { ...comment, likes: comment.likes + 1 }
          : comment
      )
    );
  }, []);

  const handleCommentReplyPress = useCallback((commentId: string) => {
    Alert.alert('Trả lời', `Trả lời bình luận ${commentId}`);
  }, []);

  const handleSubmitComment = useCallback(() => {
    if (!commentText.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập nội dung bình luận');
      return;
    }

    const newComment: BlogComment = {
      id: Date.now().toString(),
      postId: post.id,
      user: {
        id: 'current-user',
        name: 'Bạn',
      },
      content: commentText.trim(),
      timestamp: 'Vừa xong',
      likes: 0,
    };

    setComments(prevComments => [newComment, ...prevComments]);
    setCommentText('');
    Alert.alert('Thành công', 'Bình luận đã được đăng!');
  }, [commentText, post.id]);

  const renderComment = useCallback(({ item }: { item: BlogComment }) => (
    <CommentItem
      comment={item}
      onUserPress={handleUserPress}
      onLikePress={handleCommentLikePress}
      onReplyPress={handleCommentReplyPress}
    />
  ), [handleUserPress, handleCommentLikePress, handleCommentReplyPress]);

  const keyExtractor = useCallback((item: BlogComment) => item.id, []);

  const ListHeaderComponent = useCallback(() => (
    <PostDetailItem
      post={post}
      onLikePress={handleLikePress}
      onCommentPress={handleCommentPress}
      onSharePress={handleSharePostPress}
      onUserPress={handleUserPress}
    />
  ), [post, handleLikePress, handleCommentPress, handleSharePostPress, handleUserPress]);

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
        data={comments}
        renderItem={renderComment}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeaderComponent}
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
