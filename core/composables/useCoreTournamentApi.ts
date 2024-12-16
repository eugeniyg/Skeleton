import type { ITournament, ITournamentsRequest, ITournamentsResponse } from '@skeleton/core/types/tournamentsTypes';
import { useApiGuestInstance } from '@skeleton/core/assets/apiGuestInstance';
import { useApiAuthInstance } from '@skeleton/core/assets/apiAuthInstance';

export const useCoreTournamentsApi = () => {
  const getTournaments = async (params?: ITournamentsRequest): Promise<ITournamentsResponse> => {
    return await useApiGuestInstance('/api/retention/tournaments', { params });
  };

  const getTournament = async (params: { tournamentId: string; authorized: boolean }): Promise<ITournament> => {
    const { data } = params.authorized
      ? await useApiAuthInstance(`/api/retention/tournaments/${params.tournamentId}`)
      : await useApiGuestInstance(`/api/retention/tournaments/${params.tournamentId}`);
    return data;
  };

  const participateTournament = async (tournamentId: string): Promise<void> => {
    await useApiAuthInstance(`/api/retention/tournaments/${tournamentId}/participate`, {
      method: 'POST',
    });
  };

  return {
    getTournaments,
    getTournament,
    participateTournament,
  };
};
