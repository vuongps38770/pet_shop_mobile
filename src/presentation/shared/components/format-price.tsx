import React from "react";
import { Text, StyleSheet, View } from "react-native";
import { colors } from "shared/theme/colors";

type FormatProductProps = {
    item: {
        minPromotionalPrice: number,
        minSellingPrice: number,
        maxPromotionalPrice: number,
        maxSellingPrice: number,

    }
    originalPriceFontSize?: number,
    promotionalPriceFontSize?: number,
    normalPriceFontSize?: number,
}
export const FormatProduct: React.FC<FormatProductProps> = ({ item, normalPriceFontSize = 12, originalPriceFontSize = 10, promotionalPriceFontSize = 12 }) => {
    const formatCurrency = (value: number) => value.toLocaleString('vi-VN') + '₫';

    let priceText
    const hasPromotion = item.minPromotionalPrice > 0 && item.minPromotionalPrice < item.minSellingPrice;

    const isSinglePrice = item.minSellingPrice === item.maxSellingPrice;

    const isPromotionSinglePrice = item.minPromotionalPrice === item.maxPromotionalPrice;
    if (isSinglePrice) {
        if (!hasPromotion) {
            priceText = (
                <Text style={[styles.normalPrice, { fontSize: normalPriceFontSize }]}>
                    {formatCurrency(item.minSellingPrice)}
                </Text>
            );
        } else {
            priceText = (
                <View>
                    <Text style={[styles.originalPrice, { fontSize: originalPriceFontSize }]}>
                        {formatCurrency(item.minSellingPrice)}
                    </Text>
                    <Text style={[styles.promotionalPrice, { fontSize: promotionalPriceFontSize }]}>
                        {formatCurrency(item.minPromotionalPrice)}
                    </Text>
                </View>
            );
        }
    } else {
        if (!hasPromotion) {
            priceText = (
                <Text style={[styles.normalPrice, { fontSize: normalPriceFontSize }]}>
                    {`${formatCurrency(item.minSellingPrice)} - ${formatCurrency(item.maxSellingPrice)}`}
                </Text>
            );
        } else {
            priceText = (
                <View>
                    <Text style={[styles.originalPrice, { fontSize: originalPriceFontSize }]}>
                        {`${formatCurrency(item.minSellingPrice)} - ${formatCurrency(item.maxSellingPrice)}`}
                    </Text>
                    <Text style={[styles.promotionalPrice, { fontSize: promotionalPriceFontSize }]}>
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
    },
    promotionalPrice: {
        color: colors.app.primary.main,
        fontWeight: '600',
    },
    normalPrice: {
        color: colors.text.primary,
        fontWeight: '600',
    }
});