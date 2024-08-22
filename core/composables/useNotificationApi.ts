import { useApiAuthInstance } from "@skeleton/core/assets/apiAuthInstance";
import type {INotificationsRequest, INotificationsResponse} from "@skeleton/core/types";

export const useCoreNotificationApi = () => {
  const getPlayerNotifications = async (params?: INotificationsRequest):Promise<INotificationsResponse> => {
    return await useApiAuthInstance('/api/notification/messenger/messages', { params });
  };

  return {
    getPlayerNotifications
  };
}
