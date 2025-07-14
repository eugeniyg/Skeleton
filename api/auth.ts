import type {
  IAuthorizationRequest,
  IAuthorizationResponse,
  IField,
  IOtpRequest,
  IPhoneVerification,
  ISocialAuthorizationRequest,
} from './types';
import { apiGuestInstance } from './apiGuestInstance';
import { apiAuthInstance } from './apiAuthInstance';

export const getRegistrationFields = async (): Promise<IField[]> => {
  const { data } = await apiGuestInstance('/api/player/fields/validations', {
    params: { scenario: 'registration' },
  });
  return data;
};

export const submitRegistrationData = async (registrationFormData: any): Promise<IAuthorizationResponse> => {
  const { data } = await apiGuestInstance('/api/player/register', {
    method: 'POST',
    body: registrationFormData,
  });

  return data;
};

export const submitLoginData = async (
  authorizationFormData: IAuthorizationRequest
): Promise<IAuthorizationResponse> => {
  const { data } = await apiGuestInstance('/api/player/sessions', {
    method: 'POST',
    body: authorizationFormData,
  });

  return data;
};

export const submitAutologinData = async (autoLoginData: {
  token: string;
  fingerprint?: string;
}): Promise<IAuthorizationResponse> => {
  const { data } = await apiGuestInstance('/api/player/sessions/token', {
    method: 'POST',
    body: autoLoginData,
  });

  return data;
};

export const refreshToken = async (): Promise<IAuthorizationResponse> => {
  const { getSessionToken } = useProfileStore();
  const token = getSessionToken();
  const { data }: { data: IAuthorizationResponse } = await $fetch('/api/player/sessions/refresh', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    method: 'POST',
  });

  return data;
};

export const logOut = async (): Promise<{ message: string }> => {
  const { data } = await apiAuthInstance('/api/player/sessions/logout', {
    method: 'POST',
  });

  return data;
};

export const submitSocialLoginData = async (
  socialAuthData: ISocialAuthorizationRequest
): Promise<IAuthorizationResponse> => {
  const { query, ...otherParams } = socialAuthData;
  const { data } = await apiGuestInstance(`/api/player/sessions/social`, {
    method: 'POST',
    params: query,
    body: otherParams,
  });

  return data;
};

export const sendOtp = async (otpData: IOtpRequest): Promise<{ message: string }> => {
  const { data } = await apiAuthInstance('/api/player/otp/send', {
    method: 'POST',
    body: otpData,
  });

  return data;
};

export const registerByPhone = async (registrationFormData: any): Promise<IAuthorizationResponse> => {
  const { data } = await apiGuestInstance('/api/player/register/phone', {
    method: 'POST',
    body: registrationFormData,
  });

  return data;
};

export const phoneVerification = async (verificationData: IPhoneVerification): Promise<{ code: string }> => {
  const { data } = await apiAuthInstance('/api/player/otp/verify', {
    method: 'POST',
    body: verificationData,
  });

  return data;
};
