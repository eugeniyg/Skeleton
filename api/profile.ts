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
} from './types';
import { apiGuestInstance } from './apiGuestInstance';
import { apiAuthInstance } from './apiAuthInstance';

export const getProfile = async (): Promise<IProfile> => {
  const { data } = await apiAuthInstance('/api/player/profile');
  return data;
};

export const getSumsubToken = async (): Promise<{ token: string }> => {
  return await apiAuthInstance('/api/player/services/sumsub/auth', { method: 'POST' });
};

export const getProfileFields = async (): Promise<IField[]> => {
  const { data } = await apiAuthInstance('/api/player/fields/validations', {
    params: { scenario: 'profile' },
  });
  return data;
};

export const changeProfileData = async (profileData: any): Promise<IProfile> => {
  const { data } = await apiAuthInstance('/api/player/profile', { method: 'PUT', body: profileData });
  return data;
};

export const changeProfilePassword = async (passwordData: IChangePasswordRequest): Promise<IProfile> => {
  const { data } = await apiAuthInstance('/api/player/passwords', { method: 'PUT', body: passwordData });
  return data;
};

export const getUserSessions = async (page?: number, perPage?: number): Promise<ISessionsResponse> => {
  return await apiAuthInstance('/api/player/sessions', { params: { page, perPage } });
};

export const closeActiveSession = async (sessionId: string): Promise<ISession> => {
  const { data } = await apiAuthInstance(`/api/player/sessions/${sessionId}/close`, { method: 'PUT' });
  return data;
};

export const forgotProfilePassword = async (forgotData: { email: string }): Promise<{ message: string }> => {
  const { data } = await apiGuestInstance('/api/player/passwords/reset', { method: 'POST', body: forgotData });
  return data;
};

export const resetProfilePassword = async (resetData: IResetPassword): Promise<{ message: string }> => {
  const { data } = await apiGuestInstance('/api/player/passwords/confirm', { method: 'POST', body: resetData });
  return data;
};

export const resendVerificationEmail = async (): Promise<{ message: string }> => {
  const { data } = await apiAuthInstance('/api/player/profile/confirmations/email/resend', { method: 'POST' });
  return data;
};

export const getDocumentFiles = async (): Promise<IDocumentFile[]> => {
  const { data } = await apiAuthInstance('/api/player/documents');
  return data;
};

export const uploadDocumentFile = async (fileData: IUploadFile): Promise<IDocumentFile> => {
  const body = new FormData();
  Object.keys(fileData).forEach(key => {
    body.append(key, fileData[key]);
  });
  const { data } = await apiAuthInstance('/api/player/documents', { method: 'POST', body });
  return data;
};

export const deleteDocumentFile = async (id: string): Promise<IDocumentFile[]> => {
  const { data } = await apiAuthInstance(`/api/player/documents/${id}`, { method: 'DELETE' });
  return data;
};

export const getPlayerLimits = async (): Promise<IPlayerLimit[]> => {
  const { data } = await apiAuthInstance('/api/player/limits');
  return data;
};

export const createPlayerLimit = async (createData: ICreateLimit): Promise<IPlayerLimit> => {
  const { data } = await apiAuthInstance('/api/player/limits', { method: 'POST', body: createData });
  return data;
};

export const updatePlayerLimit = async ({ limitId, period, amount }: IUpdateLimit): Promise<IPlayerLimit> => {
  const { data } = await apiAuthInstance(`/api/player/limits/${limitId}`, {
    method: 'PUT',
    body: { period, amount },
  });
  return data;
};

export const deletePlayerLimit = async (limitId: string): Promise<IPlayerLimit> => {
  const { data } = await apiAuthInstance(`/api/player/limits/${limitId}`, { method: 'DELETE' });
  return data;
};
