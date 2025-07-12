import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageSourcePropType, ActivityIndicator } from "react-native";
import { assets } from "../../../shared/theme/assets";
import { DiscountType, VoucherApplyType, VoucherRespondDto } from "src/presentation/dto/res/voucher-respond";
import { PriceFormatter } from "app/utils/priceFormatter";
import { LogBox } from 'react-native';
import { colors } from '../../../shared/theme/colors';

// Map icon cho từng loại buttonType
const getButtonIcon = (buttonType: ButtonType, assets: any) => {
  switch (buttonType) {
    case ButtonType.ADD_TO_CART:
      return assets.icons.voucher.redeem;
    case ButtonType.ADDED:
      return assets.icons.voucher.redeem;
    case ButtonType.USE:
      return assets.icons.voucher.redeem;
    case ButtonType.USED:
      return assets.icons.voucher.tick;
    case ButtonType.EXPIRED:
      return assets.icons.voucher.hourglass;
    default:
      return undefined;
  }
};


LogBox.ignoreLogs([
  'VirtualizedLists should never be nested', 
  'Encountered two children with the same key',
]);
interface VoucherCardProps {
  onPress: () => void;
  voucher: VoucherRespondDto,
  actionLabel: string
  actionTextColor?: string
  isLoading?: boolean
  buttonType: ButtonType
  showUsageBar?: boolean;
}

// Định nghĩa enum cho loại nút
export enum ButtonType {
  NONE = 1,
  ADD_TO_CART = 2,
  ADDED = 3,
  USE = 4,
  USED = 5,
  EXPIRED = 6, // Thêm loại hết hạn
}

export const VoucherCard: React.FC<VoucherCardProps> = ({
  voucher,
  onPress,
  actionLabel,
  actionTextColor,
  isLoading = false,
  buttonType,
  showUsageBar = true,
}) => {

  const getVoucherTitle = (voucher: VoucherRespondDto) => {
    if (voucher.discount_type == DiscountType.FIXED) {
      return `Giảm ${PriceFormatter.formatPrice(voucher.discount_value)}`
    } else if (voucher.discount_type == DiscountType.PERCENT) {
      return `Giảm ${voucher.discount_value}%`
    } else return 'zzzzzzzzzz'
  }

  const getVoucherCondition = (voucher: VoucherRespondDto) => {
    let condition = '';
    if (voucher.max_discount) {
      condition = `Đơn từ ${PriceFormatter.formatPrice(voucher.min_order_value)}, tối đa ${PriceFormatter.formatPrice(voucher.max_discount)}`;
    } else {
      condition = `Đơn từ ${PriceFormatter.formatPrice(voucher.min_order_value)}`;
    }
    if (voucher.max_use_per_user && voucher.max_use_per_user == 1) {
      condition += ' (voucher dùng 1 lần)';
    }
    return condition;
  }
  const getSubCondition = (voucher: VoucherRespondDto) => {
    if (voucher.product_ids && voucher.product_ids.length > 0) {
      return 'Áp dụng cho 1 số loại sản phẩm'
    } else {
      return 'Áp dụng cho tất cả đơn hàng'
    }
  }
  const getActionLabel =()=>{
    if(voucher.used_at) return "Đã sử dụng"
    if(new Date(voucher.end_date.toISOString())<new Date()) return "hết hạn"
    if(voucher.is_collected) return "Đã thu thập"
    if(voucher.is_collected == false) return "thu thập"
    if(voucher.end_date>=new Date()) return "Sử dụng"
    
  }
  // Hàm render nút theo loại
  const renderButton = () => {
    const icon = getButtonIcon(buttonType, assets);
    switch (buttonType) {
      case ButtonType.NONE:
        return null;
      case ButtonType.ADD_TO_CART:
        return (
          <TouchableOpacity onPress={onPress} style={styles.useBtn} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator size="small" color={actionTextColor ?? "#FFA63D"} />
            ) : (
              <>
                {icon && (
                  <Image
                    source={icon}
                    style={{ width: 16, height: 16, marginRight: 6, tintColor: actionTextColor ?? "#FFA63D" }}
                  />
                )}
                <Text style={[styles.useText, { color: actionTextColor || "#FFA63D" }]}>Lưu voucher</Text>
              </>
            )}
          </TouchableOpacity>
        );
      case ButtonType.ADDED:
        return (
          <View style={[styles.useBtn, { backgroundColor: '#eee' }]}> 
            {icon && (
              <Image
                source={icon}
                style={{ width: 16, height: 16, marginRight: 6, tintColor: '#aaa' }}
              />
            )}
            <Text style={[styles.useText, { color: '#aaa' }]}>Đã thêm</Text>
          </View>
        );
      case ButtonType.USE:
        return (
          <TouchableOpacity onPress={onPress} style={styles.useBtn} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator size="small" color={actionTextColor ?? "#FFA63D"} />
            ) : (
              <>
                {icon && (
                  <Image
                    source={icon}
                    style={{ width: 16, height: 16, marginRight: 6, tintColor: actionTextColor ?? "#FFA63D" }}
                  />
                )}
                <Text style={[styles.useText, { color: actionTextColor || "#FFA63D" }]}>Sử dụng</Text>
              </>
            )}
          </TouchableOpacity>
        );
      case ButtonType.USED:
        return (
          <View style={[styles.useBtn, { backgroundColor: '#eee' }]}> 
            {icon && (
              <Image
                source={icon}
                style={{ width: 16, height: 16, marginRight: 6, tintColor: '#aaa' }}
              />
            )}
            <Text style={[styles.useText, { color: '#aaa' }]}>Đã sử dụng</Text>
          </View>
        );
      case ButtonType.EXPIRED:
        return (
          <View style={[styles.useBtn, { backgroundColor: '#eee' }]}> 
            {icon && (
              <Image
                source={icon}
                style={{ width: 16, height: 16, marginRight: 6, tintColor: '#aaa' }}
              />
            )}
            <Text style={[styles.useText, { color: '#aaa' }]}>Hết hạn</Text>
          </View>
        );
      default:
        return null;
    }
  };
  // Hiển thị thanh tiến trình đã sử dụng
  const renderUsageBar = () => {
    if (!showUsageBar) return null;
    if (typeof voucher.quantity === 'number' && voucher.quantity > 0 && typeof voucher.used === 'number') {
      const percent = Math.min(100, Math.round((voucher.used / voucher.quantity) * 100));
      return (
        <View style={{ marginTop: 8 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2 }}>
            <Text style={{ fontSize: 11, color: '#888' }}>Đã sử dụng {voucher.used}/{voucher.quantity}</Text>
            <Text style={{ fontSize: 11, color: '#888' }}>{percent}%</Text>
          </View>
          <View style={{ height: 6, backgroundColor: '#eee', borderRadius: 3, overflow: 'hidden' }}>
            <View style={{ width: `${percent}%`, height: 6, backgroundColor: '#FFA63D', borderRadius: 3 }} />
          </View>
        </View>
      );
    }
    return null;
  };
  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>{getVoucherTitle(voucher)}</Text>
        <View
          style={[
            styles.typeTag,
            {
              backgroundColor: voucher.apply_type === VoucherApplyType.DELIVERY ? "#C8FACC" : "#D4ECFF",
            },
          ]}
        >
          <Text
            style={{
              color: voucher.apply_type === VoucherApplyType.DELIVERY ? "#06A94D" : "#4B89FF",
              fontWeight: "600",
              fontSize: 12,
            }}
          >
            {voucher.apply_type === VoucherApplyType.DELIVERY ? "Miễn phí vận chuyển" : "Shop"}
          </Text>
        </View>
      </View>

      {/* Discount Box */}
      {/* <View style={styles.discountBox}>
        <Text style={styles.discount}>{discount}</Text>
        <Image
          source={assets.icons.voucher.redeem}
          style={{ width: 24, height: 24, tintColor: "#FFA63D" }}
        />
      </View> */}

      {/* Điều kiện */}
      <Text style={styles.condition}>{getVoucherCondition(voucher)}</Text>
      <Text style={styles.subCondition}>{getSubCondition(voucher)}</Text>

      {renderUsageBar()}
      {/* Footer */}
      <View style={styles.footer}>
        {voucher.start_date && new Date(voucher.start_date).getTime() > Date.now() ? (
          <View style={styles.expiryBox}>
            <Image
              source={assets.icons.voucher.hourglass}
              style={{ width: 16, height: 16, tintColor: '#4B89FF', marginTop: -35 }}
            />
            <Text style={[styles.expiryText, { color: '#4B89FF' }]}>Hiệu lực sau: {new Date(voucher.start_date).toLocaleDateString()}</Text>
          </View>
        ) : (
          <View style={styles.expiryBox}>
            <Image
              source={assets.icons.voucher.calender}
              style={{ width: 16, height: 16, tintColor: "#888", marginTop: -35 }}
            />
            {voucher.used_at ? (
              <Text style={styles.expiryText}> ngày sử dụng: {voucher.used_at ? new Date(voucher.used_at).toLocaleDateString() : ''}</Text>
            ) : (
              <Text style={styles.expiryText}> HSD: {voucher.end_date ? new Date(voucher.end_date).toLocaleDateString() : ''}</Text>
            )}
          </View>
        )}


        <View style={styles.actionColumn}>
          {renderButton()}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: colors.app.primary.lighter,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontWeight: "700",
    fontSize: 18,
    flex: 1,
    marginRight: 8,
    color: colors.text.primary,
  },
  typeTag: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: colors.blue.light,
  },
  condition: {
    color: colors.text.secondary,
    fontSize: 13,
    marginBottom: 2,
    fontWeight: '500',
  },
  subCondition: {
    color: colors.text.secondary,
    fontSize: 13,
    marginBottom: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  expiryBox: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  expiryText: {
    color: colors.text.secondary,
    marginTop: -35,
    fontSize: 13,
    fontWeight: '500',
  },
  statusBox: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  statusText: {
    color: colors.green.main,
    fontSize: 12,
    fontWeight: '600',
  },
  useBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.app.primary.lightest,
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 16,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 2,
    marginTop: 4,
  },
  actionColumn: {
    flexDirection: "column",
    alignItems: "flex-end",
  },
  useText: {
    fontWeight: "bold",
    fontSize: 15,
    color: colors.app.primary.main,
  },
});
