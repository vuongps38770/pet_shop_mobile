import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface StarRatingProps {
  rating: number;
  size?: number;
  style?: any;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, size = 20, style }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <View style={[{ flexDirection: 'row' }, style]}>
      {[...Array(fullStars)].map((_, i) => (
        <FontAwesome key={`full-${i}`} name="star" size={size} color="#FFA726" />
      ))}
      {hasHalfStar && <FontAwesome name="star-half-full" size={size} color="#FFA726" />}
      {[...Array(emptyStars)].map((_, i) => (
        <FontAwesome key={`empty-${i}`} name="star-o" size={size} color="#FFA726" />
      ))}
    </View>
  );
};

export default StarRating; 