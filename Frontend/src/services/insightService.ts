import api from '@/api/axios';

export interface Insight {
  _id: string;
  title: string;
  description: string;
  investBeansInsight: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  category?: string;
  marketType: 'domestic' | 'global';
  views?: number;
  likes?: number;
  isLiked?: boolean;
  readTime?: string;
  isPublished?: boolean;
  publishedAt?: string;
  author?: {
    _id: string;
    name: string;
    email: string;
  };
  credits?: {
    source: string;
    author?: string;
    url?: string;
    publishedDate?: string;
  };
}

export interface InsightResponse {
  insights: Insight[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface LikeResponse {
  likes: number;
  isLiked: boolean;
}

// Get all published insights
export const getAllInsights = async (
  marketType: 'domestic' | 'global',
  limit: number = 100,
  page: number = 1
): Promise<InsightResponse> => {
  const response = await api.get('/insights', {
    params: {
      marketType,
      limit,
      page,
    },
  });
  return response.data.data;
};

// Get single insight by ID
export const getInsightById = async (id: string): Promise<Insight> => {
  const response = await api.get(`/insights/${id}`);
  return response.data.data;
};

// Toggle like on insight
export const toggleInsightLike = async (id: string): Promise<LikeResponse> => {
  try {
    const response = await api.post(`/insights/${id}/like`);
    
    // Validate response structure
    if (!response.data?.success) {
      throw new Error(response.data?.message || 'Failed to toggle like');
    }

    if (!response.data?.data || typeof response.data.data.likes !== 'number' || typeof response.data.data.isLiked !== 'boolean') {
      throw new Error('Invalid response format from server');
    }

    return response.data.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      // Check for authentication errors
      if (error.message.includes('401') || error.message.includes('Unauthorized')) {
        throw new Error('Please login to like insights');
      }
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
};

// Get admin insights
export const getAdminInsights = async (
  params: Record<string, unknown> = {}
): Promise<InsightResponse> => {
  const response = await api.get('/insights/admin/all', { params });
  return response.data.data;
};

// Create insight (admin only)
export const createInsight = async (insightData: Partial<Insight>): Promise<Insight> => {
  const response = await api.post('/insights/admin/create', insightData);
  return response.data.data;
};

// Update insight (admin only)
export const updateInsight = async (
  id: string,
  insightData: Partial<Insight>
): Promise<Insight> => {
  const response = await api.put(`/insights/admin/${id}`, insightData);
  return response.data.data;
};

// Delete insight (admin only)
export const deleteInsight = async (id: string): Promise<void> => {
  await api.delete(`/insights/admin/${id}`);
};

// Get insight statistics (admin only)
export const getInsightStats = async (): Promise<Record<string, unknown>> => {
  const response = await api.get('/insights/admin/stats');
  return response.data.data;
};

// Toggle publish status (admin only)
export const togglePublishStatus = async (id: string): Promise<Insight> => {
  const response = await api.patch(`/insights/admin/${id}/toggle-publish`);
  return response.data.data;
};
