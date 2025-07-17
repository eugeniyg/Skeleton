import type {
  IChangePasswordRequest,
  ICreateLimit,
  IField,
  IPlayerLimit,
  IProfile,
  IResetPassword,
  IDocumentFile,
  ISession,
  ISessionsResponse,
  IUpdateLimit,
  IUploadFile,
  IPlayerLoyaltyAccount,
  ILoyaltyLevelsRequest,
  ILoyaltyLevelsResponse,
  ILiveChatToken,
} from '../types';
import { useApiAuthInstance } from '@skeleton/core/assets/apiAuthInstance';
import { useApiGuestInstance } from '@skeleton/core/assets/apiGuestInstance';

export const useCoreProfileApi = () => {
  const getProfile = async (): Promise<IProfile> => {
    const { data } = await useApiAuthInstance('/api/player/profile');
    return data;
  };

  const getSumsubToken = async (): Promise<{ token: string }> => {
    return await useApiAuthInstance('/api/player/services/sumsub/auth', { method: 'POST' });
  };

  const getProfileFields = async (): Promise<IField[]> => {
    const { data } = await useApiAuthInstance('/api/player/fields/validations', {
      params: { scenario: 'profile' },
    });
    return data;
  };

  const changeProfileData = async (profileData: any): Promise<IProfile> => {
    const { data } = await useApiAuthInstance('/api/player/profile', { method: 'PUT', body: profileData });
    return data;
  };

  const changeProfilePassword = async (passwordData: IChangePasswordRequest): Promise<IProfile> => {
    const { data } = await useApiAuthInstance('/api/player/passwords', { method: 'PUT', body: passwordData });
    return data;
  };

  const getUserSessions = async (page?: number, perPage?: number): Promise<ISessionsResponse> => {
    return await useApiAuthInstance('/api/player/sessions', { params: { page, perPage } });
  };

  const closeActiveSession = async (sessionId: string): Promise<ISession> => {
    const { data } = await useApiAuthInstance(`/api/player/sessions/${sessionId}/close`, { method: 'PUT' });
    return data;
  };

  const forgotProfilePassword = async (forgotData: { email: string }): Promise<{ message: string }> => {
    const { data } = await useApiGuestInstance('/api/player/passwords/reset', { method: 'POST', body: forgotData });
    return data;
  };

  const resetProfilePassword = async (resetData: IResetPassword): Promise<{ message: string }> => {
    const { data } = await useApiGuestInstance('/api/player/passwords/confirm', { method: 'POST', body: resetData });
    return data;
  };

  const resendVerifyEmail = async (): Promise<{ message: string }> => {
    const { data } = await useApiAuthInstance('/api/player/profile/confirmations/email/resend', { method: 'POST' });
    return data;
  };

  const getDocumentFiles = async (): Promise<IDocumentFile[]> => {
    const { data } = await useApiAuthInstance('/api/player/documents');
    return data;
  };

  const uploadDocumentFile = async (fileData: IUploadFile): Promise<IDocumentFile> => {
    const body = new FormData();
    Object.keys(fileData).forEach(key => {
      body.append(key, fileData[key]);
    });
    const { data } = await useApiAuthInstance('/api/player/documents', { method: 'POST', body });
    return data;
  };

  const deleteDocumentFile = async (id: string): Promise<IDocumentFile[]> => {
    const { data } = await useApiAuthInstance(`/api/player/documents/${id}`, { method: 'DELETE' });
    return data;
  };

  const getPlayerLimits = async (): Promise<IPlayerLimit[]> => {
    const { data } = await useApiAuthInstance('/api/player/limits');
    return data;
  };

  const createPlayerLimit = async (createData: ICreateLimit): Promise<IPlayerLimit> => {
    const { data } = await useApiAuthInstance('/api/player/limits', { method: 'POST', body: createData });
    return data;
  };

  const updatePlayerLimit = async ({ limitId, period, amount }: IUpdateLimit): Promise<IPlayerLimit> => {
    const { data } = await useApiAuthInstance(`/api/player/limits/${limitId}`, {
      method: 'PUT',
      body: { period, amount },
    });
    return data;
  };

  const deletePlayerLimit = async (limitId: string): Promise<IPlayerLimit> => {
    const { data } = await useApiAuthInstance(`/api/player/limits/${limitId}`, { method: 'DELETE' });
    return data;
  };

  const getPlayerLoyaltyAccount = async (): Promise<IPlayerLoyaltyAccount> => {
    const { data } = await useApiAuthInstance('/api/retention/account');
    return data;
  };

  const getLoyaltyLevels = async (params?: ILoyaltyLevelsRequest): Promise<ILoyaltyLevelsResponse> => {
    const response = await useApiGuestInstance('/api/retention/levels', { params });
    return response;
  };

  const getLiveChatToken = async (): Promise<ILiveChatToken> => {
    const { data } = await useApiAuthInstance('/api/player/integrations/livechat/token');
    return data;
  };

  const getFreshLiveChatToken = async (): Promise<ILiveChatToken> => {
    const { data } = await useApiAuthInstance('/api/player/integrations/livechat/fresh-token', {
      params: { returnUrl: window.location.origin },
    });
    return data;
  };

  const checkLiveChatToken = async (): Promise<boolean> => {
    const { data } = await useApiAuthInstance('/api/player/integrations/livechat/has-token');
    return data;
  };

  const invalidateLiveChatToken = async (): Promise<string> => {
    const { data } = await useApiAuthInstance('/api/player/integrations/livechat/token', { method: 'DELETE' });
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
    getDocumentFiles,
    uploadDocumentFile,
    deleteDocumentFile,
    getPlayerLimits,
    createPlayerLimit,
    updatePlayerLimit,
    deletePlayerLimit,
    getSumsubToken,
    getPlayerLoyaltyAccount,
    getLoyaltyLevels,
    getLiveChatToken,
    getFreshLiveChatToken,
    checkLiveChatToken,
    invalidateLiveChatToken,
  };
};
