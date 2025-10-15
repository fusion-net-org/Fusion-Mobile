import { apiInstance } from '../api/apiInstance';

export const getUserById = async (userId: string): Promise<any> => {
  try {
    const response = await apiInstance.get(`/User/${userId}`);

    console.log('getUserById response:', response);

    if (response.data.statusCode === 200) {
      return response.data;
    } else {
      throw new Error(response.data.message || 'Get user failed');
    }
  } catch (error: any) {
    console.error('GetUserById error:', error);

    const message =
      error.response?.data?.message || error.response?.data?.error || 'Get user failure';

    throw new Error(message);
  }
};
