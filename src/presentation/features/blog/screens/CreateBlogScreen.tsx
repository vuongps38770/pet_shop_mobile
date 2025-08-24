import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    Image,
    StyleSheet,
    Alert,
    ActivityIndicator,
    StatusBar,
    KeyboardAvoidingView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useVideoPlayer, VideoView } from "expo-video";
import { useDispatch, useSelector } from "react-redux";
import { createBlogs, resetCreateStatus } from "../blog.slice";
import { CreatePostDto, CreatePostMediaDto, PostMediaType } from "src/presentation/dto/req/post.req.dto";
import { AppDispatch, RootState } from "src/presentation/store/store";
import { colors } from "theme/colors";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useMainNavigation } from "shared/hooks/navigation-hooks/useMainNavigationHooks";
const MAX_MEDIA = 10;
const MAX_VIDEO_DURATION_SEC = 60;

const CreatePostScreen : React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [content, setContent] = useState<string>("");
    const [medias, setMedias] = useState<CreatePostMediaDto[]>([]);
    const [loading, setLoading] = useState(false);

    const canSubmit = useMemo(() => content.trim().length > 0, [content, medias]);
    const navigation = useMainNavigation()
    const requestPermission = useCallback(async () => {
        const res = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!res.granted) {
            Alert.alert("Cần quyền truy cập", "Vui lòng cho phép truy cập thư viện.");
            return false;
        }
        return true;
    }, []);
    const { createStatus } = useSelector((state: RootState) => state.blog);

    useEffect(() => {
        if (createStatus == 'succeeded') {
            Alert.alert("Thành công", "Bài viết đã được đăng.");
            dispatch(resetCreateStatus())
        }
    }, [createStatus]);


    const pickMedia = useCallback(async () => {
        const ok = await requestPermission();
        if (!ok) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images", "videos"],
            allowsMultipleSelection: true,
            selectionLimit: MAX_MEDIA,
            videoMaxDuration: MAX_VIDEO_DURATION_SEC,
            quality: 1,
        });

        if (result.canceled) return;

        const assets = (result.assets ?? []).map<CreatePostMediaDto>((a) => {
            const isVideo = a.type === "video";
            return {
                type: isVideo ? PostMediaType.VIDEO : PostMediaType.IMAGE,
                file: {
                    uri: a.uri,
                    name: a.fileName ?? a.uri.split("/").pop() ?? "file",
                    mimeType: a.mimeType ?? (isVideo ? "video/mp4" : "image/jpeg"),
                },
            };
        });

        setMedias((prev) => [...prev, ...assets].slice(0, MAX_MEDIA));
    }, [requestPermission]);

    const removeMedia = useCallback((uri: string) => {
        setMedias((prev) => prev.filter((m) => m.file.uri !== uri));
    }, []);

    const handleSubmit = useCallback(async () => {
        if (!canSubmit) {
            Alert.alert("Thiếu nội dung", "Nhập nội dung để đăng.");
            return;
        }
        setLoading(true);
        try {
            const payload: CreatePostDto = { content: content.trim(), medias };
            await dispatch(createBlogs({ data: payload }));
            setContent("");
            setMedias([]);
        } catch (err) {
            console.error(err);
            Alert.alert("Lỗi", "Không thể tạo bài viết.");
        } finally {
            setLoading(false);
        }
    }, [canSubmit, content, medias, dispatch]);

    const renderItem = ({ item }: { item: CreatePostMediaDto }) => {
        if (item.type === PostMediaType.IMAGE) {
            return (
                <View style={styles.mediaItem}>
                    <Image source={{ uri: item.file.uri }} style={styles.media} />
                    <TouchableOpacity style={styles.removeBtn} onPress={() => removeMedia(item.file.uri)}>
                        <Text style={styles.removeTxt}>✕</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        return <VideoItem uri={item.file.uri} onRemove={() => removeMedia(item.file.uri)} />;
    };

    return (
        <KeyboardAvoidingView style={styles.container}>
            <StatusBar backgroundColor={colors.app.primary.main} barStyle="light-content" />
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={24} color={colors.white} />
                </TouchableOpacity>
                <Text style={styles.textHeader}>Tạo bài viết</Text>
            </View>
            <View style={styles.bodyContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Bạn đang nghĩ gì?"
                    placeholderTextColor="#666"
                    multiline
                    value={content}
                    onChangeText={setContent}
                />

                <FlatList
                    data={medias}
                    horizontal
                    keyExtractor={(item) => item.file.uri}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingVertical: 12, gap: 12 }}
                />

                <View style={styles.actions}>
                    <TouchableOpacity style={styles.pickBtn} onPress={pickMedia}>
                        <Text style={styles.pickTxt}>Chọn ảnh / video</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.postBtn, !canSubmit && styles.postBtnDisabled, { backgroundColor: colors.app.primary.main }]}
                        onPress={handleSubmit}
                        disabled={!canSubmit || loading}
                    >
                        {loading ? <ActivityIndicator color={colors.white} /> : <Text style={styles.postTxt}>Đăng</Text>}
                    </TouchableOpacity>
                </View>
            </View>

        </KeyboardAvoidingView>
    );
}
export default CreatePostScreen
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    bodyContainer: { flex: 1, padding: 16, backgroundColor: "#fff" },
    textHeader: { fontSize: 20, fontWeight: "700", color: colors.white },
    header: { width: "100%", backgroundColor: colors.app.primary.main, marginBottom: 12, padding: 10, flexDirection: 'row', alignItems: 'center' },
    input: { minHeight: 120, maxHeight: 300, borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 12, marginBottom: 12, textAlignVertical: "top" },
    mediaItem: { width: 170, height: 220, borderRadius: 8, overflow: "hidden", marginRight: 12 },
    media: { width: "100%", height: "100%" },
    removeBtn: { position: "absolute", top: 8, right: 8, backgroundColor: "rgba(0,0,0,0.6)", borderRadius: 14, paddingHorizontal: 8, paddingVertical: 4 },
    removeTxt: { color: "#fff", fontWeight: "700" },
    actions: { flexDirection: "row", justifyContent: "space-between", marginTop: 12 },
    pickBtn: { backgroundColor: "#eee", padding: 12, borderRadius: 8, flex: 1, marginRight: 12, alignItems: "center" },
    pickTxt: { fontSize: 14 },
    postBtn: { backgroundColor: "#1877f2", padding: 12, borderRadius: 8, alignItems: "center" },
    postBtnDisabled: { opacity: 0.5 },
    postTxt: { color: "#fff", fontWeight: "600" },
    backButton: {
        padding: 8,
    },
});
const VideoItem: React.FC<{ uri: string; onRemove: () => void }> = ({ uri, onRemove }) => {
    const player = useVideoPlayer(uri, (p) => p.pause());
    return (
        <View style={styles.mediaItem}>
            <VideoView style={styles.media} player={player} nativeControls />
            <TouchableOpacity style={styles.removeBtn} onPress={onRemove}>
                <Text style={styles.removeTxt}>✕</Text>
            </TouchableOpacity>
        </View>
    );
};