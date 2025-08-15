import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { SPACING } from '../../../shared/theme/layout';
import BlogHeader from '../components/BlogHeader';
import CreatePostInput from '../components/CreatePostInput';
import BlogItem from '../components/BlogItem';
import { BlogPost } from '../types/blog.types';
import { useMainNavigation } from 'shared/hooks/navigation-hooks/useMainNavigationHooks';

const BlogScreen: React.FC = () => {
  const [newPostText, setNewPostText] = useState('');
  const navigation = useMainNavigation()
  const [posts, setPosts] = useState<BlogPost[]>([
    {
      id: '1',
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
    },
    {
      id: '2',
      user: {
        id: '2',
        name: 'Trần Thị B',
      },
      content: 'Chia sẻ khoảnh khắc đáng yêu của bé cún nhà mình! 🐕',
      image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop',
      likes: 8,
      comments: 3,
      timestamp: '4 giờ trước',
      isLiked: true,
    },
    {
      id: '3',
      user: {
        id: '3',
        name: 'Lê Văn C',
      },
      content: 'Mèo con mới về nhà, các bạn có lời khuyên gì không? 😸',
      likes: 15,
      comments: 8,
      timestamp: '6 giờ trước',
      isLiked: false,
    },
  ]);

  const handleSearchPress = useCallback(() => {
    Alert.alert('Tìm kiếm', 'Chức năng tìm kiếm sẽ được phát triển sau');
  }, []);

  const handleProfilePress = useCallback(() => {
    Alert.alert('Hồ sơ', 'Chức năng hồ sơ sẽ được phát triển sau');
  }, []);

  const handleImagePress = useCallback(() => {
    Alert.alert('Thêm ảnh', 'Chức năng thêm ảnh sẽ được phát triển sau');
  }, []);

  const handleEmojiPress = useCallback(() => {
    Alert.alert('Thêm emoji', 'Chức năng thêm emoji sẽ được phát triển sau');
  }, []);

  const handleLikePress = useCallback((postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
              isLiked: !post.isLiked,
            }
          : post
      )
    );
  }, []);

  const handleCommentPress = useCallback((postId: string) => {
    navigation?.navigate('PostDetailScreen', { postId });
  }, [navigation]);

  const handleSharePress = useCallback((postId: string) => {
    Alert.alert('Chia sẻ', `Chia sẻ bài viết ${postId}`);
  }, []);

  const handleCreatePost = useCallback(() => {
    if (!newPostText.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập nội dung bài viết');
      return;
    }

    const newPost: BlogPost = {
      id: Date.now().toString(),
      user: {
        id: 'current-user',
        name: 'Bạn',
      },
      content: newPostText.trim(),
      likes: 0,
      comments: 0,
      timestamp: 'Vừa xong',
      isLiked: false,
    };

    setPosts(prevPosts => [newPost, ...prevPosts]);
    setNewPostText('');
    Alert.alert('Thành công', 'Bài viết đã được đăng!');
  }, [newPostText]);



  const renderPost = useCallback(({ item }: { item: BlogPost }) => (
    <BlogItem
      post={item}
      onLikePress={handleLikePress}
      onCommentPress={handleCommentPress}
      onSharePress={handleSharePress}
    />
  ), [handleLikePress, handleCommentPress, handleSharePress]);

  const keyExtractor = useCallback((item: BlogPost) => item.id, []);

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <BlogHeader
        onSearchPress={handleSearchPress}
        onProfilePress={handleProfilePress}
      />
      
      <CreatePostInput
        value={newPostText}
        onChangeText={setNewPostText}
        onImagePress={handleImagePress}
        onEmojiPress={handleEmojiPress}
      />
      
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
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
    paddingBottom: SPACING.M,
  },
});

export default BlogScreen;