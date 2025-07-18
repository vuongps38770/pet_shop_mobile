import React, { useState, useEffect, use } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, Modal, Pressable, Image } from 'react-native';
import { colors } from 'theme/colors';
import { Fonts } from 'theme/fonts';
import { Ionicons } from '@expo/vector-icons';
import { useMainNavigation } from 'shared/hooks/navigation-hooks/useMainNavigationHooks';
import { useSelector, useDispatch } from 'react-redux';
import { setShopConversation, getAllConversations, createShopConversation, getOlderMessages } from '../slice/conservation.slice';
import socket from 'app/config/socket';
import { useUserInfo } from 'shared/hooks/useUserInfo';
import { storageHelper } from 'app/config/storage';
import axiosInstance from 'app/config/axios';
import { AppDispatch, RootState } from 'src/presentation/store/store';
import { ConversationRespondDto, MessageRespondDto } from 'src/presentation/dto/res/chat-respond.dto';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';
import * as ImagePicker from 'expo-image-picker';
import { uploadFiles } from 'src/presentation/store/slices/upload.slice';
import { CreateMessageDto } from 'src/presentation/dto/req/message.req';
import { useOrderSuggestionFromClipboard, OrderSuggestionDto } from 'shared/hooks/useOrderSuggestionFromClipboard';
import ImageViewing from 'react-native-image-viewing';
import Clipboard from '@react-native-clipboard/clipboard';
dayjs.extend(relativeTime);
dayjs.locale('vi');

const ChatWithAdminScreen = () => {
    const navigation = useMainNavigation();
    const dispatch = useDispatch<AppDispatch>();
    const shopConversation = useSelector((state: RootState) => state.chat.conservation.shopConversation);
    const { user } = useUserInfo();
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<MessageRespondDto[]>([]);
    const [input, setInput] = useState('');
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const SEND_MESSAGE_EVENT = 'send_message';
    const JOIN_CONVERSATION_EVENT = 'join_conversation';
    const RECEIVE_MESSAGE_EVENT = 'receive_message';
    const EDIT_MESSAGE_EVENT = 'edit_message';
    const AUTHORIZED_EVENT = 'authorized';
    const UNAUTHORIZED_EVENT = 'unauthorized';
    const [showOptions, setShowOptions] = useState(false);
    const [showImageSheet, setShowImageSheet] = useState(false);
    const [imagePreview, setImagePreview] = useState<string[]>([]);
    const [sending, setSending] = useState(false);
    const { orderData: orderSuggestion, loading: loadingOrderSuggestion } = useOrderSuggestionFromClipboard();
    const [showOrderSuggestion, setShowOrderSuggestion] = useState(true);
    const [showOrderSendModal, setShowOrderSendModal] = useState(false);
    const [orderSendContent, setOrderSendContent] = useState('');
    // State cache cho các order suggestion đã fetch
    const [orderSuggestionMap, setOrderSuggestionMap] = useState<Record<string, OrderSuggestionDto | null>>({});
    // State xem ảnh
    const [imageViewerVisible, setImageViewerVisible] = useState(false);
    const [imageViewerImages, setImageViewerImages] = useState<{ uri: string }[]>([]);
    const [imageViewerIndex, setImageViewerIndex] = useState(0);

    // Lấy access token từ storage
    useEffect(() => {
        storageHelper.getAccessToken().then(setToken);
    }, []);

    useEffect(() => {
        const ensureShopConversation = async () => {
            setLoading(true);
            const list = await dispatch(getAllConversations()).unwrap();

            const existingShopConversation = list.find(
                (c: ConversationRespondDto) => c.type === 'shop'
            );

            if (!existingShopConversation) {
                await dispatch(createShopConversation()).unwrap();
                await dispatch(getAllConversations()).unwrap();
            }
            setLoading(false);
        };
        ensureShopConversation();
    }, [dispatch]);


    useEffect(() => {
        const loadInitialMessages = async () => {
            if (shopConversation?._id && messages.length === 0) {
                setLoading(true);
                try {
                    const older = await (dispatch as any)(getOlderMessages({
                        conversationId: shopConversation._id,
                        limit: 20,
                    })).unwrap();
                    setMessages(older || []);
                    setHasMore(older && older.length === 20);
                } catch {
                    setMessages([]);
                    setHasMore(false);
                }
                setLoading(false);
            }
        };
        loadInitialMessages();
    }, [shopConversation?._id]);


    // Kết nối socket và join phòng
    useEffect(() => {
        if (!shopConversation?._id || !token) return;

        if (socket.connected) {
            socket.disconnect();
        }
        socket.auth = { token };
        socket.connect();

        socket.on('connect', () => {
            console.log('✅ Socket connected:', socket.id);
        });

        socket.on('connect_error', (err) => {
            console.error('❌ Socket connection error:', err.message);
        });

        socket.on(AUTHORIZED_EVENT, (msg) => {
            console.error('🚫 Unauthorized:', msg);
        });

        socket.on('disconnect', (reason) => {
            console.warn('⚠️ Socket disconnected:', reason);
        });



        socket.emit(JOIN_CONVERSATION_EVENT, { conversationId: shopConversation._id });
        // Lắng nghe tin nhắn mới
        socket.on(RECEIVE_MESSAGE_EVENT, (msg: MessageRespondDto) => {
            console.log('New message received:', msg);
            setMessages(prev => [msg, ...prev]);
        });
        return () => {
            socket.off(RECEIVE_MESSAGE_EVENT);
            socket.removeAllListeners();
            socket.disconnect();
        };
    }, [shopConversation?._id, token]);

    // Load thêm tin nhắn cũ
    const loadMoreMessages = async () => {
        if (loadingMore || !shopConversation?._id || !messages.length || !hasMore) return;
        setLoadingMore(true);
        const lastMsg = messages[messages.length - 1];
        try {
            const older = await (dispatch as any)(getOlderMessages({
                conversationId: shopConversation._id,
                before: typeof lastMsg.createdAt === 'string' ? lastMsg.createdAt : lastMsg.createdAt.toString(),
                limit: 20,
            })).unwrap();
            if (older && older.length > 0) {
                setMessages((prev) => [...prev, ...older]);
                if (older.length < 20) setHasMore(false);
            } else {
                setHasMore(false);
            }
        } catch {
            setHasMore(false);
        }
        setLoadingMore(false);
    };

    // Xử lý messages để chèn separator ngày và thời gian
    function processMessages(messages: MessageRespondDto[]) {
        const result: any[] = [];
        let lastDate = '';
        let lastTime: any = null;
        const now = dayjs();
        // Duyệt ngược từ mới nhất về cũ nhất
        for (let i = messages.length - 1; i >= 0; i--) {
            const msg = messages[i];
            const msgDate = dayjs(msg.createdAt).format('YYYY-MM-DD');
            // Separator ngày: luôn nằm trước tin nhắn đầu tiên của ngày đó
            if (msgDate !== lastDate) {
                if (dayjs(msg.createdAt).isSame(now, 'day')) {
                    result.push({ type: 'date', label: 'Hôm nay', id: `date-${msgDate}-${i}` });
                } else if (dayjs(msg.createdAt).isSame(now.subtract(1, 'day'), 'day')) {
                    result.push({ type: 'date', label: 'Hôm qua', id: `date-${msgDate}-${i}` });
                } else {
                    result.push({ type: 'date', label: dayjs(msg.createdAt).format('DD/MM/YYYY'), id: `date-${msgDate}-${i}` });
                }
                lastDate = msgDate;
                lastTime = null;
            }
            // Separator thời gian: nếu cách nhau > 1 phút thì ghi rõ ngày giờ
            if (lastTime) {
                const diff = Math.abs(dayjs(lastTime).diff(msg.createdAt, 'minute'));
                if (diff >= 1) {
                    let label = '';
                    if (dayjs(lastTime).isSame(now, 'day')) {
                        label = `Hôm nay ${dayjs(lastTime).format('HH:mm')}`;
                    } else if (dayjs(lastTime).isSame(now.subtract(1, 'day'), 'day')) {
                        label = `Hôm qua ${dayjs(lastTime).format('HH:mm')}`;
                    } else {
                        label = `${dayjs(lastTime).format('DD/MM/YYYY HH:mm')}`;
                    }
                    result.push({ type: 'time', label, id: `time-${msg._id}` });
                }
            }
            result.push({ type: 'message', ...msg });
            lastTime = msg.createdAt;
        }
        return result.reverse(); // Đảo lại để FlatList inverted hiển thị đúng
    }

    const processedMessages = processMessages(messages);


    const fetchOrderSuggestionIfNeeded = async (orderId: string) => {
        if (!orderId || orderSuggestionMap[orderId]) return;
        try {
            const res = await axiosInstance.get(`/order/order-suggest-by-id/${orderId}`);
            console.log(`Fetched order suggestion for ${orderId}:`, res.data);
            if (res.data && res.data.success && res.data.data) {
                setOrderSuggestionMap(prev => ({ ...prev, [orderId]: res.data.data }));
            } else {
                setOrderSuggestionMap(prev => ({ ...prev, [orderId]: null }));
            }
        } catch {
            setOrderSuggestionMap(prev => ({ ...prev, [orderId]: null }));
        }
    };

    const handleSend = async () => {
        if (!input.trim() && imagePreview.length === 0) return;
        if (!shopConversation?._id) return;
        setSending(true);
        let images: string[] = [];
        if (imagePreview.length > 0) {
            try {
                const files = imagePreview.map((uri, idx) => ({
                    uri,
                    type: 'image/jpeg',
                    name: `chat-image-${idx}.jpg`,
                }));
                const urls = await (dispatch as any)(uploadFiles(files)).unwrap();
                images = urls;
            } catch (err) {
                alert('Lỗi upload ảnh, vui lòng thử lại!');
                setSending(false);
                return;
            }
        }
        const data: CreateMessageDto = {
            conversationId: shopConversation._id,
            content: input,
            images: images.length > 0 ? images : undefined,
        };
        socket.emit(SEND_MESSAGE_EVENT, data);
        setInput('');
        setImagePreview([]);
        setSending(false);
    };

    // Hàm chọn ảnh từ thư viện
    const handlePickImage = async () => {
        setShowImageSheet(false);
        const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!granted) {
            alert('Cần quyền truy cập thư viện ảnh');
            return;
        }
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: 'images',
                allowsEditing: true,
                quality: 1,
                selectionLimit: 3 - imagePreview.length, 
            });
            if (!result.canceled && result.assets?.length) {
                const uris = result.assets.map(a => a.uri).filter(Boolean);
                setImagePreview(prev => [...prev, ...uris].slice(0, 3));
            }
        } catch (error) {
            alert('Không thể mở thư viện ảnh');
        }
    };

    // Hàm chụp ảnh
    const handleTakePhoto = async () => {
        setShowImageSheet(false);
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (!permissionResult.granted) {
            alert('Cần quyền truy cập camera để chụp ảnh');
            return;
        }
        try {
            const result = await ImagePicker.launchCameraAsync({
                allowsEditing: true,
                quality: 1,
            });
            if (!result.canceled && result.assets[0]?.uri) {
                setImagePreview(prev => prev.length < 3 ? [...prev, result.assets[0].uri] : prev);
            }
        } catch (error) {
            alert('Không thể mở camera');
        }
    };

    // Hàm gửi gợi ý đơn hàng vào chat
    const handleSendOrderSuggestion = () => {
        if (!orderSuggestion || !shopConversation?._id) return;
        const data = {
            conversationId: shopConversation._id,
            orderId: orderSuggestion.id,
        };
        socket.emit('send_message', data);
        setShowOrderSuggestion(false);
    };

    const handleSendOrderToChat = () => {
        if (!orderSendContent) return;
        setInput(orderSendContent);
        setShowOrderSendModal(false);
        setOrderSendContent('');
    };

    const renderItem = ({ item }: { item: MessageRespondDto }) => {

        
        let orderId: string | null = null;
        if (item.orderId) {
            orderId = item.orderId;
            fetchOrderSuggestionIfNeeded(orderId);
        } else if (item.content) {
            const match = item.content.match(/Mã đơn: ([\w\d]+)/);
            if (match && match[1]) {
                orderId = match[1];
                fetchOrderSuggestionIfNeeded(orderId);
            }
        }
        return (
        <View
            style={[
                styles.messageContainer,
                item.sender === user?._id ? styles.userMessage : styles.adminMessage,
            ]}
        >
            {item.images && item.images.length > 0 && (
                <View style={styles.messageImagesContainer}>
                        {(item.images ?? []).map((img, idx) => (
                            <TouchableOpacity
                                key={img + idx}
                                onPress={() => {
                                    setImageViewerImages((item.images ?? []).map(u => ({ uri: u })));
                                    setImageViewerIndex(idx);
                                    setImageViewerVisible(true);
                                }}
                            >
                            <Image source={{ uri: img }} style={styles.messageImage} />
                        </TouchableOpacity>
                    ))}
                </View>
            )}
            {item.content ? <Text style={styles.messageText}>{item.content}</Text> : null}
                {/* Nếu có orderId và đã fetch xong, hiển thị block thông tin đơn hàng */}
                {orderId && orderSuggestionMap[orderId] && (
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => navigation.navigate('AllDetails', { orderId })}
                        style={{ backgroundColor: '#FFF8E1', borderRadius: 10, marginTop: 8, padding: 10, borderWidth: 1, borderColor: '#FFAF42' }}
                    >
                        <Text style={{ color: '#FFAF42', fontWeight: 'bold', marginBottom: 2 }}>Đơn hàng</Text>
                        <Text style={{ color: '#333' }}>Mã đơn: <Text style={{ fontWeight: 'bold' }}>{orderSuggestionMap[orderId]?.sku}</Text></Text>
                        <Text style={{ color: '#333' }}>Thành tiền: <Text style={{ fontWeight: 'bold' }}>{orderSuggestionMap[orderId]?.totalPrice?.toLocaleString()}đ</Text></Text>
                        <Text style={{ color: '#333' }}>Người nhận: <Text style={{ fontWeight: 'bold' }}>{orderSuggestionMap[orderId]?.shippingAddress?.receiverFullname}</Text></Text>
                    </TouchableOpacity>
                )}
        </View>
    );
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={80}
        >
            {/* Gợi ý đơn hàng từ clipboard - hiển thị ngay trên ô nhập chat */}
            {orderSuggestion && showOrderSuggestion && (
                <View style={{ backgroundColor: '#222', opacity: 0.95, borderRadius: 12, marginHorizontal: 12, marginBottom: 4, padding: 12, borderWidth: 1, borderColor: '#FFAF42', flexDirection: 'row', alignItems: 'center', position: 'absolute', left: 0, right: 0, bottom: 60, zIndex: 10 }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ color: '#FFAF42', fontWeight: 'bold', marginBottom: 2 }}>Đơn hàng đã sao chép</Text>
                        <Text style={{ color: '#fff' }}>Mã đơn: <Text style={{ fontWeight: 'bold' }}>{orderSuggestion.sku}</Text></Text>
                        <Text style={{ color: '#fff' }}>Thành tiền: <Text style={{ fontWeight: 'bold' }}>{orderSuggestion.totalPrice?.toLocaleString()}đ</Text></Text>
                        <Text style={{ color: '#fff' }}>Người nhận: <Text style={{ fontWeight: 'bold' }}>{orderSuggestion.shippingAddress?.receiverFullname}</Text></Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 8 }}>
                        <TouchableOpacity onPress={handleSendOrderSuggestion} style={{ backgroundColor: '#FFAF42', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 12, marginRight: 6 }}>
                            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Gửi</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { setShowOrderSuggestion(false); Clipboard.setString(''); }} style={{ alignItems: 'center', padding: 4 }}>
                            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>✕</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}

            {/* Modal gửi đơn hàng */}
            {showOrderSendModal && (
                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, width: '85%', maxWidth: 400 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#FFAF42', marginBottom: 12 }}>Xác nhận gửi đơn hàng</Text>
                        <Text style={{ color: '#333', marginBottom: 16, fontSize: 15, lineHeight: 22 }}>{orderSendContent}</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
                            <TouchableOpacity onPress={() => { setShowOrderSendModal(false); setOrderSendContent(''); }} style={{ paddingVertical: 8, paddingHorizontal: 18, borderRadius: 8, backgroundColor: '#eee' }}>
                                <Text style={{ color: '#888', fontWeight: 'bold' }}>Đóng</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleSendOrderToChat} style={{ paddingVertical: 8, paddingHorizontal: 18, borderRadius: 8, backgroundColor: '#FFAF42' }}>
                                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Gửi</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={colors.app.primary.main} />
                </TouchableOpacity>
                <Ionicons name="chatbubble-ellipses-outline" size={24} color={colors.app.primary.main} style={{ marginLeft: 4 }} />
                <Text style={styles.headerTitle}>Chat với Admin</Text>
            </View>
            {loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color={colors.app.primary.main} />
                </View>
            ) : (
                <FlatList<any>
                    data={processedMessages}
                    renderItem={({ item }) => {
                        if (item.type === 'date') {
                            return <View style={styles.dateSeparator}><Text style={styles.dateSeparatorText}>{item.label}</Text></View>;
                        }
                        if (item.type === 'time') {
                            return <View style={styles.timeSeparator}><Text style={styles.timeSeparatorText}>{item.label}</Text></View>;
                        }
                        // message
                        return renderItem({ item });
                    }}
                    keyExtractor={item => item.id?.toString() || item._id?.toString()}
                    contentContainerStyle={styles.messagesList}
                    inverted
                    onEndReached={loadMoreMessages}
                    onEndReachedThreshold={0.2}
                    ListFooterComponent={loadingMore ? <ActivityIndicator color={colors.app.primary.main} /> : null}
                />
            )}
            {imagePreview.length > 0 && (
                <View style={styles.imagesPreviewContainer}>
                    {imagePreview.map((uri, idx) => (
                        <View key={uri} style={[styles.imagePreviewWrapper, { left: idx * 32, zIndex: 3 - idx }]}>
                            <Image source={{ uri }} style={styles.imagePreview} />
                            <TouchableOpacity style={styles.removeImageBtn} onPress={() => setImagePreview(prev => prev.filter(u => u !== uri))}>
                                <Ionicons name="close-circle" size={22} color={colors.red.main} />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            )}
            {/* Modal xem ảnh */}
            <ImageViewing
                images={imageViewerImages}
                imageIndex={imageViewerIndex}
                visible={imageViewerVisible}
                onRequestClose={() => setImageViewerVisible(false)}
            />
            <View style={styles.inputContainer}>
                <TouchableOpacity style={styles.plusButton} onPress={() => setShowOptions(v => !v)} disabled={sending}>
                    <Ionicons name="add" size={28} color={colors.app.primary.main} />
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    placeholder="Nhập tin nhắn..."
                    value={input}
                    onChangeText={setInput}
                    placeholderTextColor={colors.grey[400]}
                    editable={!sending}
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={sending}>
                    {sending ? (
                        <ActivityIndicator size={20} color={colors.white} />
                    ) : (
                        <Ionicons name="send" size={20} color="#fff" />
                    )}
                </TouchableOpacity>
            </View>
            {/* Option popup */}
            {showOptions && (
                <View style={styles.optionsPopup}>
                    <TouchableOpacity style={styles.optionItem} onPress={() => { setShowOptions(false); setShowImageSheet(true); }}>
                        <Ionicons name="image-outline" size={22} color={colors.app.primary.main} />
                        <Text style={styles.optionText}>Ảnh</Text>
                    </TouchableOpacity>
                    {imagePreview.length === 0 && (
                        <>
                            <TouchableOpacity style={styles.optionItem} onPress={() => { setShowOptions(false); /* TODO: chọn sản phẩm */ }}>
                                <Ionicons name="pricetag-outline" size={22} color={colors.app.primary.main} />
                                <Text style={styles.optionText}>Sản phẩm</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.optionItem} onPress={() => { setShowOptions(false); /* TODO: chọn đơn hàng */ }}>
                                <Ionicons name="receipt-outline" size={22} color={colors.app.primary.main} />
                                <Text style={styles.optionText}>Đơn hàng</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            )}
            {/* Bottom sheet chọn/chụp ảnh */}
            <Modal
                visible={showImageSheet}
                transparent
                animationType="slide"
                onRequestClose={() => setShowImageSheet(false)}
            >
                <Pressable style={styles.sheetOverlay} onPress={() => setShowImageSheet(false)} />
                <View style={styles.bottomSheet}>
                    <TouchableOpacity style={styles.sheetItem} onPress={handlePickImage}>
                        <Ionicons name="images-outline" size={22} color={colors.app.primary.main} />
                        <Text style={styles.sheetText}>Chọn ảnh từ thư viện</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.sheetItem} onPress={handleTakePhoto}>
                        <Ionicons name="camera-outline" size={22} color={colors.app.primary.main} />
                        <Text style={styles.sheetText}>Chụp ảnh</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.default,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: colors.white,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        elevation: 2,
    },
    backBtn: {
        marginRight: 8,
        padding: 4,
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: Fonts.roboto.bold,
        color: colors.app.primary.main,
        marginLeft: 8,
    },
    messagesList: {
        flexGrow: 1,
        justifyContent: 'flex-end',
        padding: 16,
    },
    messageContainer: {
        maxWidth: '75%',
        borderRadius: 16,
        padding: 12,
        marginBottom: 10,
    },
    userMessage: {
        backgroundColor: colors.app.primary.main,
        alignSelf: 'flex-end',
    },
    adminMessage: {
        backgroundColor: colors.grey[100],
        alignSelf: 'flex-start',
    },
    messageText: {
        color: colors.text.primary,
        fontFamily: Fonts.roboto.regular,
        fontSize: 15,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 8,
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    plusButton: {
        marginRight: 8,
        padding: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    optionsPopup: {
        position: 'absolute',
        bottom: 60,
        left: 16,
        backgroundColor: colors.white,
        borderRadius: 12,
        padding: 8,
        elevation: 4,
        flexDirection: 'row',
        zIndex: 10,
    },
    optionItem: {
        alignItems: 'center',
        marginHorizontal: 12,
    },
    optionText: {
        fontSize: 12,
        color: colors.app.primary.main,
        marginTop: 2,
        fontFamily: Fonts.roboto.regular,
    },
    sheetOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
    },
    bottomSheet: {
        backgroundColor: colors.white,
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        padding: 16,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
    },
    sheetItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
    },
    sheetText: {
        fontSize: 15,
        color: colors.app.primary.main,
        marginLeft: 12,
        fontFamily: Fonts.roboto.regular,
    },
    input: {
        flex: 1,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.grey[100],
        paddingHorizontal: 16,
        fontFamily: Fonts.roboto.regular,
        color: colors.text.primary,
    },
    sendButton: {
        marginLeft: 8,
        backgroundColor: colors.app.primary.main,
        borderRadius: 20,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dateSeparator: {
        alignSelf: 'center',
        marginVertical: 8,
        backgroundColor: colors.grey[200],
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 4,
    },
    dateSeparatorText: {
        color: colors.text.secondary,
        fontFamily: Fonts.roboto.medium,
        fontSize: 13,
    },
    timeSeparator: {
        alignSelf: 'center',
        marginVertical: 2,
        backgroundColor: colors.grey[100],
        borderRadius: 8,
        paddingHorizontal: 10,
        paddingVertical: 2,
    },
    timeSeparatorText: {
        color: colors.text.hint,
        fontFamily: Fonts.roboto.regular,
        fontSize: 11,
    },
    imagesPreviewContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        marginLeft: 8,
        height: 60,
        position: 'relative',
        minHeight: 60,
    },
    imagePreviewWrapper: {
        position: 'absolute',
        top: 0,
        // left: idx * 32,
        width: 60,
        height: 60,
        borderRadius: 8,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.grey[300],
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagePreview: {
        width: 56,
        height: 56,
        borderRadius: 8,
    },
    removeImageBtn: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: colors.white,
        borderRadius: 12,
        zIndex: 2,
    },
    messageImagesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 6,
        gap: 6,
    },
    messageImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginRight: 6,
        marginBottom: 6,
        backgroundColor: colors.grey[200],
    },
});

export default ChatWithAdminScreen; 