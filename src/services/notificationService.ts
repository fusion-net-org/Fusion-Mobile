import { SendNotificationRequest } from '@/interfaces/notification';
import { apiInstance } from '../api/apiInstance';

export const sendNotification = async (data: SendNotificationRequest): Promise<any> => {
  try {
    console.log('📤 Sending notification:', data);

    const response = await apiInstance.post('/notifications/send', data);

    if (response.data?.statusCode === 200) {
      console.log('✅ Notification sent successfully');
      return response.data;
    } else {
      throw new Error(response.data?.message || 'Send notification failed');
    }
  } catch (error: any) {
    console.error('❌ Send notification error:', error);

    const message =
      error.response?.data?.message || error.response?.data?.error || 'Send notification failed';

    throw new Error(message);
  }
};
