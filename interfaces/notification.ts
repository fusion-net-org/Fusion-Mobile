export interface NotificationState {
  isSending: boolean;
  isSent: boolean;
  error: string | null;
  lastSentAt: string | null;
}

export interface SendNotificationRequest {
  userId: string;
  title: string;
  body?: string;
  linkKey?: string;
  idLink?: string;
  event?: string;
  context?: string;
  notificationType?: string;
}
