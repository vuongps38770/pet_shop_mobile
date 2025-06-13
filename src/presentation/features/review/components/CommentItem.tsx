import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

export interface CommentItemProps {
  id: string;
  userAvatar: string;
  name: string;
  date: string;
  rating: number;
  comment: string;
  onOptionsPress?: (id: string) => void; // callback cho nút 3 chấm
}

const CommentItem: React.FC<CommentItemProps> = ({
  id,
  userAvatar,
  name,
  date,
  rating,
  comment,
  onOptionsPress,
}) => {
  return (
    <View style={styles.container}>
      {/* Avatar + Name + Date + Menu */}
      <View style={styles.header}>
        <Image source={{ uri: userAvatar }} style={styles.avatar} />

        <View style={styles.userInfo}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>

        <TouchableOpacity onPress={() => onOptionsPress?.(id)} style={styles.optionsBtn}>
          <Ionicons name="ellipsis-vertical" size={18} color="#ccc" />
        </TouchableOpacity>
      </View>

      {/* Rating */}
      <View style={styles.ratingRow}>
        <FontAwesome name="star" size={14} color="#f5a623" />
        <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
      </View>

      {/* Comment */}
      <Text style={styles.comment}>{comment}</Text>
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
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#eee',
  },
  userInfo: {
    flex: 1,
    marginLeft: 10,
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
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  ratingText: {
    fontWeight: 'bold',
    marginLeft: 4,
    fontSize: 13,
    color: '#000',
  },
  comment: {
    marginTop: 8,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});
