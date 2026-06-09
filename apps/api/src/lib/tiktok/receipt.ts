import { ReceiptData, PersonaResult, WatchStats, SearchStats, LiveStats, SpendingStats, EngagementStats, ProfileSummary } from '@recapanytime/shared';

export function generateReceiptData(
  profile: ProfileSummary,
  watch: WatchStats,
  searches: SearchStats,
  live: LiveStats,
  spending: SpendingStats,
  engagement: EngagementStats,
  persona: PersonaResult
): ReceiptData {
  const generatedAt = new Date().toISOString();
  // Format receiptId as a random fake number, like RC-20260609-1234
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const dateStrForId = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const receiptId = `RC-${dateStrForId}-${randomSuffix}`;

  const accountLabel = profile.username ? `@${profile.username}` : (profile.displayName || 'GUEST');

  // Derive periods
  const periodStart = watch.firstWatchAt ? watch.firstWatchAt.substring(0, 10) : null;
  const periodEnd = watch.lastWatchAt ? watch.lastWatchAt.substring(0, 10) : null;

  // Primary lines
  const lineItems = [
    { label: 'WATCHED VIDEOS', value: watch.totalVideos },
    { label: 'EST. WATCH TIME', value: formatDuration(watch.estimatedWatchSeconds) },
    { label: 'WATCH SESSIONS', value: watch.sessionCount },
    { label: 'LIKED VIDEOS', value: engagement.totalLikes },
    { label: 'COMMENTS', value: engagement.totalComments },
    { label: 'SHARES', value: engagement.totalShares },
    { label: 'REPOSTS', value: engagement.totalReposts },
    { label: 'SEARCHES', value: searches.totalSearches },
    { label: 'LIVE SESSIONS', value: live.totalGoLiveSessions + live.watchedLiveRoomsCount }
  ];

  // Spending line items
  const spendingLines: Array<{ label: string; value: string | number }> = [];
  if (spending.orderCount > 0) {
    spendingLines.push({ label: 'SHOP ORDERS', value: spending.orderCount });
    spendingLines.push({ label: 'COMPLETED ORDERS', value: spending.completedOrderCount });
  }
  if (spending.totalSpendVnd) {
    const formattedVnd = new Intl.NumberFormat('vi-VN').format(spending.totalSpendVnd);
    spendingLines.push({ label: 'EST. SPEND', value: `${formattedVnd} VND` });
  } else {
    spendingLines.push({ label: 'EST. SPEND', value: '0 VND' });
  }

  if (spending.coinRechargeCount > 0 && spending.totalCoinsRecharged) {
    spendingLines.push({ label: 'COINS RECHARGED', value: spending.totalCoinsRecharged });
  }
  if (spending.giftSentCount > 0) {
    spendingLines.push({ label: 'GIFTS SENT', value: spending.giftSentCount });
  }

  const topSearches = searches.topSearches.slice(0, 5);

  return {
    receiptId,
    generatedAt,
    accountLabel,
    periodStart,
    periodEnd,
    lineItems,
    spendingLines,
    topSearches,
    persona,
    footerText: 'Thank you for scrolling.'
  };
}

function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
}
