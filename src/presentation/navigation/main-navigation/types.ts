import { FilterOptions } from "src/presentation/dto/req/filter-option.req.dto";
import { MainBottomTabParamList } from "./bottom-tabs-navigators/types";

export type MainStackParamList = {
  MainScreen: undefined|{route:keyof MainBottomTabParamList}
  Check: undefined;
  Setting: undefined;
  Profile: undefined;
  User: undefined;
  ProfileDetail:undefined;
  Addresses: undefined;
  ProductDetail: { productId?: string };
  CheckoutScreen: undefined;
  Notification: undefined;
  CartScreen: undefined;
  FavouriteScreen:undefined;
  AllCategoriesScreen:undefined,
  ProductShow: { filter: FilterOptions, title: string },
  NewAddressScreen: undefined,
  ScreenReviews: {productId:string};
  AddressPickScreen:undefined
  AllAddressesScreen: undefined
  OrderScreen: undefined;
  PendingScreen: undefined;
  OrderDetail: undefined;
};