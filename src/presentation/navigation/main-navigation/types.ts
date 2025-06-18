import { FilterOptions } from "src/presentation/dto/req/filter-option.req.dto";

export type MainStackParamList = {
  MainScreen: undefined
  Check: undefined;
  Setting: undefined;
  Profile: undefined;
  User: undefined;
  Addresses: undefined;
  ProductDetail: { productId?: string };
  CheckoutScreen: undefined;
  Notification: undefined;
  CartScreen: undefined;
  FavouriteScreen:undefined;
  AllCategoriesScreen:undefined,
  ProductShow: { filter: FilterOptions, title: string },
  NewAddressScreen: undefined,
  ScreenReviews: undefined;
  AddressPickScreen:undefined
  AllAddressesScreen: undefined
  OrderScreen: undefined;
  PendingScreen: undefined;

};