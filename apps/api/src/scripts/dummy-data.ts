import fs from 'fs';
import path from 'path';

const countArg = process.argv[2] ? parseInt(process.argv[2], 10) : 5000;
const totalItems = isNaN(countArg) ? 5000 : countArg;

console.log(`Generating simulated TikTok export JSON with ~${totalItems} items...`);

function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const startDate = new Date('2025-12-08T00:00:00Z');
const endDate = new Date('2026-06-08T23:59:59Z');

// Profile Info
const ProfileInfo = {
  ProfileMap: {
    displayName: 'Chiến Thần Lướt Dạo',
    userName: 'chienthan.tiktok',
    bioDescription: 'Lướt màn hình là đam mê, chốt đơn là lẽ sống. Code dạo nuôi thân.',
    followerCount: '256',
    followingCount: '890',
    likesReceived: '1024',
    profilePhoto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=256&h=256&q=80',
    instagramLink: 'https://instagram.com/chienthan.tiktok',
    youtubeLink: 'https://youtube.com/@chienthan.tiktok',
    accountRegion: 'VN'
  }
};

// Generate watches (make up to ~70% of totalItems)
const watchCount = Math.floor(totalItems * 0.7);
const VideoList: any[] = [];
for (let i = 0; i < watchCount; i++) {
  const d = randomDate(startDate, endDate);
  // Add clustering to create realistic sessions (e.g. 80% chance to be within 5 mins of previous date)
  if (i > 0 && Math.random() < 0.8) {
    const prevDate = new Date(VideoList[i - 1].Date);
    const addedMs = Math.floor(Math.random() * 5 * 60 * 1000); // 0-5 mins
    const clusteredDate = new Date(prevDate.getTime() + addedMs);
    if (clusteredDate <= endDate) {
      VideoList.push({
        Date: clusteredDate.toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
        Link: `https://www.tiktok.com/@creator_${Math.floor(Math.random() * 100)}/video/${1000000000 + i}`
      });
      continue;
    }
  }

  VideoList.push({
    Date: d.toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
    Link: `https://www.tiktok.com/@creator_${Math.floor(Math.random() * 100)}/video/${1000000000 + i}`
  });
}

// Sort VideoList chronologically
VideoList.sort((a, b) => new Date(a.Date).getTime() - new Date(b.Date).getTime());

// Generate likes (~15% of totalItems)
const likeCount = Math.floor(totalItems * 0.15);
const ItemFavoriteList: any[] = [];
for (let i = 0; i < likeCount; i++) {
  const d = randomDate(startDate, endDate);
  ItemFavoriteList.push({
    date: d.toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
    link: `https://www.tiktok.com/@creator_${Math.floor(Math.random() * 100)}/video/${2000000000 + i}`
  });
}

// Generate comments (~3% of totalItems)
const commentCount = Math.floor(totalItems * 0.03);
const CommentsList: any[] = [];
const commentPhrases = [
  'Hay quá anh ơi! 😂',
  'Xin info nhạc nền với ạ',
  'Cái này mua ở đâu vậy shop?',
  'Xem đi xem lại vẫn buồn cười 💀',
  'Đúng chuẩn luôn á trời',
  'Nhìn cuốn ghê',
  'Ủng hộ kênh nha chủ thớt',
  'Trời ơi cứu tui với',
  'Cháy quá 🔥🔥🔥',
  'Quá đỉnh luôn!'
];

for (let i = 0; i < commentCount; i++) {
  const d = randomDate(startDate, endDate);
  CommentsList.push({
    date: d.toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
    comment: commentPhrases[Math.floor(Math.random() * commentPhrases.length)]
  });
}

// Generate searches (~5% of totalItems)
const searchCount = Math.floor(totalItems * 0.05);
const SearchList: any[] = [];
const searchTerms = [
  'coding lofi music',
  'nextjs vs svelte',
  'review bàn phím cơ dưới 1 triệu',
  'cách nấu mì ngon',
  'funny cat memes',
  'unboxing iphone 15',
  'học code python',
  'đồ ăn vặt shopee',
  'anime vietsub',
  '@chienthan.tiktok'
];

for (let i = 0; i < searchCount; i++) {
  const d = randomDate(startDate, endDate);
  SearchList.push({
    Date: d.toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
    SearchTerm: searchTerms[Math.floor(Math.random() * searchTerms.length)]
  });
}

// Generate reposts (~6% of totalItems)
const repostCount = Math.floor(totalItems * 0.06);
const RepostList: any[] = [];
for (let i = 0; i < repostCount; i++) {
  const d = randomDate(startDate, endDate);
  RepostList.push({
    Date: d.toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
    Link: `https://www.tiktok.com/@creator_${Math.floor(Math.random() * 100)}/video/${3000000000 + i}`
  });
}

// Share History
const shareCount = Math.floor(totalItems * 0.02);
const ShareHistoryList: any[] = [];
const shareMethods = ['Copy Link', 'Facebook', 'Messenger', 'Zalo', 'WhatsApp'];
for (let i = 0; i < shareCount; i++) {
  const d = randomDate(startDate, endDate);
  ShareHistoryList.push({
    Date: d.toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
    SharedContent: 'video',
    Link: `https://www.tiktok.com/@creator_${Math.floor(Math.random() * 100)}/video/${4000000000 + i}`,
    Method: shareMethods[Math.floor(Math.random() * shareMethods.length)]
  });
}

// Posts
const VideoPostList: any[] = [];
for (let i = 0; i < 12; i++) {
  const d = randomDate(startDate, endDate);
  VideoPostList.push({
    Date: d.toISOString().replace('T', ' ').substring(0, 19) + ' UTC',
    Link: `https://www.tiktok.com/@chienthan.tiktok/video/${5000000000 + i}`,
    Likes: Math.floor(Math.random() * 500).toString(),
    WhoCanView: 'Public',
    AllowComments: 'Yes',
    AllowStitches: 'Yes',
    AllowDuets: 'Yes',
    AllowStickers: 'Yes',
    AllowSharingToStory: 'Yes',
    ContentDisclosure: 'None'
  });
}

// Live activity
const GoLiveList: any[] = [];
const WatchLiveMap = {
  WatchLiveList: [
    {
      StartTime: '2026-01-10 20:00:00 UTC',
      EndTime: '2026-01-10 20:30:00 UTC',
      RoomId: 'live_room_1',
      AnchorNickname: 'Vua Chốt Đơn',
      WatchTimeMinutes: '30'
    },
    {
      StartTime: '2026-02-15 21:00:00 UTC',
      EndTime: '2026-02-15 21:15:00 UTC',
      RoomId: 'live_room_2',
      AnchorNickname: 'ASMR Coding',
      WatchTimeMinutes: '15'
    }
  ]
};

// Shop Orders
const OrderHistories = [
  {
    Date: '2026-01-05 14:20:00 UTC',
    OrderId: 'order_1',
    OrderStatus: 'Giao hàng thành công',
    TotalPrice: '145.600 VND',
    ProductList: [
      {
        ProductName: 'Áo thun đen Unisex form rộng',
        Price: '145.600 VND',
        Quantity: '1',
        ShopName: 'Thời Trang GenZ'
      }
    ]
  },
  {
    Date: '2026-02-14 10:15:00 UTC',
    OrderId: 'order_2',
    OrderStatus: 'Giao hàng thành công',
    TotalPrice: '1.456.000 VND',
    ProductList: [
      {
        ProductName: 'Bàn phím cơ không dây AKKO 3098B',
        Price: '1.456.000 VND',
        Quantity: '1',
        ShopName: 'AKKO Official Store'
      }
    ]
  },
  {
    Date: '2026-03-20 09:12:00 UTC',
    OrderId: 'order_3',
    OrderStatus: 'Trả hàng/Hoàn tiền',
    TotalPrice: '350.000 VND',
    ProductList: [
      {
        ProductName: 'Tai nghe Bluetooth Pro 4',
        Price: '350.000 VND',
        Quantity: '1',
        ShopName: 'Thế Giới Phụ Kiện'
      }
    ]
  }
];

// Coins
const CoinPurchaseHistoryList = [
  { Date: '2026-01-20 18:30:00 UTC', Coins: '100', Price: '25.000 VND' },
  { Date: '2026-02-28 22:45:00 UTC', Coins: '500', Price: '125.000 VND' }
];

const SendGifts = [
  { Date: '2026-01-20 20:15:00 UTC', Coins: '10', GiftName: 'Rose', Recipient: 'Vua Chốt Đơn' }
];

const BuyGifts = [
  { Date: '2026-01-20 20:14:00 UTC', Coins: '10', GiftName: 'Rose' }
];

const exportData = {
  'Profile And Settings': {
    'Profile Info': {
      ProfileMap: ProfileInfo.ProfileMap
    }
  },
  'Your Activity': {
    'Watch History': {
      VideoList
    },
    'Share History': {
      ShareHistoryList
    },
    'Searches': {
      SearchList
    },
    'Reposts': {
      RepostList
    },
    'Purchases': {
      SendGifts,
      BuyGifts
    }
  },
  'Likes and Favorites': {
    'Like List': {
      ItemFavoriteList
    }
  },
  'Comment': {
    'Comments': {
      CommentsList
    }
  },
  'Post': {
    'Posts': {
      VideoList: VideoPostList
    }
  },
  'TikTok Live': {
    'Go Live History': {
      GoLiveList
    },
    'Watch Live History': WatchLiveMap
  },
  'TikTok Shop': {
    'Order History': {
      OrderHistories
    }
  },
  'Income+ Wallet': {
    'Coin Purchase History': {
      CoinPurchaseHistoryList
    }
  }
};

const outputFilePath = path.join(process.cwd(), 'dummy_tiktok_data.json');
fs.writeFileSync(outputFilePath, JSON.stringify(exportData, null, 2));

console.log(`Generated simulated export JSON saved to: ${outputFilePath}`);
console.log(`- Watch entries: ${VideoList.length}`);
console.log(`- Like entries: ${ItemFavoriteList.length}`);
console.log(`- Shop orders: ${OrderHistories.length}`);
