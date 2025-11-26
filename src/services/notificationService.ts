import {
  SendNotificationRequest,
  SendTaskCommentNotificationRequest,
} from '@/interfaces/notification';
import { apiInstance } from '../api/apiInstance';

export const sendNotification = async (data: SendNotificationRequest): Promise<any> => {
  try {
    console.log('📤 Sending notification:', data);

    const response = await apiInstance.post('/notifications/send', data);

    if (response.data?.statusCode === 200) {
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

export const MarkAsReadNotification = async (notificationId: string): Promise<any> => {
  try {
    const response = await apiInstance.put(`/notifications/${notificationId}/read`);

    if (response.data?.statusCode === 200) {
      console.log('✅ Notification marked as read successfully');
      return response.data;
    } else {
      throw new Error(response.data?.message || 'Mark as read notification failed');
    }
  } catch (error: any) {
    console.error('❌ Mark as read notification error:', error);

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Mark as read notification failed';
    throw new Error(message);
  }
};

export const GetNotifications = async (): Promise<any> => {
  try {
    const response = await apiInstance.get(`/notifications/user`);
    if (response.data?.statusCode === 200) {
      return response.data.data;
    } else {
      throw new Error(response.data?.message || 'Fetch notifications failed');
    }
  } catch (error: any) {
    console.error('❌ Fetch notifications error:', error);
    const message =
      error.response?.data?.message || error.response?.data?.error || 'Fetch notifications failed';
    throw new Error(message);
  }
};

export const sendTaskCommentNotification = async (
  taskId: string,
  data: SendTaskCommentNotificationRequest,
): Promise<any> => {
  try {
    console.log('Sending task comment notification:', taskId, data);

    const response = await apiInstance.post(`/notifications/send/task/${taskId}`, data);

    if (response.data?.statusCode === 200) {
      return response.data;
    } else {
      throw new Error(response.data?.message || 'Send notification failed');
    }
  } catch (error: any) {
    console.error('Send notification error:', error);

    const message =
      error.response?.data?.message || error.response?.data?.error || 'Send notification failed';

    throw new Error(message);
  }
};
