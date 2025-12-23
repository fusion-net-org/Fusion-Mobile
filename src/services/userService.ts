import { AnalyticsUserResponse } from '@/interfaces/user';
import { apiInstance } from '../api/apiInstance';

export const getUserById = async (userId: string): Promise<any> => {
  try {
    const response = await apiInstance.get(`/User/${userId}`);
    if (response.data.statusCode === 200) {
      console.log(response.data);
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

export const changePasswordService = async (data: {
  confirmPassword?: string;
  currentPassword: string;
  newPassword: string;
}): Promise<any> => {
  try {
    const sendData = {
      oldPassword: data.currentPassword,
      newPassword: data.newPassword,
      confirmPassword: data.confirmPassword,
    };

    console.log(sendData);

    const response = await apiInstance.post('/User/change-password', sendData);

    if (response.data.statusCode === 200) {
      console.log('Change password success:', response.data);
      return response.data;
    } else {
      throw new Error(response.data.message || 'Change password failed');
    }
  } catch (error: any) {
    console.error('ChangePassword error:', error.response?.data || error.message);

    const message =
      error.response?.data?.message || error.response?.data?.error || 'Change password failure';

    throw new Error(message);
  }
};

export const updateSelfUser = async (formData: FormData): Promise<any> => {
  try {
    const response = await apiInstance.put('/User/self-user', formData);

    if (response.data.statusCode === 200) {
      console.log('Update self user success:', response.data.data);
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Update user failed');
    }
  } catch (error: any) {
    if (error.response) {
      console.error('[Axios Error Response]:', error.response.status);
    } else if (error.request) {
      console.error('Request:', error.request);
    } else {
      console.error('Message:', error.message);
    }
    console.error('[Axios Config]', error.config);

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Update user failure';

    throw new Error(message);
  }
};

export const getAnalyticsUser = async (): Promise<AnalyticsUserResponse> => {
  try {
    const response = await apiInstance.get(`User/analytics`);

    if (response.data?.statusCode === 200) {
      return response.data.data as AnalyticsUserResponse;
    } else {
      throw new Error(response.data?.message || 'Fetch Analytics User failed');
    }
  } catch (error: any) {
    console.error(' Fetch Analytics User error:', error);
    const message =
      error.response?.data?.message || error.response?.data?.error || 'Fetch Analytics User failed';
    throw new Error(message);
  }
};
