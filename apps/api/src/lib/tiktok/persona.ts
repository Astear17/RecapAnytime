import { PersonaResult } from '@recapanytime/shared';
import { WatchStats, SearchStats, LiveStats, SpendingStats, EngagementStats } from '@recapanytime/shared';

export function determinePersona(
  watch: WatchStats,
  searches: SearchStats,
  live: LiveStats,
  spending: SpendingStats,
  engagement: EngagementStats
): PersonaResult {
  const scores: Record<string, number> = {
    'Night Scroller': 0,
    'Search Detective': 0,
    'Live Dweller': 0,
    'Like Machine': 0,
    'Comment Warrior': 0,
    'Silent Watcher': 0,
    'Shopaholic Scroller': 0,
    'Creator Mode': 0,
    'Deep Diver': 0,
    'Chaos Reposter': 0
  };

  const reasons: Record<string, string[]> = {
    'Night Scroller': [],
    'Search Detective': [],
    'Live Dweller': [],
    'Like Machine': [],
    'Comment Warrior': [],
    'Silent Watcher': [],
    'Shopaholic Scroller': [],
    'Creator Mode': [],
    'Deep Diver': [],
    'Chaos Reposter': []
  };

  // 1. Night Scroller
  const nightHour = watch.mostActiveHour !== null && (watch.mostActiveHour >= 22 || watch.mostActiveHour <= 4);
  if (nightHour) {
    scores['Night Scroller'] += 5;
    reasons['Night Scroller'].push('Giờ hoạt động mạnh nhất của bạn rơi vào khoảng đêm muộn (22h - 4h sáng).');
  }

  // 2. Search Detective
  if (watch.totalVideos > 0) {
    const searchRatio = searches.totalSearches / watch.totalVideos;
    if (searchRatio > 0.05 || searches.totalSearches > 200) {
      scores['Search Detective'] += 4;
      reasons['Search Detective'].push(`Bạn tra cứu nhiều thông tin với tổng cộng ${searches.totalSearches} lượt tìm kiếm.`);
    }
  }

  // 3. Live Dweller
  if (live.watchedLiveRoomsCount > 50 || live.totalGoLiveSessions > 0) {
    scores['Live Dweller'] += 4;
    reasons['Live Dweller'].push(`Tương tác với phòng LIVE tích cực: đã xem qua ${live.watchedLiveRoomsCount} phòng livestream.`);
  }

  // 4. Like Machine
  if (watch.totalVideos > 0) {
    const likeRatio = engagement.totalLikes / watch.totalVideos;
    if (likeRatio > 0.1 || engagement.totalLikes > 1000) {
      scores['Like Machine'] += 4;
      reasons['Like Machine'].push(`Thả tim cực kỳ hào phóng với ${engagement.totalLikes} lượt thích.`);
    }
  }

  // 5. Comment Warrior
  if (engagement.totalComments > 50) {
    scores['Comment Warrior'] += 4;
    reasons['Comment Warrior'].push(`Tích cực góp vui dưới phần bình luận với tổng cộng ${engagement.totalComments} comment.`);
  }

  // 6. Silent Watcher
  if (watch.totalVideos > 500 && engagement.totalLikes < 50 && engagement.totalComments < 5) {
    scores['Silent Watcher'] += 5;
    reasons['Silent Watcher'].push('Lặng lẽ quan sát thế giới, rất ít khi thả tim hay bình luận dạo.');
  }

  // 7. Shopaholic Scroller
  if (spending.orderCount > 5 || spending.totalSpendVnd !== null) {
    scores['Shopaholic Scroller'] += 5;
    reasons['Shopaholic Scroller'].push(`Chốt đơn không ngơi tay! Đã đặt ${spending.orderCount} đơn hàng trên TikTok Shop.`);
  }

  // 8. Creator Mode
  if (engagement.totalPosts > 0 || live.totalGoLiveSessions > 0) {
    scores['Creator Mode'] += 5;
    reasons['Creator Mode'].push(`Tự tin sáng tạo nội dung với ${engagement.totalPosts} video đã đăng.`);
  }

  // 9. Deep Diver
  if (watch.longestSessionSeconds > 1800 || watch.averageSessionSeconds > 300) {
    scores['Deep Diver'] += 4;
    reasons['Deep Diver'].push(`Lướt say mê quên lối về. Phiên lướt dài nhất của bạn lên tới ${Math.floor(watch.longestSessionSeconds / 60)} phút.`);
  }

  // 10. Chaos Reposter
  if (engagement.totalReposts > 100 || engagement.repostToWatchRatio > 0.08) {
    scores['Chaos Reposter'] += 4;
    reasons['Chaos Reposter'].push(`Repost nhiệt tình chia sẻ niềm vui: đã repost ${engagement.totalReposts} video.`);
  }

  // Find highest score
  let bestPersona = 'Silent Watcher';
  let maxScore = -1;

  for (const [p, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      bestPersona = p;
    }
  }

  // Descriptions for each
  const details: Record<string, { title: string; subtitle: string; description: string }> = {
    'Night Scroller': {
      title: 'Night Scroller',
      subtitle: 'Kẻ Gác Đêm TikTok',
      description: 'Lướt màn hình khi cả thế giới đã ngủ. Đối với bạn, TikTok thú vị nhất là sau 12 giờ đêm.'
    },
    'Search Detective': {
      title: 'Search Detective',
      subtitle: 'Thám Tử Tìm Kiếm',
      description: 'Coi TikTok như một thanh công cụ tìm kiếm khổng lồ. Bạn không chỉ lướt, bạn tra cứu mọi thứ.'
    },
    'Live Dweller': {
      title: 'Live Dweller',
      subtitle: 'Cư Dân Livestream',
      description: 'Bạn thích trò chuyện tương tác trực tiếp. Các phòng livestream chính là nhà của bạn.'
    },
    'Like Machine': {
      title: 'Like Machine',
      subtitle: 'Máy Thả Tim',
      description: 'Hào phóng trao đi tình yêu thương. Gần như video nào lướt qua bạn cũng bấm tim khích lệ.'
    },
    'Comment Warrior': {
      title: 'Comment Warrior',
      subtitle: 'Chiến Thần Bình Luận',
      description: 'Không thể giữ im lặng. Ý kiến và những bình luận hóm hỉnh của bạn có mặt ở khắp mọi nơi.'
    },
    'Silent Watcher': {
      title: 'Silent Watcher',
      subtitle: 'Kẻ Quan Sát Thầm Lặng',
      description: 'Lướt qua hàng ngàn video nhưng hiếm khi để lại dấu vết. Bạn thích đứng sau hậu trường quan sát.'
    },
    'Shopaholic Scroller': {
      title: 'Shopaholic Scroller',
      subtitle: 'Chiến Thần Chốt Đơn',
      description: 'Coi TikTok Shop là trung tâm mua sắm yêu thích. Xem review là chốt đơn không cần suy nghĩ nhiều.'
    },
    'Creator Mode': {
      title: 'Creator Mode',
      subtitle: 'Nhà Sáng Tạo Xu Hướng',
      description: 'Bạn không chỉ tiêu thụ nội dung, bạn tạo ra nó. Luôn sẵn sàng đăng tải và chia sẻ góc nhìn.'
    },
    'Deep Diver': {
      title: 'Deep Diver',
      subtitle: 'Thợ Lặn Trải Nghiệm',
      description: 'Lướt TikTok cực kỳ tập trung với những phiên lướt siêu dài, đắm mình hoàn toàn vào các nội dung chuyên sâu.'
    },
    'Chaos Reposter': {
      title: 'Chaos Reposter',
      subtitle: 'Kẻ Lan Tỏa Tiếng Cười',
      description: 'Nút repost là nút được bấm nhiều nhất. Bạn luôn muốn bạn bè của mình xem ngay những gì bạn thấy buồn cười.'
    }
  };

  const finalDetail = details[bestPersona];
  const finalReasons = reasons[bestPersona].length > 0 ? reasons[bestPersona] : ['Thói quen lướt TikTok cân bằng và ổn định.'];

  return {
    id: bestPersona.toLowerCase().replace(/\s+/g, '-'),
    title: finalDetail.title,
    subtitle: finalDetail.subtitle,
    description: finalDetail.description,
    score: maxScore,
    reasons: finalReasons
  };
}
