import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, FlatList, StyleSheet, Alert, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { colors } from '../../../shared/theme/colors';
import { SPACING } from '../../../shared/theme/layout';
import BlogHeader from '../components/BlogHeader';
import CreatePostInput from '../components/CreatePostInput';
import BlogItem from '../components/BlogItem';
import { useMainNavigation } from 'shared/hooks/navigation-hooks/useMainNavigationHooks';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMoreBlogs, fetchBlogs,resetBlogs,likePostToggle } from '../blog.slice';
import { AppDispatch, RootState } from 'src/presentation/store/store';
import { PostResDto } from 'src/presentation/dto/res/post.res.dto';
import { useIsFocused } from '@react-navigation/native';
const BlogScreen: React.FC = () => {
  const [newPostText, setNewPostText] = useState('');
  const navigation = useMainNavigation()
  const { posts, pagination, status, error } = useSelector((state: RootState) => state.blog)
  const dispatch = useDispatch<AppDispatch>();
  const [page, setPage] = useState(1)
  const [loadingMore, setLoadingMore] = useState(false);


  const isFocused = useIsFocused();
  useEffect(() => {
    if (!isFocused) {
      setVisibleItem("");
    }
  }, [isFocused]);


  useEffect(() => {
    dispatch(fetchBlogs({ page, limit: 20 }))
  }, [])

  const handelFetchMore = useCallback(() => {
    if (loadingMore) return;
    const totalPages = Number(pagination?.totalPages ?? 0);
    if (page > totalPages) return;

    setLoadingMore(true);
    const nextPage = page + 1;

    dispatch(fetchMoreBlogs({ page: nextPage, limit: 20 }))
      .unwrap()
      .finally(() => setLoadingMore(false));
    setPage(nextPage);

  }, [dispatch, loadingMore, page, pagination?.totalPages]);

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
    console.log("presss",postId);
    
    dispatch(likePostToggle({ postId }))
  }, []);

  const handleCommentPress = useCallback((post: PostResDto) => {
    navigation?.navigate('PostDetailScreen', { postId: post._id,post });
  }, [navigation]);

  const handleSharePress = useCallback((postId: string) => {
    Alert.alert('Chia sẻ', `Chia sẻ bài viết ${postId}`);
  }, []);

  const renderPost = useCallback(({ item, isVisible = true }: { item: PostResDto, isVisible: boolean }) => (
    <BlogItem
      post={{
        _id: item._id,
        content: item.content,
        createdAt: item.createdAt,
        mediaList: item.mediaList?.map((i) => ({
          url: i.url,
          type: i.type
        })),
        totalLikes: item.totalLikes || 0,
        user: {
          name: item.user.name,
          avatar: item.user.avatar
        },
        isLiked: item.likedByMe || false
      }}
      onLikePress={handleLikePress}
      onCommentPress={()=>handleCommentPress(item)}
      onSharePress={handleSharePress}
      isVisible={isVisible}
    />
  ), [handleLikePress, handleCommentPress, handleSharePress]);

  const keyExtractor = useCallback((item: PostResDto) => item._id, []);


  const [visibleItem, setVisibleItem] = useState<string>("");

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: { item: PostResDto }[] }) => {
      if (viewableItems.length > 0) {
        const currentId = viewableItems[0].item._id;
        console.log("Post đang hiển thị:", currentId);
        setVisibleItem(currentId);
      } else {
        setVisibleItem("");
      }
    }
  );
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = async () => {
    setRefreshing(true);
    dispatch(resetBlogs())
    await dispatch(fetchBlogs({ page, limit: 20 }))
    setRefreshing(false);
  };

  const viewConfigRef = useRef({
    viewAreaCoveragePercentThreshold: 80
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar backgroundColor={colors.app.primary.main} barStyle="light-content" />

      <BlogHeader
        onSearchPress={handleSearchPress}
        onProfilePress={handleProfilePress}
      />

      <CreatePostInput
        value={newPostText}
        onChangeText={setNewPostText}
        onImagePress={handleImagePress}
        onEmojiPress={handleEmojiPress}
        onInputPress={() => navigation.navigate('CreatePostScreen')}
      />

      <FlatList<PostResDto>
        refreshing={refreshing} 
        onRefresh={onRefresh}
        data={posts}
        renderItem={({ item }) => renderPost({ item, isVisible: visibleItem === item._id })}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        onViewableItemsChanged={onViewableItemsChanged.current}
        viewabilityConfig={viewConfigRef.current}
        onEndReached={() => {
          handelFetchMore()
        }}
        onEndReachedThreshold={0.2}
      />
    </KeyboardAvoidingView >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: SPACING.M,
  },
});

export default BlogScreen;