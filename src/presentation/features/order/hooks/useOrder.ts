import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from 'src/presentation/store/store';
import { PaymentType } from 'src/presentation/dto/res/order-respond.dto';
import { 
  setPaymentType, 
  caculateOrder, 
  resetOrder, 
  setShippingAddressId, 
  createOrder, 
  setOrderItems,
  payOrderWithZalopay,
  checkOrder
} from '../order.slice';
import { getMyAddresses } from '../../address/address.slice';
import { removeFromCart } from '../../cart/cart.slice';
import { useToast } from 'src/presentation/shared/components/CustomToast';
import { useMainNavigation } from 'shared/hooks/navigation-hooks/useMainNavigationHooks';
import { OrderReqItem } from 'src/presentation/dto/req/order.req.dto';
import showToast from 'shared/utils/toast';


export const useOrder = () => {
  const navigation = useMainNavigation();
  const dispatch = useDispatch<AppDispatch>();
  const toast = useToast();
  const [paymentGroup, setPaymentGroup] = useState<'cod' | 'online'>('cod');

  const { items, selectedIds } = useSelector((state: RootState) => state.cart);
  const { myAddresses } = useSelector((state: RootState) => state.newAddress);
  const { 
    orderCheckoutData, 
    order, 
    orderItems, 
    paymentType, 
    shippingAddressId, 
    totalClientPrice, 
    createOrderStatus,
    paymentStatus,

  } = useSelector((state: RootState) => state.order);

  // Sắp xếp địa chỉ: mặc định lên đầu, sau đó là mới nhất
  const sortedAddresses = [...myAddresses].sort((a, b) => {
    if (a.isDefault && !b.isDefault) return -1;
    if (!a.isDefault && b.isDefault) return 1;
    return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
  });

  const selectedAddress = myAddresses.find(addr => addr._id === shippingAddressId) || sortedAddresses[0];

  const getSelectedProductsReq = (): OrderReqItem[] =>
    items
      .filter((item) => selectedIds.includes(item._id))
      .map((item) => ({
        variantId: item.productVariantId,
        quantity: item.quantity
      }));

  useEffect(() => {
    dispatch(caculateOrder({ orderItems: getSelectedProductsReq() }));
    dispatch(setOrderItems(getSelectedProductsReq()));
    dispatch(getMyAddresses());
    
    return () => {
      dispatch(resetOrder());
    };
  }, []);

  useEffect(() => {
    if (sortedAddresses && sortedAddresses.length > 0 && !shippingAddressId) {
      handleSelectAddress(sortedAddresses[0]._id);
    }
  }, [sortedAddresses]);

  useEffect(() => {
    if (paymentGroup === 'cod') {
      dispatch(setPaymentType(PaymentType.COD));
    } else {
      if (paymentType === PaymentType.COD) {
        dispatch(setPaymentType(PaymentType.ZALOPAY));
      }
    }
  }, [paymentGroup]);

  useEffect(() => {
    if (createOrderStatus === 'success') {
      if (paymentType === PaymentType.ZALOPAY) {
        payOrderWithZalopay(orderCheckoutData!.payment!.gateway_code);
        navigation.navigate('PendingScreen');
      }
      else if (paymentType === PaymentType.COD) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainScreen' }],
        });
        toast.show(
          'success',
          'Đặt hàng thành công!',
          `Đã thanh toán ${totalClientPrice || 0}`
        );
      }

      selectedIds.forEach(id => {
        dispatch(removeFromCart(id));
      });
    }
  }, [createOrderStatus, totalClientPrice]);

  const handleSelectAddress = (id: string) => {
    dispatch(setShippingAddressId(id));
  };

  const handleSelectMethod = (type: PaymentType) => {
    dispatch(setPaymentType(type));
    if (type === PaymentType.COD) setPaymentGroup('cod');
    else setPaymentGroup('online');
  };

  const handlePay = () => {
    if (paymentType === PaymentType.MOMO || paymentType === PaymentType.VNPAY) {
      showToast.info("Chức năng chưa được phát triển")
      return;
    }
    
    if (!orderItems || !paymentType || !shippingAddressId || !order) return;
    
    dispatch(createOrder({
      orderItems: orderItems,
      paymentType: paymentType,
      shippingAddressId: shippingAddressId,
      totalClientPrice: order?.productTotal,
      cartIds:selectedIds
    }));
  };
  
  const checkPaymentStatus=()=>{
    if(!orderCheckoutData||!orderCheckoutData.payment) return
    dispatch(checkOrder(orderCheckoutData?.payment?._id))
  }
  

  return {
    order,
    paymentGroup,
    setPaymentGroup,
    paymentType,
    shippingAddressId,
    selectedAddress,
    sortedAddresses,
    createOrderStatus,
    handleSelectAddress,
    handleSelectMethod,
    handlePay,
    checkPaymentStatus,
    paymentStatus,
    resetOrder
  };
}; 