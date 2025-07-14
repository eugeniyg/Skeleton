import { useApiAuthInstance } from '@skeleton/core/assets/apiAuthInstance';
import type { INotificationsRequest, INotificationsResponse } from '@skeleton/core/types';

export const useCoreNotificationApi = () => {
  const getPlayerNotifications = async (params?: INotificationsRequest): Promise<INotificationsResponse> => {
    return await useApiAuthInstance('/api/notification/messenger/messages', { params });
  };

  const markMessagesAsRead = async (messageIds: string[]): Promise<{ totalUnread: number }> => {
    const { data } = await useApiAuthInstance('/api/notification/messenger/messages/read', {
      method: 'POST',
      body: { messageIds },
    });
    return data;
  };

  const removePlayerMessage = async (messageIds: string[]): Promise<{ totalUnread: number }> => {
    const { data } = await useApiAuthInstance('/api/notification/messenger/messages', {
      method: 'DELETE',
      body: { messageIds },
    });
    return data;
  };

  const markAllMessagesAsRead = async (): Promise<{ totalUnread: number }> => {
    const { data } = await useApiAuthInstance('/api/notification/messenger/messages/read/all', { method: 'POST' });
    return data;
  };

  return {
    getPlayerNotifications,
    markMessagesAsRead,
    removePlayerMessage,
    markAllMessagesAsRead,
  };
};
