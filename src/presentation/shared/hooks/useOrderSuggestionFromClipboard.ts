import { useEffect, useState } from 'react';
import { Clipboard } from 'react-native';
import axios from 'axios';
import axiosInstance from 'app/config/axios';

export interface OrderSuggestionDto {
  _id: string;
  id: string;
  sku: string;
  orderDetailIds: string[];
  paymentType: string;
  shippingAddress: {
    refId: string;
    province: string;
    district: string;
    ward: string;
    streetAndNumber: string;
    lat: number;
    lng: number;
    receiverFullname: string;
  };
  productPrice: number;
  totalPrice: number;
  status: string;
}

export const useOrderSuggestionFromClipboard = () => {
  const [orderData, setOrderData] = useState<OrderSuggestionDto | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkClipboard = async () => {
      try {
        const content = await Clipboard.getString();
        if (content?.startsWith('DH:')) {
          const sku = content.replace('DH:', '').trim();
          setLoading(true);
          console.log(sku);
          
          const res = await axiosInstance.get(`/order/order-suggest/${sku}`)
          if (res.data) {
            console.log(res.data.data);
            
            setOrderData(res.data.data as OrderSuggestionDto);
          } else {
            setOrderData(null);
          }
        } else {
          setOrderData(null);
        }
      } catch (error) {
        console.error('Error checking clipboard:', error);
        setOrderData(null);
      } finally {
        setLoading(false);
      }
    };

    checkClipboard();

    const interval = setInterval(checkClipboard, 5000);

    return () => clearInterval(interval);
  }, []);

  return { orderData, loading };
};
