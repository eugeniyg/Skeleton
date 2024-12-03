import { useApiAuthInstance } from '@skeleton/core/assets/apiAuthInstance';
import type { ITournamentsRequest, ITournamentsResponse } from '@skeleton/core/types/tournamentsTypes';

export const useCoreTournamentsApi = () => {
  const getTournaments = async (params?: ITournamentsRequest): Promise<ITournamentsResponse> => {
    return await useApiAuthInstance('/api/retention/tournaments', { params });
  };

  return {
    getTournaments,
  };
};
