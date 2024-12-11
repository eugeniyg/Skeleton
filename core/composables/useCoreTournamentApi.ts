import type {
  ITournamentDefinite,
  ITournamentsRequest,
  ITournamentsResponse,
} from '@skeleton/core/types/tournamentsTypes';
import { useApiGuestInstance } from '@skeleton/core/assets/apiGuestInstance';
import { useApiAuthInstance } from '@skeleton/core/assets/apiAuthInstance';
import type { IPlayerQuest } from '@skeleton/core/types';

export const useCoreTournamentsApi = () => {
  const getTournaments = async (params?: ITournamentsRequest): Promise<ITournamentsResponse> => {
    return await useApiGuestInstance('/api/retention/tournaments', { params });
  };

  const getTournament = async (params: { tournamentId: string; authorized: boolean }): Promise<ITournamentDefinite> => {
    const { data } = params.authorized
      ? await useApiAuthInstance(`/api/retention/tournaments/${params.tournamentId}`)
      : await useApiGuestInstance(`/api/retention/tournaments/${params.tournamentId}`);
    return data;
  };

  const participateTournament = async (tournamentId: string): Promise<IPlayerQuest> => {
    const { data } = await useApiAuthInstance(`/api/retention/tournaments/${tournamentId}/participate`, {
      method: 'POST',
    });
    return data;
  };

  return {
    getTournaments,
    getTournament,
    participateTournament,
  };
};
