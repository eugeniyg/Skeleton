import { useFetchInstance } from './apiInstance';
import {
  ChangePasswordRequestInterface, FieldInterface, ProfileInterface, SessionInterface, SessionsResponseInterface,
} from './types';

const useProfileApi = () => {
  const getProfile = async ():Promise<ProfileInterface> => {
    const { data } = await useFetchInstance('/api/player/profile');
    return data;
  };

  const getProfileFields = async ():Promise<FieldInterface> => {
    const { data } = await useFetchInstance('/api/player/fields/validations?scenario=profile');
    return data;
  };

  const changeProfileData = async (profileData:any):Promise<ProfileInterface> => {
    const { data } = await useFetchInstance('/api/player/profile', { method: 'PUT', body: profileData });
    return data;
  };

  const changeProfilePassword = async (passwordData:ChangePasswordRequestInterface):Promise<ProfileInterface> => {
    const { data } = await useFetchInstance('/api/player/passwords', { method: 'PUT', body: passwordData });
    return data;
  };

  const getUserSessions = async (page: number, perPage: number):Promise<SessionsResponseInterface> => {
    const sessionsResponse = await useFetchInstance(`/api/player/sessions?page=${page}&perPage=${perPage}`);
    return sessionsResponse;
  };

  const closeActiveSession = async (sessionId: string):Promise<SessionInterface> => {
    const { data } = await useFetchInstance('/api/player/sessions/close', { method: 'PUT', body: { sessionId } });
    return data;
  };

  return {
    getProfile,
    getProfileFields,
    changeProfileData,
    changeProfilePassword,
    getUserSessions,
    closeActiveSession,
  };
};

export { useProfileApi };
