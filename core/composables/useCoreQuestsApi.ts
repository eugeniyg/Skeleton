import type {
  IPlayerQuestsRequest,
  IPlayerQuestsResponse
} from '../types';
import { useApiAuthInstance } from "@skeleton/core/assets/apiAuthInstance";

export const useCoreQuestApi = () => {
  const getPlayerQuests = async (params?: IPlayerQuestsRequest):Promise<IPlayerQuestsResponse> => {
    return await useApiAuthInstance('/api/retention/quests', { params });
  };

  return {
    getPlayerQuests
  };
}
