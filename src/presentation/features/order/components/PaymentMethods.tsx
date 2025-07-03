import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { colors } from 'shared/theme/colors';
import { PaymentType } from 'src/presentation/dto/res/order-respond.dto';
import { PAYMENT_METHODS } from '../constants/payment.constants';
import { PaymentCard } from './PaymentCard';

interface PaymentMethodsProps {
  paymentGroup: 'cod' | 'online';
  setPaymentGroup: (group: 'cod' | 'online') => void;
  paymentType: PaymentType | undefined;
  onSelectMethod: (type: PaymentType) => void;
}

export const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  paymentGroup,
  setPaymentGroup,
  paymentType = PaymentType.COD,
  onSelectMethod,
}) => {
  return (
    <>
      <Text style={styles.title}>Phương thức thanh toán</Text>
      <View style={styles.paymentGroupContainer}>
        <TouchableOpacity
          style={[styles.paymentGroupBtn, paymentGroup === 'cod' && styles.paymentGroupBtnActive]}
          onPress={() => setPaymentGroup('cod')}
        >
          <Text style={[styles.paymentGroupText, paymentGroup === 'cod' && styles.paymentGroupTextActive]}>
            Trả khi nhận hàng
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.paymentGroupBtn, paymentGroup === 'online' && styles.paymentGroupBtnActive]}
          onPress={() => setPaymentGroup('online')}
        >
          <Text style={[styles.paymentGroupText, paymentGroup === 'online' && styles.paymentGroupTextActive]}>
            Thanh toán online
          </Text>
        </TouchableOpacity>
      </View>
      
      {paymentGroup === 'cod' ? (
        <View style={styles.codBox}>
          <RadioButton
            value={PaymentType.COD}
            status={paymentType === PaymentType.COD ? "checked" : "unchecked"}
            onPress={() => onSelectMethod(PaymentType.COD)}
            color={colors.app.primary.main}
            uncheckedColor="#000"
          />
          <Text style={{ fontWeight: 'bold', marginLeft: 8 }}>Trả khi nhận hàng (COD)</Text>
        </View>
      ) : (
        <View>
          {PAYMENT_METHODS.map(({ type, title, icon }) => (
            <PaymentCard
              key={type}
              value={type}
              title={title}
              selected={paymentType === type}
              onSelect={() => onSelectMethod(type)}
              icon={icon}
            />
          ))}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginVertical: 12,
  },
  paymentGroupContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    marginTop: 8,
    gap: 8,
  },
  paymentGroupBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  paymentGroupBtnActive: {
    borderColor: colors.app.primary.main,
    backgroundColor: '#FFF8E1',
  },
  paymentGroupText: {
    color: '#333',
    fontWeight: 'bold',
    fontSize: 15,
  },
  paymentGroupTextActive: {
    color: colors.app.primary.main,
  },
  codBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 8,
  },
}); 