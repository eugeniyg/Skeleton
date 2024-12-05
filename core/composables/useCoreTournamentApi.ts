import type { ITournamentsRequest, ITournamentsResponse } from '@skeleton/core/types/tournamentsTypes';
import { useApiGuestInstance } from '@skeleton/core/assets/apiGuestInstance';

export const useCoreTournamentsApi = () => {
  const getTournaments = async (params?: ITournamentsRequest): Promise<ITournamentsResponse> => {
    return await useApiGuestInstance('/api/retention/tournaments', { params });
  };

  return {
    getTournaments,
  };
};
