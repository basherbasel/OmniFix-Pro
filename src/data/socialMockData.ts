import { SocialAccount, SocialPost, MarketingCampaign, AnalyticsDataPoint } from '../types';

export const MOCK_SOCIAL_ACCOUNTS: SocialAccount[] = [
  {
    id: 'acc-1',
    platform: 'instagram',
    username: 'tamkeen_pro',
    followersCount: 12500,
    status: 'connected',
    lastSyncAt: new Date().toISOString(),
  },
  {
    id: 'acc-2',
    platform: 'tiktok',
    username: 'tamkeen_digital',
    followersCount: 45000,
    status: 'connected',
    lastSyncAt: new Date().toISOString(),
  },
  {
    id: 'acc-3',
    platform: 'twitter',
    username: 'TamkeenPro',
    followersCount: 8900,
    status: 'expired',
    lastSyncAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  }
];

export const MOCK_CAMPAIGNS: MarketingCampaign[] = [
  {
    id: 'camp-1',
    name: 'إطلاق النسخة الجديدة V2',
    objective: 'awareness',
    status: 'active',
    startDate: '2026-09-01',
    endDate: '2026-09-30',
    postsCount: 12,
    totalEngagement: 5400,
  },
  {
    id: 'camp-2',
    name: 'حملة العودة للمدارس',
    objective: 'sales',
    status: 'paused',
    startDate: '2026-08-15',
    endDate: '2026-09-15',
    postsCount: 8,
    totalEngagement: 3200,
  }
];

export const MOCK_ANALYTICS: AnalyticsDataPoint[] = [
  { date: '2026-09-10', views: 4500, engagement: 450, conversions: 12 },
  { date: '2026-09-11', views: 5200, engagement: 510, conversions: 15 },
  { date: '2026-09-12', views: 4800, engagement: 420, conversions: 10 },
  { date: '2026-09-13', views: 6100, engagement: 680, conversions: 22 },
  { date: '2026-09-14', views: 7500, engagement: 820, conversions: 35 },
  { date: '2026-09-15', views: 8200, engagement: 950, conversions: 42 },
  { date: '2026-09-16', views: 9100, engagement: 1100, conversions: 50 },
];
