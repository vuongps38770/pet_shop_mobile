import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import StarRating from './StarRating';

export interface CommentItemProps {
  id: string;
  name: string;
  userAvatar?: string;
  date: string;
  rating: number;
  comment: string;
  isLiked?: boolean;
  isDisliked?: boolean;
  likeCount?: number;
  dislikeCount?: number;
  onOptionsPress?: (id: string) => void;
  onLike?: (id: string) => void;
  onDislike?: (id: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  id,
  name,
  userAvatar,
  date,
  rating,
  comment,
  isLiked,
  isDisliked,
  likeCount = 0,
  dislikeCount = 0,
  onOptionsPress,
  onLike,
  onDislike,
}) => {
  return (
    <View style={styles.container}>
      {/* Header: Avatar, Name, Date, Options */}
      <View style={styles.header}>
        <Image
          source={userAvatar ? { uri: userAvatar } : require('assets/icons/user.png')}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
        {onOptionsPress && (
          <TouchableOpacity onPress={() => onOptionsPress(id)} style={styles.optionsBtn}>
            <Ionicons name="ellipsis-vertical" size={18} color="#ccc" />
          </TouchableOpacity>
        )}
      </View>
      {/* Rating */}
      <StarRating rating={rating} size={16} style={{ marginTop: 2, marginBottom: 2 }} />
      {/* Comment */}
      <Text style={styles.comment}>{comment}</Text>
      {/* Helpful/Not helpful */}
      <View style={styles.helpfulRow}>
        <TouchableOpacity style={styles.helpfulBtn} onPress={() => onLike?.(id)}>
          <Ionicons name="thumbs-up-outline" size={18} color={isLiked ? '#1976D2' : '#888'} />
          <Text style={[styles.helpfulText, isLiked && { color: '#1976D2' }]}>Hữu ích ({likeCount})</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.helpfulBtn} onPress={() => onDislike?.(id)}>
          <Ionicons name="thumbs-down-outline" size={18} color={isDisliked ? '#E53935' : '#888'} />
          <Text style={[styles.helpfulText, isDisliked && { color: '#E53935' }]}>Không hữu ích ({dislikeCount})</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CommentItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#eee',
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#000',
  },
  date: {
    fontSize: 13,
    color: '#999',
    marginTop: 2,
  },
  optionsBtn: {
    padding: 4,
  },
  comment: {
    marginTop: 8,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  helpfulRow: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 16,
  },
  helpfulBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  helpfulText: {
    color: '#888',
    fontSize: 13,
    marginLeft: 2,
  },
});
