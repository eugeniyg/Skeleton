import type { INotificationsRequest, INotificationsResponse } from './types';
import { apiAuthInstance } from './apiAuthInstance';

export const getPlayerNotifications = async (params?: INotificationsRequest): Promise<INotificationsResponse> => {
  return await apiAuthInstance('/api/notification/messenger/messages', { params });
};

export const markMessagesAsRead = async (messageIds: string[]): Promise<{ totalUnread: number }> => {
  const { data } = await apiAuthInstance('/api/notification/messenger/messages/read', {
    method: 'POST',
    body: { messageIds },
  });
  return data;
};

export const removePlayerMessage = async (messageIds: string[]): Promise<{ totalUnread: number }> => {
  const { data } = await apiAuthInstance('/api/notification/messenger/messages', {
    method: 'DELETE',
    body: { messageIds },
  });
  return data;
};

export const markAllMessagesAsRead = async (): Promise<{ totalUnread: number }> => {
  const { data } = await apiAuthInstance('/api/notification/messenger/messages/read/all', { method: 'POST' });
  return data;
};
