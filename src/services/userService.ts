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
    const response = await apiInstance.put('/User/self-user', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (response.data.statusCode === 200) {
      console.log('Update self user success:', response.data.data);
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Update user failed');
    }
  } catch (error: any) {
    console.error('UpdateSelfUser error:', error);
    const message =
      error.response?.data?.message || error.response?.data?.error || 'Update user failure';
    throw new Error(message);
  }
};
