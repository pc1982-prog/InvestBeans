import api from '@/api/axios';

export interface HeaderSection {
  header: string;
  subHeader: string;
}

export type Blog = {
  _id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  headerSections: HeaderSection[];  
  tags: string[];
  blogImage: string;
  cloudinaryPublicId?: string;
  author: {
    _id: string;
    name: string;
    email: string;
  };
  isPublished: boolean;
  views: number;
  readTime: string;
  slug?: string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  likedBy: string[];
};

export type BlogParams = {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
  sort?: 'asc' | 'desc';
  startDate?: string;
  endDate?: string;
  author?: string;
  isPublished?: boolean | string;
};

export type BlogResponse = {
  blogs: Blog[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalBlogs: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  filters?: {
    search?: string;
    category?: string;
    sort?: string;
    startDate?: string;
    endDate?: string;
  };
};

export type LikeResponse = {
  likes: number;
  isLiked: boolean;
  likedBy: string[];
};

// Get all public blogs
export const getAllBlogs = async (params: BlogParams = {}): Promise<BlogResponse> => {
  const response = await api.get('/blogs', { params });
  return response.data.data;
};

// Get single blog by ID or slug
export const getBlogById = async (id: string): Promise<Blog> => {
  const response = await api.get(`/blogs/${id}`);
  return response.data.data;
};

// Get admin blogs (includes unpublished)
export const getAdminBlogs = async (params: BlogParams = {}): Promise<BlogResponse> => {
  const response = await api.get('/blogs/admin/all', { params });
  return response.data.data;
};

// Create blog (admin only)
export const createBlog = async (formData: FormData): Promise<Blog> => {
  const response = await api.post('/blogs/admin/create', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 30000,
  });
  return response.data.data;
};

// Update blog (admin only)
export const updateBlog = async (id: string, formData: FormData): Promise<Blog> => {
  const response = await api.put(`/blogs/admin/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 30000,
  });
  return response.data.data;
};

// Delete blog (admin only)
export const deleteBlog = async (id: string): Promise<void> => {
  await api.delete(`/blogs/admin/${id}`);
};

// Get blog statistics (admin only)
export const getBlogStats = async () => {
  const response = await api.get('/blogs/admin/stats');
  return response.data.data;
};

// Toggle like (requires authentication)
export const toggleLike = async (blogId: string): Promise<LikeResponse> => {
  const response = await api.post(`/blogs/${blogId}/like`);
  return response.data.data;
};