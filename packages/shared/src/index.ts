export type ProfileSummary = {
  displayName: string | null;
  username: string | null;
  bio: string | null;
  followerCount: number | null;
  followingCount: number | null;
  likesReceived: number | null;
  profilePhoto: string | null;
  region: string | null;
  socialLinks: {
    instagram?: string | null;
    youtube?: string | null;
    lemon8?: string | null;
  };
};

export type WatchSession = {
  start: string;
  end: string;
  durationSeconds: number;
  itemCount: number;
};

export type WatchStats = {
  totalVideos: number;
  firstWatchAt: string | null;
  lastWatchAt: string | null;
  estimatedWatchSeconds: number;
  sessionCount: number;
  averageSessionSeconds: number;
  longestSessionSeconds: number;
  mostActiveWeekday: string | null;
  mostActiveHour: number | null;
  mostActiveMonth: string | null;
  longestStreakDays: number;
  videosPerDay: Record<string, number>;
  videosPerMonth: Record<string, number>;
  hourlyDistribution: Record<string, number>;
};

export type SpendingStats = {
  orderCount: number;
  completedOrderCount: number;
  returnOrRefundCount: number;
  totalSpendVnd: number | null;
  productBrowsingCount: number;
  cartItemCount: number;
  voucherCount: number;
  reviewCount: number;
  coinRechargeCount: number;
  giftSentCount: number;
  totalCoinsRecharged: number | null;
  totalCoinsGifted: number | null;
  topShops: Array<{ name: string; count: number }>;
  topProductCategories: Array<{ category: string; count: number }>;
  summaryTextVi: string;
};

export type SearchStats = {
  totalSearches: number;
  topSearches: Array<{ term: string; count: number }>;
  timeline: Record<string, number>;
  categories: Record<string, number>;
};

export type LiveStats = {
  totalGoLiveSessions: number;
  totalLiveViews: number;
  totalLiveLikes: number;
  averageLiveDurationSeconds: number;
  totalEarning: number;
  watchedLiveRoomsCount: number;
  liveCommentsCount: number;
};

export type EngagementStats = {
  totalLikes: number;
  likesPerMonth: Record<string, number>;
  mostActiveLikeDay: string | null;
  totalComments: number;
  averageCommentLength: number;
  topCommentWords: Array<{ word: string; count: number }>;
  topCommentEmojis: Array<{ emoji: string; count: number }>;
  totalShares: number;
  mostUsedShareMethod: string | null;
  mostSharedContentType: string | null;
  totalReposts: number;
  repostToWatchRatio: number;
  totalPosts: number;
  totalPostLikes: number;
  averagePostLikes: number;
  bestPostLikes: number;
  bestPostLink: string | null;
};

export type PersonaResult = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  score: number;
  reasons: string[];
};

export type ReceiptData = {
  receiptId: string;
  generatedAt: string;
  accountLabel: string;
  periodStart: string | null;
  periodEnd: string | null;
  lineItems: Array<{
    label: string;
    value: string | number;
  }>;
  spendingLines: Array<{
    label: string;
    value: string | number;
  }>;
  topSearches: Array<{
    term: string;
    count: number;
  }>;
  persona: PersonaResult;
  footerText: string;
};

export type RecapStats = {
  profile: ProfileSummary;
  watch: WatchStats;
  engagement: EngagementStats;
  searches: SearchStats;
  live: LiveStats;
  spending: SpendingStats;
  persona: PersonaResult;
  receipt: ReceiptData;
};

export type ApiResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: string; message: string } };
