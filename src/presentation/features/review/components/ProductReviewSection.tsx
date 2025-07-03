import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Alert,
  Modal,
  Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'src/presentation/store/store';
import CommentItem from './CommentItem';
import StarRating from './StarRating';
import { FontAwesome } from '@expo/vector-icons';
import { colors } from 'theme/colors';
import {
  getProductReviews,
  createReview,
  updateReview,
  deleteReview,
  rateReview
} from '../review.slice';
import { ReviewQueryType } from 'src/presentation/dto/req/rating.req.dto';
import { RatingResDto, RatingItemResDto } from 'src/presentation/dto/res/rating.respond.dto';

const TABS = [
  { key: 'popular', label: 'Phổ biến' },
  { key: 'latest', label: 'Mới nhất' },
  { key: 'my', label: 'Của tôi' },
];

interface ProductReviewSectionProps {
  productId: string;
  showProductInfo?: boolean;
}

const ProductReviewSection: React.FC<ProductReviewSectionProps> = ({ productId, showProductInfo = true }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { res, loading } = useSelector((state: RootState) => state.review);
  const [selectedTab, setSelectedTab] = useState<'popular' | 'latest' | 'my'>('popular');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalRating, setModalRating] = useState(5);
  const [modalComment, setModalComment] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const items: RatingItemResDto[] = res?.items || [];
  const productInfo = res?.product
    ? { name: res.product.name, image: res.product.images && res.product.images[0] }
    : null;
  const isBought = !!res?.isBought;

  const hasMyReview = items.some((item: RatingItemResDto) => item.isMine);

  const handleEdit = (id: string, oldComment: string, oldRating: number) => {
    setEditingId(id);
    setModalRating(oldRating);
    setModalComment(oldComment);
    setModalVisible(true);
  };

  const handleSend = () => {
    if (editingId) {
      dispatch(updateReview({ id: editingId, dto: { rating: modalRating, comment: modalComment } }))
        .then(() => {
          setModalVisible(false);
          setModalComment('');
          setModalRating(5);
          setEditingId(null);
          let type: ReviewQueryType = ReviewQueryType.POPULAR;
          if (selectedTab === 'latest') type = ReviewQueryType.LATEST;
          if (selectedTab === 'my') type = ReviewQueryType.MY;
          dispatch(getProductReviews({ productId, type }));
        });
    } else {
      dispatch(createReview({ dto: { rating: modalRating, comment: modalComment, productId } }))
        .then(() => {
          setModalVisible(false);
          setModalComment('');
          setModalRating(5);
          let type: ReviewQueryType = ReviewQueryType.POPULAR;
          if (selectedTab === 'latest') type = ReviewQueryType.LATEST;
          if (selectedTab === 'my') type = ReviewQueryType.MY;
          dispatch(getProductReviews({ productId, type }));
        });
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa đánh giá này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa', style: 'destructive', onPress: () => {
          dispatch(deleteReview(id)).then(() => {
            let type: ReviewQueryType = ReviewQueryType.POPULAR;
            if (selectedTab === 'latest') type = ReviewQueryType.LATEST;
            if (selectedTab === 'my') type = ReviewQueryType.MY;
            dispatch(getProductReviews({ productId, type }));
          });
        }
      }
    ]);
  };

  const renderItem = ({ item }: { item: RatingItemResDto }) => (
    <CommentItem
      id={item._id}
      comment={item.comment || ''}
      date={new Date(item.createdAt).toLocaleDateString()}
      name={item.user_id.name}
      userAvatar={item.user_id.avatar}
      rating={item.rating}
      isLiked={item.isLiked}
      isDisliked={item.isDisliked}
      likeCount={item.likeList.length}
      dislikeCount={item.disLikeList.length}
      onOptionsPress={item.isMine ? () => {
        Alert.alert('Tùy chọn', '', [
          { text: 'Sửa', onPress: () => handleEdit(item._id, item.comment || '', item.rating) },
          { text: 'Xóa', style: 'destructive', onPress: () => handleDelete(item._id) },
          { text: 'Đóng', style: 'cancel' },
        ]);
      } : undefined}
      onLike={() => dispatch(rateReview({ ratingId: item._id, action: 'LIKE' }))}
      onDislike={() => dispatch(rateReview({ ratingId: item._id, action: 'DISLIKE' }))}
    />
  );

  // Tính tổng rating
  const averageRating = items.length ? items.reduce((sum: number, r: RatingItemResDto) => sum + r.rating, 0) / items.length : 0;



  useEffect(() => {
    let type: ReviewQueryType = ReviewQueryType.POPULAR;
    if (selectedTab === 'latest') type = ReviewQueryType.LATEST;
    if (selectedTab === 'my') type = ReviewQueryType.MY;
    dispatch(getProductReviews({ productId, type }));
    console.log(isBought);
    
  }, [dispatch, selectedTab, productId]);

  return (
    <View style={styles.container}>
      {/* Hiển thị ảnh và tên sản phẩm nếu showProductInfo */}
      {showProductInfo && productInfo && (
        <View style={{ alignItems: 'center', marginBottom: 16 }}>
          {productInfo.image ? (
            <Image
              source={{ uri: productInfo.image }}
              style={{ width: 120, height: 120, borderRadius: 16, marginBottom: 8 }}
              resizeMode="cover"
            />
          ) : null}
          <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{productInfo.name}</Text>
        </View>
      )}
      {/* Thanh nhập comment chỉ hiện nếu đã mua và chưa có review của mình */}
      {isBought && !hasMyReview && (
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.writeReviewContainer}>
          <Image
            source={require('assets/icons/girl.png')}
            style={styles.avatar}
          />
          <TextInput
            style={styles.input}
            placeholder="Thêm đánh giá..."
            placeholderTextColor="#aaa"
            editable={false}
          />
          <View style={{ marginLeft: 8 }}>
            <Text style={{ color: '#FFAF42', fontWeight: 'bold' }}>Đánh giá</Text>
          </View>
        </TouchableOpacity>
      )}
      {/* Tổng rating */}
      <View style={{ alignItems: 'center', marginVertical: 16 }}>
        <StarRating rating={averageRating} size={28} />
        <Text style={{ fontSize: 28, fontWeight: 'bold', marginTop: 4 }}>{averageRating.toFixed(1)}</Text>
        <Text style={{ color: '#888' }}>{items.length} đánh giá</Text>
      </View>
      {/* Tabs */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12 }}>
        {TABS.map(tab => (
          <TouchableOpacity key={tab.key} onPress={() => setSelectedTab(tab.key as any)}>
            <Text style={{
              color: selectedTab === tab.key ? '#1976D2' : '#888',
              fontWeight: selectedTab === tab.key ? 'bold' : 'normal',
              borderBottomWidth: selectedTab === tab.key ? 2 : 0,
              borderBottomColor: '#1976D2',
              paddingBottom: 4,
              marginHorizontal: 8
            }}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Danh sách review */}
      {loading ? (
        <ActivityIndicator style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          scrollEnabled={false}
          data={items}
          keyExtractor={item => item._id + Math.random()}
          renderItem={renderItem}
          style={{ flex: 1, marginBottom: 60 }}
        />
      )}
      {/* Modal viết/sửa đánh giá */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 24, width: '85%' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>{editingId ? 'Sửa đánh giá' : 'Viết đánh giá'}</Text>
            <Text style={{ marginBottom: 8 }}>Số sao của bạn:</Text>
            <View style={{ flexDirection: 'row', marginBottom: 16 }}>
              {[1, 2, 3, 4, 5].map(star => (
                <TouchableOpacity key={star} onPress={() => setModalRating(star)}>
                  <FontAwesome
                    name={modalRating >= star ? 'star' : 'star-o'}
                    size={32}
                    color={modalRating >= star ? '#FFA726' : '#ccc'}
                    style={{ marginHorizontal: 2 }}
                  />
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, minHeight: 60, marginBottom: 16 }}
              placeholder="Thêm đánh giá..."
              value={modalComment}
              onChangeText={setModalComment}
              multiline
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 12 }}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={{ color: '#888', fontWeight: 'bold', fontSize: 16, paddingVertical: 10 }}>Huỷ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSend}
                style={{ backgroundColor: colors.app.primary.main, borderRadius: 8, paddingVertical: 10, paddingHorizontal: 24, marginLeft: 8 }}
                disabled={!modalComment.trim()}
              >
                <Text style={{ color: colors.black, fontWeight: 'bold', fontSize: 16 }}>{editingId ? 'Cập nhật' : 'Gửi'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
  },
  writeReviewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f1f1',
    borderRadius: 20,
    padding: 10,
    marginBottom: 16,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },
});

export default ProductReviewSection; 