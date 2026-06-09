import {
  WatchStats,
  WatchSession,
  SpendingStats,
  SearchStats,
  LiveStats,
  EngagementStats
} from '@recapanytime/shared';
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
  NormalizedSpendingItem
} from './schema';

// Helper to format date as YYYY-MM-DD
function toDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const r = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${r}`;
}

export function calculateWatchStats(watchItems: NormalizedWatchItem[]): WatchStats {
  const totalVideos = watchItems.length;
  if (totalVideos === 0) {
    return {
      totalVideos: 0,
      firstWatchAt: null,
      lastWatchAt: null,
      estimatedWatchSeconds: 0,
      sessionCount: 0,
      averageSessionSeconds: 0,
      longestSessionSeconds: 0,
      mostActiveWeekday: null,
      mostActiveHour: null,
      mostActiveMonth: null,
      longestStreakDays: 0,
      videosPerDay: {},
      videosPerMonth: {},
      hourlyDistribution: {}
    };
  }

  // Sort chronologically
  const sorted = [...watchItems].sort((a, b) => a.date.getTime() - b.date.getTime());
  const firstWatchAt = sorted[0].date.toISOString();
  const lastWatchAt = sorted[sorted.length - 1].date.toISOString();

  // Calculate sessions
  const sessions: WatchSession[] = [];
  const TEN_MINUTES_MS = 10 * 60 * 1000;
  const TAIL_DURATION_SECONDS = 30;

  let currentSessionStart = sorted[0].date;
  let prevTime = sorted[0].date;
  let itemsInSession = 1;

  for (let i = 1; i < sorted.length; i++) {
    const item = sorted[i];
    const diff = item.date.getTime() - prevTime.getTime();

    if (diff <= TEN_MINUTES_MS) {
      // Continue session
      prevTime = item.date;
      itemsInSession++;
    } else {
      // Close session
      const durationSeconds = Math.max(
        TAIL_DURATION_SECONDS,
        Math.floor((prevTime.getTime() - currentSessionStart.getTime()) / 1000) + TAIL_DURATION_SECONDS
      );
      sessions.push({
        start: currentSessionStart.toISOString(),
        end: prevTime.toISOString(),
        durationSeconds,
        itemCount: itemsInSession
      });

      // Start new session
      currentSessionStart = item.date;
      prevTime = item.date;
      itemsInSession = 1;
    }
  }

  // Close final session
  const finalDurationSeconds = Math.max(
    TAIL_DURATION_SECONDS,
    Math.floor((prevTime.getTime() - currentSessionStart.getTime()) / 1000) + TAIL_DURATION_SECONDS
  );
  sessions.push({
    start: currentSessionStart.toISOString(),
    end: prevTime.toISOString(),
    durationSeconds: finalDurationSeconds,
    itemCount: itemsInSession
  });

  const sessionCount = sessions.length;
  const totalDuration = sessions.reduce((acc, s) => acc + s.durationSeconds, 0);
  const averageSessionSeconds = sessionCount > 0 ? Math.floor(totalDuration / sessionCount) : 0;
  const longestSessionSeconds = sessions.reduce((max, s) => (s.durationSeconds > max ? s.durationSeconds : max), 0);

  // Time metrics
  const videosPerDay: Record<string, number> = {};
  const videosPerMonth: Record<string, number> = {};
  const hourlyDistribution: Record<number, number> = {};
  const weekdayCounts: Record<number, number> = {};
  const monthCounts: Record<number, number> = {};

  for (const item of sorted) {
    const d = item.date;
    const dayStr = toDateString(d);
    videosPerDay[dayStr] = (videosPerDay[dayStr] || 0) + 1;

    const monthStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    videosPerMonth[monthStr] = (videosPerMonth[monthStr] || 0) + 1;

    const hour = d.getHours();
    hourlyDistribution[hour] = (hourlyDistribution[hour] || 0) + 1;

    const weekday = d.getDay();
    weekdayCounts[weekday] = (weekdayCounts[weekday] || 0) + 1;

    const m = d.getMonth();
    monthCounts[m] = (monthCounts[m] || 0) + 1;
  }

  // Find most active weekday
  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let maxWeekdayCount = -1;
  let mostActiveWeekday: string | null = null;
  for (let w = 0; w < 7; w++) {
    if ((weekdayCounts[w] || 0) > maxWeekdayCount) {
      maxWeekdayCount = weekdayCounts[w] || 0;
      mostActiveWeekday = weekdays[w];
    }
  }

  // Find most active hour
  let maxHourCount = -1;
  let mostActiveHour: number | null = null;
  for (let h = 0; h < 24; h++) {
    if ((hourlyDistribution[h] || 0) > maxHourCount) {
      maxHourCount = hourlyDistribution[h] || 0;
      mostActiveHour = h;
    }
  }

  // Find most active month
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  let maxMonthCount = -1;
  let mostActiveMonth: string | null = null;
  for (let m = 0; m < 12; m++) {
    if ((monthCounts[m] || 0) > maxMonthCount) {
      maxMonthCount = monthCounts[m] || 0;
      mostActiveMonth = months[m];
    }
  }

  // Streak days calculation
  const uniqueDays = Object.keys(videosPerDay).sort();
  let longestStreakDays = 0;
  let currentStreak = 0;
  let lastDayMs: number | null = null;

  for (const dayStr of uniqueDays) {
    const dayMs = new Date(dayStr).getTime();
    if (lastDayMs === null) {
      currentStreak = 1;
    } else {
      const diffDays = Math.round((dayMs - lastDayMs) / (24 * 60 * 60 * 1000));
      if (diffDays === 1) {
        currentStreak++;
      } else if (diffDays > 1) {
        if (currentStreak > longestStreakDays) {
          longestStreakDays = currentStreak;
        }
        currentStreak = 1;
      }
    }
    lastDayMs = dayMs;
  }
  if (currentStreak > longestStreakDays) {
    longestStreakDays = currentStreak;
  }

  // Transform hourly distribution to standard Record<string, number>
  const hourlyRecord: Record<string, number> = {};
  for (let h = 0; h < 24; h++) {
    hourlyRecord[String(h)] = hourlyDistribution[h] || 0;
  }

  return {
    totalVideos,
    firstWatchAt,
    lastWatchAt,
    estimatedWatchSeconds: totalDuration,
    sessionCount,
    averageSessionSeconds,
    longestSessionSeconds,
    mostActiveWeekday,
    mostActiveHour,
    mostActiveMonth,
    longestStreakDays,
    videosPerDay,
    videosPerMonth,
    hourlyDistribution: hourlyRecord
  };
}

export function calculateSearchStats(searchItems: NormalizedSearchItem[]): SearchStats {
  const totalSearches = searchItems.length;
  const counts: Record<string, number> = {};
  const timeline: Record<string, number> = {};
  const categoryCounts: Record<string, number> = {
    tech: 0,
    gaming: 0,
    shopping: 0,
    music: 0,
    anime: 0,
    'creator/person lookup': 0,
    school: 0,
    tools: 0,
    memes: 0,
    unknown: 0
  };

  const regexRules = [
    { cat: 'tech', re: /code|coding|programming|developer|gpt|ai|python|react|typescript|github|nextjs|vscode|ios|android/i },
    { cat: 'gaming', re: /game|gaming|mc|minecraft|roblox|valorant|steam|nintendo|pubg|free fire|lol|league|dota/i },
    { cat: 'shopping', re: /shop|shopee|lazada|mua|giá|bán|review sản phẩm|review đồ|unboxing/i },
    { cat: 'music', re: /nhạc|song|music|mv|remix|lofi|karaoke|lyrics|rap|cover/i },
    { cat: 'anime', re: /anime|manga|naruto|one piece|wibu|otaku|luffy/i },
    { cat: 'memes', re: /meme|hài|funny|troll|vui|joke/i },
    { cat: 'school', re: /học|study|thi|đại học|sách|toán|văn|english|ielts/i },
    { cat: 'tools', re: /tool|công cụ|app|website|phần mềm/i }
  ];

  for (const item of searchItems) {
    const term = item.searchTerm.trim();
    if (!term) continue;
    counts[term] = (counts[term] || 0) + 1;

    const dateStr = toDateString(item.date);
    timeline[dateStr] = (timeline[dateStr] || 0) + 1;

    // Category inference
    let matched = false;
    for (const rule of regexRules) {
      if (rule.re.test(term)) {
        categoryCounts[rule.cat]++;
        matched = true;
        break;
      }
    }

    if (!matched) {
      // Check if looks like a name or account query (starts with @ or contains double words typical of name lookup)
      if (term.startsWith('@') || term.includes(' ')) {
        categoryCounts['creator/person lookup']++;
      } else {
        categoryCounts['unknown']++;
      }
    }
  }

  const topSearches = Object.entries(counts)
    .map(([term, count]) => ({ term, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return {
    totalSearches,
    topSearches,
    timeline,
    categories: categoryCounts
  };
}

export function calculateSpendingStats(
  shopItems: NormalizedShopItem[],
  spendingItems: NormalizedSpendingItem[],
  productBrowsingCount = 0
): SpendingStats {
  const orderCount = new Set(shopItems.map(s => s.orderId).filter(Boolean)).size;
  const completedOrders = shopItems.filter(s => s.status?.toLowerCase().includes('complete') || s.status?.toLowerCase().includes('giao thành công'));
  const completedOrderCount = new Set(completedOrders.map(s => s.orderId).filter(Boolean)).size;

  const returnOrRefund = shopItems.filter(
    s => s.status?.toLowerCase().includes('return') ||
         s.status?.toLowerCase().includes('refund') ||
         s.status?.toLowerCase().includes('trả hàng') ||
         s.status?.toLowerCase().includes('hoàn tiền')
  );
  const returnOrRefundCount = new Set(returnOrRefund.map(s => s.orderId).filter(Boolean)).size;

  let totalSpendVnd = 0;
  const countedOrders = new Set<string>();
  const shopCounts: Record<string, number> = {};
  const categoryCounts: Record<string, number> = {};

  for (const item of shopItems) {
    if (item.priceVnd && item.orderId && !countedOrders.has(item.orderId)) {
      const isReturned =
        item.status?.toLowerCase().includes('return') ||
        item.status?.toLowerCase().includes('refund');
      if (!isReturned) {
        totalSpendVnd += item.priceVnd;
        countedOrders.add(item.orderId);
      }
    } else if (item.priceVnd && !item.orderId) {
      const isReturned =
        item.status?.toLowerCase().includes('return') ||
        item.status?.toLowerCase().includes('refund');
      if (!isReturned) {
        totalSpendVnd += item.priceVnd;
      }
    }
    if (item.shopName) {
      shopCounts[item.shopName] = (shopCounts[item.shopName] || 0) + 1;
    }
    if (item.productName) {
      // Crude category guess
      let cat = 'Khác';
      const name = item.productName.toLowerCase();
      if (name.includes('áo') || name.includes('quần') || name.includes('váy') || name.includes('tất') || name.includes('giày') || name.includes('jean') || name.includes('jacket')) {
        cat = 'Thời trang';
      } else if (name.includes('ốp') || name.includes('cáp') || name.includes('sạc') || name.includes('chuột') || name.includes('tai nghe') || name.includes('điện thoại') || name.includes('bàn phím')) {
        cat = 'Công nghệ';
      } else if (name.includes('son') || name.includes('kem') || name.includes('phấn') || name.includes('sữa tắm') || name.includes('dầu gội') || name.includes('mỹ phẩm')) {
        cat = 'Làm đẹp';
      } else if (name.includes('bánh') || name.includes('kẹo') || name.includes('trà') || name.includes('mì') || name.includes('ăn') || name.includes('uống')) {
        cat = 'Đồ ăn';
      } else if (name.includes('sách') || name.includes('vở') || name.includes('bút') || name.includes('dụng cụ')) {
        cat = 'Học tập';
      }
      categoryCounts[cat] = (categoryCounts[cat] || 0) + (item.itemCount || 1);
    }
  }

  // Coin counts
  let coinRechargeCount = 0;
  let totalCoinsRecharged = 0;
  let giftSentCount = 0;
  let totalCoinsGifted = 0;

  for (const s of spendingItems) {
    if (s.type === 'coin_recharge') {
      coinRechargeCount++;
      if (s.coinAmount) totalCoinsRecharged += s.coinAmount;
    } else if (s.type === 'gift_sent') {
      giftSentCount++;
      if (s.coinAmount) totalCoinsGifted += s.coinAmount;
    }
  }

  const topShops = Object.entries(shopCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const topProductCategories = Object.entries(categoryCounts)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Generate Vietnamese summary
  let summaryTextVi = '';
  if (totalSpendVnd > 0) {
    const formattedVnd = new Intl.NumberFormat('vi-VN').format(totalSpendVnd);
    if (totalSpendVnd > 5000000) {
      summaryTextVi = `Đại phú hào chốt đơn! Bạn đã xả khoảng ${formattedVnd} VND trên TikTok Shop.`;
    } else if (totalSpendVnd > 1000000) {
      summaryTextVi = `Chi tiêu đều tay! Bạn đã đầu tư ${formattedVnd} VND vào các deal hot.`;
    } else {
      summaryTextVi = `Tiết kiệm thông thái! Bạn chỉ tiêu khoảng ${formattedVnd} VND trên TikTok Shop.`;
    }
  } else {
    summaryTextVi = 'Không thấy dấu vết xả tiền trong export này.';
  }

  return {
    orderCount,
    completedOrderCount,
    returnOrRefundCount,
    totalSpendVnd: totalSpendVnd > 0 ? totalSpendVnd : null,
    productBrowsingCount,
    cartItemCount: 0, // Fallback if no cart parsing
    voucherCount: 0,  // Fallback
    reviewCount: 0,   // Fallback
    coinRechargeCount,
    giftSentCount,
    totalCoinsRecharged: totalCoinsRecharged > 0 ? totalCoinsRecharged : null,
    totalCoinsGifted: totalCoinsGifted > 0 ? totalCoinsGifted : null,
    topShops,
    topProductCategories,
    summaryTextVi
  };
}

export function calculateEngagementStats(
  likeItems: NormalizedLikeItem[],
  commentItems: NormalizedCommentItem[],
  shareItems: NormalizedShareItem[],
  repostItems: NormalizedRepostItem[],
  postItems: NormalizedPostItem[],
  totalVideosWatched: number
): EngagementStats {
  const totalLikes = likeItems.length;
  const likesPerMonth: Record<string, number> = {};
  const likeDayCounts: Record<number, number> = {};

  for (const item of likeItems) {
    const mStr = `${item.date.getFullYear()}-${String(item.date.getMonth() + 1).padStart(2, '0')}`;
    likesPerMonth[mStr] = (likesPerMonth[mStr] || 0) + 1;
    const w = item.date.getDay();
    likeDayCounts[w] = (likeDayCounts[w] || 0) + 1;
  }

  const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  let maxLikes = -1;
  let mostActiveLikeDay: string | null = null;
  for (let w = 0; w < 7; w++) {
    if ((likeDayCounts[w] || 0) > maxLikes) {
      maxLikes = likeDayCounts[w] || 0;
      mostActiveLikeDay = weekdays[w];
    }
  }

  const totalComments = commentItems.length;
  let commentLengthSum = 0;
  const wordCounts: Record<string, number> = {};
  const emojiCounts: Record<string, number> = {};
  const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;

  for (const item of commentItems) {
    commentLengthSum += item.comment.length;

    // Word counts
    const words = item.comment.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    for (const w of words) {
      wordCounts[w] = (wordCounts[w] || 0) + 1;
    }

    // Emojis
    const matches = item.comment.match(emojiRegex);
    if (matches) {
      for (const emoji of matches) {
        emojiCounts[emoji] = (emojiCounts[emoji] || 0) + 1;
      }
    }
  }

  const averageCommentLength = totalComments > 0 ? Math.floor(commentLengthSum / totalComments) : 0;
  const topCommentWords = Object.entries(wordCounts)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const topCommentEmojis = Object.entries(emojiCounts)
    .map(([emoji, count]) => ({ emoji, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const totalShares = shareItems.length;
  const shareMethods: Record<string, number> = {};
  const shareTypes: Record<string, number> = {};

  for (const item of shareItems) {
    if (item.method) {
      shareMethods[item.method] = (shareMethods[item.method] || 0) + 1;
    }
    if (item.sharedContent) {
      shareTypes[item.sharedContent] = (shareTypes[item.sharedContent] || 0) + 1;
    }
  }

  const mostUsedShareMethod = Object.entries(shareMethods).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
  const mostSharedContentType = Object.entries(shareTypes).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  const totalReposts = repostItems.length;
  const repostToWatchRatio = totalVideosWatched > 0 ? Number((totalReposts / totalVideosWatched).toFixed(4)) : 0;

  const totalPosts = postItems.length;
  const totalPostLikes = postItems.reduce((acc, p) => acc + p.likes, 0);
  const averagePostLikes = totalPosts > 0 ? Math.floor(totalPostLikes / totalPosts) : 0;
  
  const sortedPosts = [...postItems].sort((a, b) => b.likes - a.likes);
  const bestPost = sortedPosts[0] || null;
  const bestPostLikes = bestPost ? bestPost.likes : 0;
  const bestPostLink = bestPost ? bestPost.link : null;

  return {
    totalLikes,
    likesPerMonth,
    mostActiveLikeDay,
    totalComments,
    averageCommentLength,
    topCommentWords,
    topCommentEmojis,
    totalShares,
    mostUsedShareMethod,
    mostSharedContentType,
    totalReposts,
    repostToWatchRatio,
    totalPosts,
    totalPostLikes,
    averagePostLikes,
    bestPostLikes,
    bestPostLink
  };
}

export function calculateLiveStats(liveItems: NormalizedLiveItem[]): LiveStats {
  const hostSessions = liveItems.filter(l => l.isHost);
  const watchSessions = liveItems.filter(l => !l.isHost);

  const totalGoLiveSessions = hostSessions.length;
  const totalLiveViews = hostSessions.reduce((acc, l) => acc + (l.totalView || 0), 0);
  const totalLiveLikes = hostSessions.reduce((acc, l) => acc + (l.totalLike || 0), 0);

  let totalDurationSeconds = 0;
  let totalEarning = 0;

  for (const item of hostSessions) {
    if (item.startTime && item.endTime) {
      totalDurationSeconds += Math.floor((item.endTime.getTime() - item.startTime.getTime()) / 1000);
    }
    if (item.totalEarning) {
      totalEarning += item.totalEarning;
    }
  }

  const averageLiveDurationSeconds = totalGoLiveSessions > 0 ? Math.floor(totalDurationSeconds / totalGoLiveSessions) : 0;

  const watchedLiveRoomsCount = new Set(watchSessions.map(w => w.watchedRoomId).filter(Boolean)).size;

  return {
    totalGoLiveSessions,
    totalLiveViews,
    totalLiveLikes,
    averageLiveDurationSeconds,
    totalEarning,
    watchedLiveRoomsCount,
    liveCommentsCount: 0 // Fallback
  };
}
