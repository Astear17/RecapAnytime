import { ProfileSummary } from '@recapanytime/shared';
import {
  ParsedTikTokExport,
  NormalizedWatchItem,
  NormalizedLikeItem,
  NormalizedCommentItem,
  NormalizedShareItem,
  NormalizedSearchItem,
  NormalizedRepostItem,
  NormalizedPostItem,
  NormalizedLiveItem,
  NormalizedShopItem,
  NormalizedSpendingItem,
  ParserWarning
} from './schema';
import { getField, parseDate } from './normalize';
import { parseVnd } from './money';

function normalizeKey(value: string): string {
  return value.toLowerCase().replace(/[\s_\-+&/]+/g, '');
}

function readField<T = any>(obj: any, keys: string[]): T | undefined {
  const direct = getField<T>(obj, keys);
  if (direct !== undefined) return direct;

  if (!obj || typeof obj !== 'object') return undefined;

  for (const key of keys) {
    const target = normalizeKey(key);
    const foundKey = Object.keys(obj).find((candidate) => normalizeKey(candidate) === target);

    if (foundKey && obj[foundKey] !== undefined) {
      return obj[foundKey] as T;
    }
  }

  return undefined;
}

function firstNestedArray(value: any, depth = 0): any[] | null {
  if (!value || depth > 2) return null;
  if (Array.isArray(value)) return value;
  if (typeof value !== 'object') return null;

  const values = Object.values(value);

  for (const item of values) {
    if (Array.isArray(item)) return item;
  }

  for (const item of values) {
    if (item && typeof item === 'object') {
      const found = firstNestedArray(item, depth + 1);
      if (found) return found;
    }
  }

  return null;
}

function asArray<T = any>(value: any): T[] {
  if (!value) return [];
  if (Array.isArray(value)) return value as T[];

  if (typeof value === 'object') {
    const numericKeys = Object.keys(value).filter((key) => /^\d+$/.test(key));

    if (numericKeys.length > 0) {
      return numericKeys
        .sort((a, b) => Number(a) - Number(b))
        .map((key) => value[key]) as T[];
    }

    const nested = firstNestedArray(value);
    if (nested) return nested as T[];
  }

  return [];
}

function parseJsonLoose(rawJson: string): any {
  const cleaned = rawJson.replace(/^\uFEFF/, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch (_) {
    const objectStart = cleaned.indexOf('{');
    const arrayStart = cleaned.indexOf('[');

    const possibleStarts = [objectStart, arrayStart].filter((index) => index >= 0);
    const start = possibleStarts.length > 0 ? Math.min(...possibleStarts) : -1;
    const end = Math.max(cleaned.lastIndexOf('}'), cleaned.lastIndexOf(']'));

    if (start >= 0 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1));
    }

    throw new Error('JSON_PARSE_FAILED');
  }
}

function readString(obj: any, keys: string[], fallback = ''): string {
  const value = readField<any>(obj, keys);

  if (value === undefined || value === null) return fallback;
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);

  return fallback;
}

function readNumber(obj: any, keys: string[], fallback = 0): number {
  const value = readField<any>(obj, keys);

  if (typeof value === 'number') return Number.isFinite(value) ? value : fallback;
  if (typeof value === 'string') {
    const parsed = Number(value.replace(/[^\d.-]/g, ''));
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  return fallback;
}

function readBooleanYes(obj: any, keys: string[]): boolean {
  const value = readField<any>(obj, keys);

  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    return normalized === 'yes' || normalized === 'true' || normalized === '1' || normalized === 'enabled';
  }

  if (typeof value === 'number') return value === 1;

  return false;
}

function readDate(obj: any, keys: string[]): Date | null {
  for (const key of keys) {
    const value = readField<any>(obj, [key]);
    const parsed = parseDate(value);

    if (parsed) return parsed;
  }

  return null;
}

function getRootSection(root: any, keys: string[]): any {
  return readField<any>(root, keys) || {};
}

function getNestedSection(root: any, parent: any, keys: string[]): any {
  return readField<any>(parent, keys) || readField<any>(root, keys) || {};
}

const DATE_KEYS = [
  'Date',
  'date',
  'Time',
  'time',
  'Timestamp',
  'timestamp',
  'DateTime',
  'dateTime',
  'CreateTime',
  'createTime',
  'CreatedAt',
  'createdAt'
];

const LINK_KEYS = [
  'Link',
  'link',
  'URL',
  'Url',
  'url',
  'VideoLink',
  'Video Link',
  'VideoUrl',
  'Video URL',
  'ItemLink'
];

export function parseTikTokJson(rawJson: string): ParsedTikTokExport {
  const warnings: ParserWarning[] = [];
  let root: any = {};

  try {
    root = parseJsonLoose(rawJson);
  } catch (_) {
    throw new Error('JSON_PARSE_FAILED');
  }

  const profileSection = getRootSection(root, [
    'Profile And Settings',
    'Profile and Settings',
    'Profile & Settings',
    'ProfileAndSettings',
    'Profile'
  ]);

  const profileInfo =
    readField<any>(profileSection, [
      'Profile Info',
      'ProfileInfo',
      'Profile Information',
      'ProfileInformation'
    ]) || profileSection;

  const profileMap =
    readField<any>(profileInfo, ['ProfileMap', 'profileMap', 'Profile Map']) ||
    profileInfo ||
    {};

  const profile: ProfileSummary = {
    displayName: readField<string>(profileMap, ['displayName', 'DisplayName', 'Display Name']) || null,
    username: readField<string>(profileMap, ['userName', 'username', 'Username', 'User Name']) || null,
    bio: readField<string>(profileMap, ['bioDescription', 'bio', 'Bio', 'Bio Description']) || null,
    followerCount: readNumber(profileMap, ['followerCount', 'FollowerCount', 'Follower Count']),
    followingCount: readNumber(profileMap, ['followingCount', 'FollowingCount', 'Following Count']),
    likesReceived: readNumber(profileMap, ['likesReceived', 'LikesReceived', 'Likes Received']),
    profilePhoto: readField<string>(profileMap, ['profilePhoto', 'ProfilePhoto', 'Profile Photo', 'avatar', 'Avatar']) || null,
    region: readField<string>(profileMap, ['accountRegion', 'AccountRegion', 'Account Region', 'region', 'Region']) || null,
    socialLinks: {
      instagram: readField<string>(profileMap, ['instagramLink', 'InstagramLink', 'Instagram Link']) || null,
      youtube: readField<string>(profileMap, ['youtubeLink', 'YoutubeLink', 'YouTubeLink', 'YouTube Link']) || null,
      lemon8: readField<string>(profileMap, ['lemon8Link', 'Lemon8Link', 'Lemon8 Link']) || null
    }
  };

  const activitySection =
    readField<any>(root, ['Your Activity', 'YourActivity', 'Activity']) || root;

  const watchHistory = getNestedSection(root, activitySection, [
    'Watch History',
    'WatchHistory',
    'Video Browsing History',
    'VideoBrowsingHistory'
  ]);

  const watchList = asArray(
    readField<any>(watchHistory, [
      'VideoList',
      'videoList',
      'Videos',
      'videos',
      'WatchHistoryList',
      'watchHistoryList',
      'ItemList',
      'itemList'
    ]) || watchHistory
  );

  const watchItems: NormalizedWatchItem[] = [];

  for (const item of watchList) {
    const date = readDate(item, DATE_KEYS);
    const link = readString(item, LINK_KEYS);

    if (date) {
      watchItems.push({ date, link });
    }
  }

  const likesSection = getRootSection(root, [
    'Likes and Favorites',
    'Likes And Favorites',
    'LikesAndFavorites',
    'Likes',
    'Favorite'
  ]);

  const likeListObj =
    readField<any>(likesSection, ['Like List', 'LikeList', 'Liked Videos', 'LikedVideos']) ||
    likesSection;

  const likeList = asArray(
    readField<any>(likeListObj, [
      'ItemFavoriteList',
      'itemFavoriteList',
      'LikeList',
      'likeList',
      'VideoList',
      'videoList',
      'FavoriteList',
      'favoriteList'
    ]) || likeListObj
  );

  const likeItems: NormalizedLikeItem[] = [];

  for (const item of likeList) {
    const date = readDate(item, DATE_KEYS);
    const link = readString(item, LINK_KEYS);

    if (date) {
      likeItems.push({ date, link });
    }
  }

  const commentSection = getRootSection(root, [
    'Comment',
    'Comments',
    'Comment History',
    'CommentHistory'
  ]);

  const commentsListObj =
    readField<any>(commentSection, ['Comments', 'CommentsList', 'CommentList']) ||
    commentSection;

  const commentsList = asArray(
    readField<any>(commentsListObj, [
      'CommentsList',
      'commentsList',
      'CommentList',
      'commentList'
    ]) || commentsListObj
  );

  const commentItems: NormalizedCommentItem[] = [];

  for (const item of commentsList) {
    const date = readDate(item, DATE_KEYS);
    const comment = readString(item, ['comment', 'Comment', 'Text', 'text', 'CommentText', 'Comment Text']);

    if (date) {
      commentItems.push({
        date,
        comment,
        photo: readField<string>(item, ['photo', 'Photo']),
        video: readField<string>(item, ['video', 'Video']),
        url: readField<string>(item, ['url', 'URL', 'Url'])
      });
    }
  }

  const shareHistory = getNestedSection(root, activitySection, [
    'Share History',
    'ShareHistory',
    'Shares',
    'Share'
  ]);

  const shareList = asArray(
    readField<any>(shareHistory, [
      'ShareHistoryList',
      'shareHistoryList',
      'ShareList',
      'shareList'
    ]) || shareHistory
  );

  const shareItems: NormalizedShareItem[] = [];

  for (const item of shareList) {
    const date = readDate(item, DATE_KEYS);
    const sharedContent = readString(item, ['SharedContent', 'Shared Content', 'sharedContent']);
    const link = readString(item, LINK_KEYS);
    const method = readString(item, ['Method', 'method', 'ShareMethod', 'Share Method'], 'unknown');

    if (date) {
      shareItems.push({ date, sharedContent, link, method });
    }
  }

  const searchesObj = getNestedSection(root, activitySection, [
    'Searches',
    'Search',
    'Search History',
    'SearchHistory'
  ]);

  const searchList = asArray(
    readField<any>(searchesObj, [
      'SearchList',
      'searchList',
      'SearchHistoryList',
      'searchHistoryList'
    ]) || searchesObj
  );

  const searchItems: NormalizedSearchItem[] = [];

  for (const item of searchList) {
    const date = readDate(item, DATE_KEYS);
    const searchTerm = readString(item, [
      'SearchTerm',
      'Search Term',
      'searchTerm',
      'Keyword',
      'keyword',
      'Query',
      'query',
      'Text',
      'text'
    ]);

    if (date && searchTerm) {
      searchItems.push({ date, searchTerm });
    }
  }

  const repostsObj = getNestedSection(root, activitySection, [
    'Reposts',
    'Repost',
    'Repost History',
    'RepostHistory'
  ]);

  const repostList = asArray(
    readField<any>(repostsObj, [
      'RepostList',
      'repostList',
      'RepostHistoryList',
      'repostHistoryList'
    ]) || repostsObj
  );

  const repostItems: NormalizedRepostItem[] = [];

  for (const item of repostList) {
    const date = readDate(item, DATE_KEYS);
    const link = readString(item, LINK_KEYS);

    if (date) {
      repostItems.push({ date, link });
    }
  }

  const postSection = getRootSection(root, [
    'Post',
    'Posts',
    'Video',
    'Videos'
  ]);

  const postsListObj =
    readField<any>(postSection, ['Posts', 'VideoList', 'PostList', 'Videos']) ||
    postSection;

  const postList = asArray(
    readField<any>(postsListObj, [
      'VideoList',
      'videoList',
      'PostList',
      'postList',
      'Posts',
      'posts',
      'Videos',
      'videos'
    ]) || postsListObj
  );

  const postItems: NormalizedPostItem[] = [];

  for (const item of postList) {
    const date = readDate(item, DATE_KEYS);
    const link = readString(item, LINK_KEYS);
    const likes = readNumber(item, ['Likes', 'likes', 'LikeCount', 'Like Count']);

    if (date) {
      postItems.push({
        date,
        link,
        likes,
        whoCanView: readString(item, ['WhoCanView', 'Who Can View', 'Privacy'], 'Public'),
        allowComments: readBooleanYes(item, ['AllowComments', 'Allow Comments']),
        allowStitches: readBooleanYes(item, ['AllowStitches', 'Allow Stitches']),
        allowDuets: readBooleanYes(item, ['AllowDuets', 'Allow Duets']),
        allowStickers: readBooleanYes(item, ['AllowStickers', 'Allow Stickers']),
        allowSharingToStory: readBooleanYes(item, ['AllowSharingToStory', 'Allow Sharing To Story']),
        contentDisclosure: readString(item, ['ContentDisclosure', 'Content Disclosure'], 'None')
      });
    }
  }

  const liveSection = getRootSection(root, [
    'TikTok Live',
    'TikTokLive',
    'Live',
    'LIVE'
  ]);

  const goLiveList = asArray(
    readField<any>(liveSection, [
      'Go Live History',
      'GoLiveHistory',
      'GoLiveList',
      'goLiveList'
    ])
  );

  const watchLiveMap =
    readField<any>(liveSection, [
      'Watch Live History',
      'WatchLiveHistory',
      'WatchLiveMap',
      'watchLiveMap'
    ]) || {};

  const watchLiveList = asArray(
    readField<any>(watchLiveMap, [
      'WatchLiveList',
      'watchLiveList',
      'Watch Live List',
      'LiveList',
      'liveList'
    ]) || watchLiveMap
  );

  const liveItems: NormalizedLiveItem[] = [];

  for (const item of goLiveList) {
    liveItems.push({
      isHost: true,
      startTime: readDate(item, ['LiveStartTime', 'Live Start Time', 'StartTime', 'Start Time', ...DATE_KEYS]),
      endTime: readDate(item, ['LiveEndTime', 'Live End Time', 'EndTime', 'End Time']),
      roomId: readField<string>(item, ['RoomId', 'Room ID', 'roomId']),
      totalEarning: readNumber(item, ['TotalEarning', 'Total Earning']),
      totalLike: readNumber(item, ['TotalLike', 'Total Like', 'TotalLikes', 'Total Likes']),
      totalView: readNumber(item, ['TotalView', 'Total View', 'TotalViews', 'Total Views']),
      roomTitle: readField<string>(item, ['RoomTitle', 'Room Title'])
    });
  }

  for (const item of watchLiveList) {
    liveItems.push({
      isHost: false,
      startTime: readDate(item, ['StartTime', 'Start Time', ...DATE_KEYS]),
      endTime: readDate(item, ['EndTime', 'End Time']),
      watchedRoomId: readField<string>(item, ['RoomId', 'Room ID', 'roomId']),
      watchedRoomAnchor: readField<string>(item, ['AnchorNickname', 'Anchor Nickname', 'Anchor', 'Creator']),
      watchTimeMinutes: readNumber(item, ['WatchTimeMinutes', 'Watch Time Minutes', 'DurationMinutes', 'Duration Minutes'])
    });
  }

  const shopSection = getRootSection(root, [
    'TikTok Shop',
    'TikTokShop',
    'Shop',
    'Shopping'
  ]);

  const orderHistoriesObj =
    readField<any>(shopSection, [
      'Order History',
      'OrderHistory',
      'OrderHistories',
      'Orders'
    ]) || shopSection;

  const orderHistories = asArray(
    readField<any>(orderHistoriesObj, [
      'OrderHistories',
      'orderHistories',
      'OrderHistory',
      'orderHistory',
      'Orders',
      'orders'
    ]) || orderHistoriesObj
  );

  const shopItems: NormalizedShopItem[] = [];

  for (const order of orderHistories) {
    const orderDate = readDate(order, DATE_KEYS);
    const orderId = readField<string>(order, ['OrderId', 'Order ID', 'orderId']);
    const status = readString(order, ['OrderStatus', 'Order Status', 'status', 'Status'], 'Unknown');

    const productList = asArray(
      readField<any>(order, [
        'ProductList',
        'productList',
        'Products',
        'products',
        'Items',
        'items'
      ])
    );

    if (productList.length > 0) {
      for (const product of productList) {
        shopItems.push({
          date: orderDate,
          orderId,
          status,
          productName: readField<string>(product, ['ProductName', 'Product Name', 'Name', 'name']),
          shopName: readField<string>(product, ['ShopName', 'Shop Name', 'Seller', 'seller']),
          priceVnd: parseVnd(readField<any>(product, ['Price', 'price', 'TotalPrice', 'Total Price'])),
          itemCount: readNumber(product, ['Quantity', 'quantity', 'Count', 'count'], 1)
        });
      }
    } else if (orderDate || orderId || status !== 'Unknown') {
      shopItems.push({
        date: orderDate,
        orderId,
        status,
        priceVnd: parseVnd(readField<any>(order, ['TotalPrice', 'Total Price', 'Price', 'price']))
      });
    }
  }

  const walletSection = getRootSection(root, [
    'Income+ Wallet',
    'Income Wallet',
    'IncomeWallet',
    'Wallet',
    'Balance'
  ]);

  const coinPurchaseList = asArray(
    readField<any>(walletSection, [
      'Coin Purchase History',
      'CoinPurchaseHistory',
      'CoinPurchaseHistoryList',
      'PurchaseHistory',
      'Purchase History'
    ])
  );

  const purchasesSection =
    readField<any>(activitySection, ['Purchases', 'Purchase']) ||
    readField<any>(root, ['Purchases', 'Purchase']) ||
    {};

  const sendGiftsList = asArray(
    readField<any>(purchasesSection, [
      'SendGifts',
      'sendGifts',
      'Send Gifts',
      'GiftSent',
      'Gift Sent'
    ])
  );

  const buyGiftsList = asArray(
    readField<any>(purchasesSection, [
      'BuyGifts',
      'buyGifts',
      'Buy Gifts',
      'GiftBought',
      'Gift Bought'
    ])
  );

  const spendingItems: NormalizedSpendingItem[] = [];

  for (const purchase of coinPurchaseList) {
    spendingItems.push({
      type: 'coin_recharge',
      date: readDate(purchase, DATE_KEYS),
      coinAmount: readNumber(purchase, ['Coins', 'coins', 'CoinAmount', 'Coin Amount'], 0) || null,
      vndAmount: parseVnd(readField<any>(purchase, ['Price', 'price', 'Amount', 'amount', 'TotalPrice', 'Total Price']))
    });
  }

  for (const gift of sendGiftsList) {
    spendingItems.push({
      type: 'gift_sent',
      date: readDate(gift, DATE_KEYS),
      coinAmount: readNumber(gift, ['Coins', 'coins', 'CoinAmount', 'Coin Amount'], 0) || null,
      giftName: readField<string>(gift, ['GiftName', 'Gift Name', 'Name', 'name']),
      recipient: readField<string>(gift, ['Recipient', 'recipient', 'Receiver', 'receiver'])
    });
  }

  for (const gift of buyGiftsList) {
    spendingItems.push({
      type: 'gift_bought',
      date: readDate(gift, DATE_KEYS),
      coinAmount: readNumber(gift, ['Coins', 'coins', 'CoinAmount', 'Coin Amount'], 0) || null,
      giftName: readField<string>(gift, ['GiftName', 'Gift Name', 'Name', 'name'])
    });
  }

  if (watchItems.length === 0) {
    warnings.push({
      code: 'NO_WATCH_HISTORY',
      message: 'No watch history was detected in your file.'
    });
  }

  if (
    watchItems.length === 0 &&
    likeItems.length === 0 &&
    commentItems.length === 0 &&
    searchItems.length === 0 &&
    shareItems.length === 0 &&
    repostItems.length === 0
  ) {
    warnings.push({
      code: 'NO_ACTIVITY_SECTIONS_PARSED',
      message: 'The JSON was valid, but no supported TikTok activity sections were parsed.'
    });
  }

  return {
    profile,
    watchItems,
    likeItems,
    commentItems,
    shareItems,
    searchItems,
    repostItems,
    postItems,
    liveItems,
    shopItems,
    spendingItems,
    warnings
  };
}
