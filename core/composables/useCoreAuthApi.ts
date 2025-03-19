import type {
  IAuthorizationRequest,
  IAuthorizationResponse,
  IField,
  IOtpRequest,
  IPhoneVerification,
  ISocialAuthorizationRequest,
} from '../types';
import { useApiGuestInstance } from '@skeleton/core/assets/apiGuestInstance';
import { useApiAuthInstance } from '@skeleton/core/assets/apiAuthInstance';

export const useCoreAuthApi = () => {
  const getRegistrationFields = async (): Promise<IField[]> => {
    const { data } = await useApiGuestInstance('/api/player/fields/validations', {
      params: { scenario: 'registration' },
    });
    return data;
  };

  const submitRegistrationData = async (registrationFormData: any): Promise<IAuthorizationResponse> => {
    const { data } = await useApiGuestInstance('/api/player/register', {
      method: 'POST',
      body: registrationFormData,
    });

    return data;
  };

  const submitLoginData = async (authorizationFormData: IAuthorizationRequest): Promise<IAuthorizationResponse> => {
    const { data } = await useApiGuestInstance('/api/player/sessions', {
      method: 'POST',
      body: authorizationFormData,
    });

    return data;
  };

  const submitAutologinData = async (autoLoginData: {
    token: string;
    fingerprint?: string;
  }): Promise<IAuthorizationResponse> => {
    const { data } = await useApiGuestInstance('/api/player/sessions/token', {
      method: 'POST',
      body: autoLoginData,
    });

    return data;
  };

  const refreshToken = async (): Promise<IAuthorizationResponse> => {
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

  const logOut = async (): Promise<{ message: string }> => {
    const { data } = await useApiAuthInstance('/api/player/sessions/logout', {
      method: 'POST',
    });

    return data;
  };

  const submitSocialLoginData = async (
    code: string,
    socialAuthData: ISocialAuthorizationRequest
  ): Promise<IAuthorizationResponse> => {
    const { data } = await useApiGuestInstance(`/api/player/sessions/social?code=${code}`, {
      method: 'POST',
      body: socialAuthData,
    });

    return data;
  };

  const sendOtp = async (otpData: IOtpRequest): Promise<{ message: string }> => {
    const { data } = await useApiAuthInstance('/api/player/otp/send', {
      method: 'POST',
      body: otpData,
    });

    return data;
  };

  const registerByPhone = async (registrationFormData: any): Promise<IAuthorizationResponse> => {
    const { data } = await useApiGuestInstance('/api/player/register/phone', {
      method: 'POST',
      body: registrationFormData,
    });

    return data;
  };

  const phoneVerification = async (verificationData: IPhoneVerification): Promise<{ code: string }> => {
    const { data } = await useApiAuthInstance('/api/player/otp/verify', {
      method: 'POST',
      body: verificationData,
    });

    return data;
  };

  return {
    getRegistrationFields,
    submitRegistrationData,
    submitLoginData,
    submitAutologinData,
    refreshToken,
    logOut,
    submitSocialLoginData,
    sendOtp,
    registerByPhone,
    phoneVerification,
  };
};
