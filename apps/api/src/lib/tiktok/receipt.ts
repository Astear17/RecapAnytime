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
    { label: 'VIDEO ĐÃ XEM', value: watch.totalVideos },
    { label: 'THỜI GIAN XEM', value: formatDuration(watch.estimatedWatchSeconds) },
    { label: 'PHIÊN LƯỚT', value: watch.sessionCount },
    { label: 'TIM ĐÃ THẢ', value: engagement.totalLikes },
    { label: 'BÌNH LUẬN', value: engagement.totalComments },
    { label: 'CHIA SẺ', value: engagement.totalShares },
    { label: 'REPOST', value: engagement.totalReposts },
    { label: 'TÌM KIẾM', value: searches.totalSearches },
    { label: 'PHÒNG LIVE', value: live.totalGoLiveSessions + live.watchedLiveRoomsCount }
  ];

  const spendingLines: Array<{ label: string; value: string | number }> = [];
  if (spending.orderCount > 0) {
    spendingLines.push({ label: 'ĐƠN HÀNG', value: spending.orderCount });
    spendingLines.push({ label: 'HOÀN THÀNH', value: spending.completedOrderCount });
  }
  if (spending.totalSpendVnd) {
    const formattedVnd = new Intl.NumberFormat('vi-VN').format(spending.totalSpendVnd);
    spendingLines.push({ label: 'TỔNG CHI', value: `${formattedVnd} VND` });
  } else {
    spendingLines.push({ label: 'TỔNG CHI', value: '0 VND' });
  }

  if (spending.coinRechargeCount > 0 && spending.totalCoinsRecharged) {
    spendingLines.push({ label: 'COIN ĐÃ NẠP', value: spending.totalCoinsRecharged });
  }
  if (spending.giftSentCount > 0) {
    spendingLines.push({ label: 'QUÀ ĐÃ TẶNG', value: spending.giftSentCount });
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
    footerText: 'Cảm ơn bạn đã lướt dạo cùng chúng tôi.'
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
