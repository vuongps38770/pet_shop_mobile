import { FilterOptions } from "src/presentation/dto/req/filter-option.req.dto";
import { MainBottomTabParamList } from "./bottom-tabs-navigators/types";
import { OrderReqItem } from "src/presentation/dto/req/order.req.dto";
import { BlogRespondDto } from "src/presentation/dto/res/blog-respond.dto";
import { PostResDto } from "src/presentation/dto/res/post.res.dto";

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
  OrderScreen: {reOrderItems: OrderReqItem[]} | undefined;
  PendingScreen: undefined;
  OrderDetail: undefined;
  VoucherScreen: undefined;
  MyVoucherScreen: undefined;
  PickVoucherScreen: { total: number };
  ExploreScreen:undefined,
  ChatWithAdmin: undefined
  ChatList: undefined,
  AllDetails:{orderId?:string},
  AddEmailScreen:undefined,
  VerifyOtpAddEmailScreen:{email:string},
  PickOrderScreen:undefined,
  PostDetailScreen:{postId:string,post?:PostResDto},
  MyPostScreen:undefined,
  PostScreen:undefined,
  CreatePostScreen:undefined,
  NewsScreen: { blog: BlogRespondDto }
};