import { ProfileSummary } from '@recapanytime/shared';

export type NormalizedWatchItem = {
  date: Date;
  link: string;
};

export type NormalizedLikeItem = {
  date: Date;
  link: string;
};

export type NormalizedCommentItem = {
  date: Date;
  comment: string;
  photo?: string;
  video?: string;
  url?: string;
};

export type NormalizedShareItem = {
  date: Date;
  sharedContent: string;
  link: string;
  method: string;
};

export type NormalizedSearchItem = {
  date: Date;
  searchTerm: string;
};

export type NormalizedRepostItem = {
  date: Date;
  link: string;
};

export type NormalizedPostItem = {
  date: Date;
  link: string;
  likes: number;
  whoCanView: string;
  allowComments: boolean;
  allowStitches: boolean;
  allowDuets: boolean;
  allowStickers: boolean;
  allowSharingToStory: boolean;
  contentDisclosure: string;
};

export type NormalizedLiveItem = {
  // Go live
  isHost: boolean;
  startTime: Date | null;
  endTime: Date | null;
  roomId?: string;
  totalEarning?: number;
  totalLike?: number;
  totalView?: number;
  roomTitle?: string;
  // Watched live
  watchedRoomId?: string;
  watchedRoomAnchor?: string;
  watchTimeMinutes?: number;
};

export type NormalizedShopItem = {
  date: Date | null;
  orderId?: string;
  productName?: string;
  shopName?: string;
  priceVnd?: number | null;
  status?: string; // Completed, Returned, Refunded, etc.
  itemCount?: number;
};

export type NormalizedSpendingItem = {
  type: 'coin_recharge' | 'gift_sent' | 'gift_bought';
  date: Date | null;
  coinAmount: number | null;
  vndAmount?: number | null;
  giftName?: string;
  recipient?: string;
};

export type ParserWarning = {
  code: string;
  message: string;
  path?: string;
};

export type ParsedTikTokExport = {
  profile: ProfileSummary;
  watchItems: NormalizedWatchItem[];
  likeItems: NormalizedLikeItem[];
  commentItems: NormalizedCommentItem[];
  shareItems: NormalizedShareItem[];
  searchItems: NormalizedSearchItem[];
  repostItems: NormalizedRepostItem[];
  postItems: NormalizedPostItem[];
  liveItems: NormalizedLiveItem[];
  shopItems: NormalizedShopItem[];
  spendingItems: NormalizedSpendingItem[];
  productBrowsingCount: number;
  warnings: ParserWarning[];
};
export type RawOrderHistory = {
  OrderHistory?: Array<{
    OrderHistories?: Array<{
      Date?: string;
      OrderId?: string;
      OrderStatus?: string;
      ProductList?: Array<{
        ProductName?: string;
        Price?: string;
        Quantity?: string | number;
        ShopName?: string;
      }>;
    }>;
  }>;
};
