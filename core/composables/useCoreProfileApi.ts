import {
  IChangePasswordRequest,
  ICreateLimit,
  IField,
  IPlayerLimit,
  IProfile,
  IResetPassword,
  ISecurityFile,
  ISession,
  ISessionsResponse,
  IUpdateLimit,
  IUploadFile
} from '../types';
import {useFetchInstance} from '../assets/apiInstance';

export const useCoreProfileApi = () => {
  const getProfile = async ():Promise<IProfile> => {
    const { data } = await useFetchInstance('/api/player/profile');
    return data;
  };

  const getProfileFields = async ():Promise<IField[]> => {
    const { data } = await useFetchInstance('/api/player/fields/validations', {
      params: { scenario: 'profile' }
    });
    return data;
  };

  const changeProfileData = async (profileData:any):Promise<IProfile> => {
    const { data } = await useFetchInstance('/api/player/profile', { method: 'PUT', body: profileData });
    return data;
  };

  const changeProfilePassword = async (passwordData:IChangePasswordRequest):Promise<IProfile> => {
    const { data } = await useFetchInstance('/api/player/passwords', { method: 'PUT', body: passwordData });
    return data;
  };

  const getUserSessions = async (page?: number, perPage?: number):Promise<ISessionsResponse> => {
    return await useFetchInstance('/api/player/sessions', {params: {page, perPage}});
  };

  const closeActiveSession = async (sessionId: string):Promise<ISession> => {
    const { data } = await useFetchInstance(`/api/player/sessions/${sessionId}/close`, { method: 'PUT' });
    return data;
  };

  const forgotProfilePassword = async (forgotData: {email: string}):Promise<{ message: string }> => {
    const { data } = await useFetchInstance('/api/player/passwords/reset', { method: 'POST', body: forgotData });
    return data;
  };

  const resetProfilePassword = async (resetData: IResetPassword):Promise<{ message: string }> => {
    const { data } = await useFetchInstance('/api/player/passwords/confirm', { method: 'POST', body: resetData });
    return data;
  };

  const resendVerifyEmail = async ():Promise<{ message: string }> => {
    const { data } = await useFetchInstance('/api/player/profile/confirmations/email/resend', { method: 'POST' });
    return data;
  };

  const getSecurityFiles = async ():Promise<ISecurityFile[]> => {
    const { data } = await useFetchInstance('/api/player/documents');
    return data;
  };

  const uploadSecurityFile = async (fileData: IUploadFile):Promise<ISecurityFile[]> => {
    const body = new FormData();
    Object.keys(fileData).forEach((key) => {
      body.append(key, fileData[key])
    });
    const { data } = await useFetchInstance('/api/player/documents', { method: 'POST', body });
    return data;
  };

  const deleteSecurityFile = async (id: string):Promise<ISecurityFile[]> => {
    const { data } = await useFetchInstance(`/api/player/documents/${id}`, { method: 'DELETE' });
    return data;
  };

  const getPlayerLimits = async ():Promise<IPlayerLimit[]> => {
    const { data } = await useFetchInstance('/api/player/limits');
    return data;
  };

  const createPlayerLimit = async (createData: ICreateLimit):Promise<IPlayerLimit> => {
    const { data } = await useFetchInstance('/api/player/limits', { method: 'POST', body: createData });
    return data;
  };

  const updatePlayerLimit = async ({ limitId, period, amount }: IUpdateLimit):Promise<IPlayerLimit> => {
    const { data } = await useFetchInstance(`/api/player/limits/${limitId}`, {
      method: 'PUT',
      body: { period, amount }
    });
    return data;
  };

  const deletePlayerLimit = async (limitId: string):Promise<IPlayerLimit> => {
    const { data } = await useFetchInstance(`/api/player/limits/${limitId}`, { method: 'DELETE' });
    return data;
  };

  return {
    getProfile,
    getProfileFields,
    changeProfileData,
    changeProfilePassword,
    getUserSessions,
    closeActiveSession,
    forgotProfilePassword,
    resetProfilePassword,
    resendVerifyEmail,
    getSecurityFiles,
    uploadSecurityFile,
    deleteSecurityFile,
    getPlayerLimits,
    createPlayerLimit,
    updatePlayerLimit,
    deletePlayerLimit
  };
}
