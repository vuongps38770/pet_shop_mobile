import React from "react";
import { Text, StyleSheet, View } from "react-native";
import { colors } from "shared/theme/colors";

type FormatProductProps={
    item:{
        minPromotionalPrice:number,
        minSellingPrice:number,
        maxPromotionalPrice:number,
        maxSellingPrice:number
    }
}
export const FormatProduct:React.FC<FormatProductProps>=({item})=> {
    const formatCurrency = (value: number) => value.toLocaleString('vi-VN') + '₫';

    let priceText
    const hasPromotion = item.minPromotionalPrice > 0 && item.minPromotionalPrice < item.minSellingPrice;

    const isSinglePrice = item.minSellingPrice === item.maxSellingPrice;

    const isPromotionSinglePrice = item.minPromotionalPrice === item.maxPromotionalPrice;
    if (isSinglePrice) {
        if (!hasPromotion) {
            priceText = (
                <Text style={styles.normalPrice}>{formatCurrency(item.minSellingPrice)}</Text>
            );
        } else {
            priceText = (
                <View>
                    <Text style={styles.originalPrice}>
                        {formatCurrency(item.minSellingPrice)}
                    </Text>
                    <Text style={styles.promotionalPrice}>
                        {formatCurrency(item.minPromotionalPrice)}
                    </Text>
                </View>
            );
        }
    } else {
        if (!hasPromotion) {
            priceText = (
                <Text style={styles.normalPrice}>
                    {`${formatCurrency(item.minSellingPrice)} - ${formatCurrency(item.maxSellingPrice)}`}
                </Text>
            );
        } else {
            priceText = (
                <View>
                    <Text style={styles.originalPrice}>
                        {`${formatCurrency(item.minSellingPrice)} - ${formatCurrency(item.maxSellingPrice)}`}
                    </Text>
                    <Text style={styles.promotionalPrice}>
                        {`${formatCurrency(item.minPromotionalPrice)} - ${formatCurrency(item.maxPromotionalPrice)}`}
                    </Text>
                </View>
            );
        }
    }
    return priceText
}

const styles = StyleSheet.create({
    originalPrice: {
        textDecorationLine: 'line-through',
        color: colors.grey[500],
        fontSize: 10,
    },
    promotionalPrice: {
        color: colors.app.primary.main,
        fontWeight: '600',
        fontSize: 12,
    },
    normalPrice: {
        color: colors.text.primary,
        fontWeight: '600',
        fontSize: 12,
    }
});