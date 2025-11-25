import api from '@/api/axios';

export interface BeanOfWisdom {
  _id: string;
  avatarText: string;
  title: string;
  subtitle: string;
  sectionTitle: string;
  description: string;
  keyPrinciple: string;
  quote: string;
  insightTag: string;
  insightText: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface FieldLimits {
  avatarText: number;
  title: number;
  subtitle: number;
  sectionTitle: number;
  description: number;
  keyPrinciple: number;
  quote: number;
  insightTag: number;
  insightText: number;
  tags: number;
}

/**
 * Get all beans (public access)
 */
export const getAllBeans = async (): Promise<BeanOfWisdom[]> => {
  try {
    const response = await api.get('/beans-of-wisdom');
    return response.data.data || [];
  } catch (error: any) {
    console.error('Error fetching beans:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch beans';
    throw new Error(errorMessage);
  }
};

/**
 * Get a specific bean by ID (public access)
 */
export const getBeanById = async (id: string): Promise<BeanOfWisdom> => {
  try {
    const response = await api.get(`/beans-of-wisdom/${id}`);
    return response.data.data;
  } catch (error: any) {
    console.error('Error fetching bean:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch bean';
    throw new Error(errorMessage);
  }
};

/**
 * Update a bean (Admin only)
 */
export const updateBean = async (id: string, beanData: Partial<BeanOfWisdom>): Promise<BeanOfWisdom> => {
  try {
    const response = await api.put(`/beans-of-wisdom/${id}`, beanData);
    return response.data.data;
  } catch (error: any) {
    console.error('Error updating bean:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Failed to update bean';
    throw new Error(errorMessage);
  }
};

/**
 * Delete a bean (Admin only)
 */
export const deleteBean = async (id: string): Promise<void> => {
  try {
    await api.delete(`/beans-of-wisdom/${id}`);
  } catch (error: any) {
    console.error('Error deleting bean:', error);
    const errorMessage = error.response?.data?.message || error.message || 'Failed to delete bean';
    throw new Error(errorMessage);
  }
};

/**
 * Get character limits for form validation (public access)
 */
export const getFieldLimits = async (): Promise<FieldLimits> => {
  try {
    const response = await api.get('/beans-of-wisdom/limits');
    return response.data.data;
  } catch (error: any) {
    console.error('Error fetching field limits:', error);
    // Return default limits if API fails
    return {
      avatarText: 10,
      title: 200,
      subtitle: 300,
      sectionTitle: 150,
      description: 500,
      keyPrinciple: 120,
      quote: 200,
      insightTag: 50,
      insightText: 250,
      tags: 30,
    };
  }
};

/**
 * Check if a bean already exists (public access)
 */
export const checkBeanExists = async (): Promise<{ exists: boolean; bean: BeanOfWisdom | null }> => {
  try {
    const response = await api.get('/beans-of-wisdom/check/exists');
    return response.data.data;
  } catch (error: any) {
    console.error('Error checking bean existence:', error);
    return { exists: false, bean: null };
  }
};