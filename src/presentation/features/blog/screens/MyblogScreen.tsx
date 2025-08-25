import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { AppDispatch, RootState } from 'src/presentation/store/store';
import { useMainNavigation } from 'shared/hooks/navigation-hooks/useMainNavigationHooks';
import { fetchMyBlogs,deletePost } from '../blog.slice';
import { PostResDto } from 'src/presentation/dto/res/post.res.dto';
import { useUserInfo } from 'shared/hooks/useUserInfo';
import { BlogHeader, BlogItem, CreatePostInput, MyBlogHeader } from '../components';
import { colors } from 'theme/colors';

const MyblogScreen: React.FC = () => {
    const navigation = useMainNavigation();
    const dispatch = useDispatch<AppDispatch>();

    const { myBlogs, fetchMyBlogsStatus } = useSelector((state: RootState) => state.blog);
    const { user } = useUserInfo()
    const [refreshing, setRefreshing] = useState(false);
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
    useEffect(() => {
        if (user?._id) {
            dispatch(fetchMyBlogs());
        }
    }, [dispatch, user?._id]);

    const handleCreatePost = () => {
        navigation.navigate('CreatePostScreen');
    };
    const viewConfigRef = useRef({
        viewAreaCoveragePercentThreshold: 80
    });
    const onRefresh = async () => {
        setRefreshing(true);
        await dispatch(fetchMyBlogs());
        setRefreshing(false);
    };

    const handleLikePress = useCallback((postId: string) => {
        console.log("presss", postId);

        // dispatch(likePostToggle({ postId }))
    }, []);

    const handleCommentPress = useCallback((postId: string) => {
        navigation?.navigate('PostDetailScreen', { postId });
    }, [navigation]);

    const handleSharePress = useCallback((postId: string) => {
        Alert.alert('Chia sẻ', `Chia sẻ bài viết ${postId}`);
    }, []);


    const keyExtractor = useCallback((item: PostResDto) => item._id, []);

    const handleEditPost = (blog: PostResDto) => {
        // navigation.navigate('EditBlog', { blog });
    };

    const handleDeletePost = (postId: string) => {
        Alert.alert(
            'Xác nhận xóa',
            'Bạn có chắc chắn muốn xóa bài đăng này không?',
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Xóa',
                    style: 'destructive',
                    onPress: () => {
                        dispatch(deletePost({postId}));
                    },
                },
            ],
            { cancelable: true }
        );
    };
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
            onCommentPress={handleCommentPress}
            onSharePress={handleSharePress}
            isVisible={isVisible}
        />
    ), [handleLikePress, handleCommentPress, handleSharePress]);

    if (fetchMyBlogsStatus === 'loading') {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <StatusBar backgroundColor={colors.app.primary.main} barStyle="light-content" />

            <MyBlogHeader onBackPress={()=>navigation.goBack()}/>

            <CreatePostInput
                userAvatar={user?.avatar}
                // value={newPostText}
                // onChangeText={setNewPostText}
                // onImagePress={handleImagePress}
                // onEmojiPress={handleEmojiPress}
                onInputPress={() => navigation.navigate('CreatePostScreen')}
            />

            <FlatList<PostResDto>
                refreshing={refreshing}
                onRefresh={onRefresh}
                data={myBlogs}
                renderItem={({ item }) => renderPost({ item, isVisible: visibleItem === item._id })}
                keyExtractor={keyExtractor}
                showsVerticalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged.current}
                viewabilityConfig={viewConfigRef.current}
                onEndReachedThreshold={0.2}
            />
        </KeyboardAvoidingView >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f2f5',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    blogItemContainer: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    blogContent: {
        flex: 1,
    },
    blogTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    blogContentText: {
        fontSize: 14,
        color: '#666',
    },
    actionsContainer: {
        flexDirection: 'row',
        marginLeft: 16,
    },
    actionButton: {
        padding: 8,
    },
    fab: {
        position: 'absolute',
        right: 30,
        bottom: 30,
        backgroundColor: '#007AFF',
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 8,
    },
    emptyText: {
        fontSize: 18,
        color: '#555',
    },
    emptySubText: {
        fontSize: 14,
        color: '#888',
        marginTop: 8,
    },
});

export default MyblogScreen;

