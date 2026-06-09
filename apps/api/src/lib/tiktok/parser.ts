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

export function parseTikTokJson(rawJson: string): ParsedTikTokExport {
  const warnings: ParserWarning[] = [];
  let root: any = {};

  try {
    root = JSON.parse(rawJson);
  } catch (err: any) {
    throw new Error('JSON_PARSE_FAILED');
  }

  // 1. Profile parsing
  const profileSection = getField<any>(root, ['Profile And Settings', 'ProfileAndSettings', 'Profile']);
  const profileInfo = getField<any>(profileSection, ['Profile Info', 'ProfileInfo']);
  const profileMap = getField<any>(profileInfo, ['ProfileMap', 'profileMap']) || profileInfo || {};

  const profile: ProfileSummary = {
    displayName: getField<string>(profileMap, ['displayName']) || null,
    username: getField<string>(profileMap, ['userName', 'username']) || null,
    bio: getField<string>(profileMap, ['bioDescription', 'bio']) || null,
    followerCount: Number(getField<any>(profileMap, ['followerCount'])) || 0,
    followingCount: Number(getField<any>(profileMap, ['followingCount'])) || 0,
    likesReceived: Number(getField<any>(profileMap, ['likesReceived'])) || 0,
    profilePhoto: getField<string>(profileMap, ['profilePhoto', 'avatar']) || null,
    region: getField<string>(profileMap, ['accountRegion', 'region']) || null,
    socialLinks: {
      instagram: getField<string>(profileMap, ['instagramLink']) || null,
      youtube: getField<string>(profileMap, ['youtubeLink']) || null,
      lemon8: getField<string>(profileMap, ['lemon8Link']) || null,
    }
  };

  // 2. Watch History
  const watchSection = getField<any>(root, ['Your Activity', 'YourActivity', 'Activity']);
  const watchHistory = getField<any>(watchSection, ['Watch History', 'WatchHistory']);
  const watchList = getField<any[]>(watchHistory, ['VideoList', 'videoList']) || [];
  const watchItems: NormalizedWatchItem[] = [];

  for (const item of watchList) {
    const d = parseDate(getField(item, ['Date']));
    const link = getField<string>(item, ['Link']) || '';
    if (d) {
      watchItems.push({ date: d, link });
    }
  }

  // 3. Likes
  const likesSection = getField<any>(root, ['Likes and Favorites', 'LikesAndFavorites', 'Likes']);
  const likeListObj = getField<any>(likesSection, ['Like List', 'LikeList']);
  const likeList = getField<any[]>(likeListObj, ['ItemFavoriteList', 'itemFavoriteList']) || [];
  const likeItems: NormalizedLikeItem[] = [];

  for (const item of likeList) {
    const d = parseDate(getField(item, ['date', 'Date']));
    const link = getField<string>(item, ['link', 'Link']) || '';
    if (d) {
      likeItems.push({ date: d, link });
    }
  }

  // 4. Comments
  const commentSection = getField<any>(root, ['Comment', 'Comments']);
  const commentsListObj = getField<any>(commentSection, ['Comments', 'CommentsList']);
  const commentsList = getField<any[]>(commentsListObj, ['CommentsList', 'commentsList']) || commentSection?.CommentsList || [];
  const commentItems: NormalizedCommentItem[] = [];

  for (const item of commentsList) {
    const d = parseDate(getField(item, ['date', 'Date']));
    const comment = getField<string>(item, ['comment', 'Comment']) || '';
    if (d) {
      commentItems.push({
        date: d,
        comment,
        photo: getField<string>(item, ['photo']),
        video: getField<string>(item, ['video']),
        url: getField<string>(item, ['url'])
      });
    }
  }

  // 5. Shares
  const shareHistory = getField<any>(watchSection, ['Share History', 'ShareHistory']);
  const shareList = getField<any[]>(shareHistory, ['ShareHistoryList', 'shareHistoryList']) || [];
  const shareItems: NormalizedShareItem[] = [];

  for (const item of shareList) {
    const d = parseDate(getField(item, ['Date']));
    const sharedContent = getField<string>(item, ['SharedContent']) || '';
    const link = getField<string>(item, ['Link']) || '';
    const method = getField<string>(item, ['Method']) || 'unknown';
    if (d) {
      shareItems.push({ date: d, sharedContent, link, method });
    }
  }

  // 6. Searches
  const searchesObj = getField<any>(watchSection, ['Searches', 'Search']);
  const searchList = getField<any[]>(searchesObj, ['SearchList', 'searchList']) || [];
  const searchItems: NormalizedSearchItem[] = [];

  for (const item of searchList) {
    const d = parseDate(getField(item, ['Date']));
    const searchTerm = getField<string>(item, ['SearchTerm']) || '';
    if (d && searchTerm) {
      searchItems.push({ date: d, searchTerm });
    }
  }

  // 7. Reposts
  const repostsObj = getField<any>(watchSection, ['Reposts', 'Repost']);
  const repostList = getField<any[]>(repostsObj, ['RepostList', 'repostList']) || [];
  const repostItems: NormalizedRepostItem[] = [];

  for (const item of repostList) {
    const d = parseDate(getField(item, ['Date']));
    const link = getField<string>(item, ['Link']) || '';
    if (d) {
      repostItems.push({ date: d, link });
    }
  }

  // 8. Posts
  const postSection = getField<any>(root, ['Post', 'Posts']);
  const postsListObj = getField<any>(postSection, ['Posts', 'VideoList']);
  const postList = getField<any[]>(postsListObj, ['VideoList', 'videoList']) || [];
  const postItems: NormalizedPostItem[] = [];

  for (const item of postList) {
    const d = parseDate(getField(item, ['Date']));
    const link = getField<string>(item, ['Link']) || '';
    const likesVal = getField<any>(item, ['Likes']) || 0;
    const likes = typeof likesVal === 'number' ? likesVal : parseInt(likesVal, 10) || 0;
    if (d) {
      postItems.push({
        date: d,
        link,
        likes,
        whoCanView: getField<string>(item, ['WhoCanView']) || 'Public',
        allowComments: getField<string>(item, ['AllowComments']) === 'Yes',
        allowStitches: getField<string>(item, ['AllowStitches']) === 'Yes',
        allowDuets: getField<string>(item, ['AllowDuets']) === 'Yes',
        allowStickers: getField<string>(item, ['AllowStickers']) === 'Yes',
        allowSharingToStory: getField<string>(item, ['AllowSharingToStory']) === 'Yes',
        contentDisclosure: getField<string>(item, ['ContentDisclosure']) || 'None'
      });
    }
  }

  // 9. Live History
  const liveSection = getField<any>(root, ['TikTok Live', 'TikTokLive']);
  const goLiveList = getField<any[]>(liveSection, ['Go Live History', 'GoLiveList']) || [];
  const watchLiveMap = getField<any>(liveSection, ['Watch Live History', 'WatchLiveMap']) || {};
  const watchLiveList = getField<any[]>(watchLiveMap, ['WatchLiveList']) || [];

  const liveItems: NormalizedLiveItem[] = [];

  for (const item of goLiveList) {
    liveItems.push({
      isHost: true,
      startTime: parseDate(getField(item, ['LiveStartTime'])),
      endTime: parseDate(getField(item, ['LiveEndTime'])),
      roomId: getField<string>(item, ['RoomId']),
      totalEarning: Number(getField(item, ['TotalEarning'])) || 0,
      totalLike: Number(getField(item, ['TotalLike'])) || 0,
      totalView: Number(getField(item, ['TotalView'])) || 0,
      roomTitle: getField<string>(item, ['RoomTitle'])
    });
  }

  for (const item of watchLiveList) {
    liveItems.push({
      isHost: false,
      startTime: parseDate(getField(item, ['StartTime'])),
      endTime: parseDate(getField(item, ['EndTime'])),
      watchedRoomId: getField<string>(item, ['RoomId']),
      watchedRoomAnchor: getField<string>(item, ['AnchorNickname']),
      watchTimeMinutes: Number(getField(item, ['WatchTimeMinutes'])) || 0
    });
  }

  // 10. Shop and Spending
  const shopSection = getField<any>(root, ['TikTok Shop', 'TikTokShop']);
  const orderHistoriesObj = getField<any>(shopSection, ['Order History', 'OrderHistories']);
  const orderHistories = getField<any[]>(orderHistoriesObj, ['OrderHistories', 'orderHistories']) || [];
  const shopItems: NormalizedShopItem[] = [];

  for (const order of orderHistories) {
    const orderDate = parseDate(getField(order, ['Date']));
    const orderId = getField<string>(order, ['OrderId']);
    const status = getField<string>(order, ['OrderStatus']) || 'Unknown';
    const productList = getField<any[]>(order, ['ProductList', 'productList']) || [];

    if (productList.length > 0) {
      for (const prod of productList) {
        shopItems.push({
          date: orderDate,
          orderId,
          status,
          productName: getField<string>(prod, ['ProductName']),
          shopName: getField<string>(prod, ['ShopName']),
          priceVnd: parseVnd(getField(prod, ['Price'])),
          itemCount: Number(getField(prod, ['Quantity'])) || 1
        });
      }
    } else {
      shopItems.push({
        date: orderDate,
        orderId,
        status,
        priceVnd: parseVnd(getField(order, ['TotalPrice']))
      });
    }
  }

  // 11. Coin purchase/gift history
  const walletSection = getField<any>(root, ['Income+ Wallet', 'IncomeWallet', 'Wallet']);
  const coinPurchaseList = getField<any[]>(walletSection, ['Coin Purchase History', 'CoinPurchaseHistoryList']) || [];
  const purchasesSection = getField<any>(watchSection, ['Purchases']);
  const sendGiftsList = getField<any[]>(purchasesSection, ['SendGifts', 'sendGifts']) || [];
  const buyGiftsList = getField<any[]>(purchasesSection, ['BuyGifts', 'buyGifts']) || [];

  const spendingItems: NormalizedSpendingItem[] = [];

  for (const c of coinPurchaseList) {
    spendingItems.push({
      type: 'coin_recharge',
      date: parseDate(getField(c, ['Date'])),
      coinAmount: Number(getField(c, ['Coins'])) || null,
      vndAmount: parseVnd(getField(c, ['Price']))
    });
  }

  for (const g of sendGiftsList) {
    spendingItems.push({
      type: 'gift_sent',
      date: parseDate(getField(g, ['Date'])),
      coinAmount: Number(getField(g, ['Coins'])) || null,
      giftName: getField<string>(g, ['GiftName']),
      recipient: getField<string>(g, ['Recipient'])
    });
  }

  for (const g of buyGiftsList) {
    spendingItems.push({
      type: 'gift_bought',
      date: parseDate(getField(g, ['Date'])),
      coinAmount: Number(getField(g, ['Coins'])) || null,
      giftName: getField<string>(g, ['GiftName'])
    });
  }

  // Inject a warning if essential data is completely missing
  if (watchItems.length === 0) {
    warnings.push({
      code: 'NO_WATCH_HISTORY',
      message: 'No watch history was detected in your file.'
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
