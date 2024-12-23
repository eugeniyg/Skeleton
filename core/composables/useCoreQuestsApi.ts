import type { IAvailableQuestsRequest, IPlayerQuest, IPlayerQuestsRequest, IPlayerQuestsResponse } from '../types';
import { useApiAuthInstance } from '@skeleton/core/assets/apiAuthInstance';

export const useCoreQuestApi = () => {
  const getAvailableQuests = async (params?: IAvailableQuestsRequest): Promise<IPlayerQuestsResponse> => {
    return await useApiAuthInstance('/api/retention/quests', { params });
  };

  const getPlayerQuests = async (params?: IPlayerQuestsRequest): Promise<IPlayerQuestsResponse> => {
    return await useApiAuthInstance('/api/retention/player-quests', { params });
  };

  const activatePlayerQuest = async (playerQuestId: string): Promise<IPlayerQuest> => {
    const { data } = await useApiAuthInstance(`/api/retention/quests/${playerQuestId}/activate`, { method: 'PUT' });
    return data;
  };

  const cancelPlayerQuest = async (playerQuestId: string): Promise<IPlayerQuest> => {
    const { data } = await useApiAuthInstance(`/api/retention/player-quests/${playerQuestId}/cancel`, {
      method: 'PUT',
    });
    return data;
  };

  return {
    getAvailableQuests,
    getPlayerQuests,
    activatePlayerQuest,
    cancelPlayerQuest,
  };
};
