import type { IPaginationMeta } from './globalTypes';

export interface IProfile extends Record<string, any> {
  id: string;
  status: number;
  email: string | null;
  phone: string | null;
  currency: string | null;
  country: string | null;
  birthdate: string | null;
  firstName: string | null;
  lastName: string | null;
  nickname: string | null;
  gender: string | null;
  nationality: string | null;
  placeOfBirth: string | null;
  address: string | null;
  timeZone: string | null;
  profession: string | null;
  receiveEmailPromo: boolean;
  receiveSmsPromo: boolean;
  agreedTc: boolean;
  confirmedAt: string | null;
  createdAt: string | null;
  city: string | null;
  additionalAddress: string | null;
  postalCode: string | null;
  personalIdNumber: string | null;
  securityQuestion: string | null;
  securityAnswer: string | null;
  locale: string | null;
  freshchatRestoreId: string | null;
  segmentIds: string[];
  isNewlyRegistered: boolean;
  phoneConfirmed: boolean;
  pwaInstalled: boolean;
}

export interface IAuthorizationRequest extends Record<any, any> {
  login: string;
  password: string;
  fingerprint?: string;
}

export interface ISocialCallbackData {
  connection: string;
  query: { [key: string]: any };
}

export interface ISocialAuthorizationRequest extends Record<string, any> {
  provider: string;
  query: { [key: string]: any };
  locale?: string;
  affiliateTag?: string;
  fingerprint?: string;
}

export interface IAuthorizationResponse extends Record<string, any> {
  accessToken: string;
  tokenType: string;
  expiresAfter: string;
  sessionId: string;
  profile: IProfile;
}

export interface IChangePasswordRequest extends Record<string, any> {
  currentPassword?: string;
  newPassword: string;
  repeatNewPassword: string;
}

export interface ISession extends Record<string, any> {
  sessionId: string;
  playerId: string;
  ip: string;
  country: string;
  deviceType: string;
  userAgent: string;
  closedAt: string | null;
  createdAt: string;
}

export interface ISessionsResponse extends Record<string, any> {
  data: ISession[];
  meta: IPaginationMeta;
}

export interface IResetPassword extends Record<string, any> {
  code: string;
  newPassword: string;
  repeatNewPassword: string;
}

export interface IUploadFile extends Record<string, any> {
  file: File;
  type: string;
}

export interface IDocumentFile extends Record<string, any> {
  id: string;
  fileName: string;
  status: number;
  type: string;
  createdAt: string;
  error?: string;
  rejectReason: null | string;
}

export interface IParsedToken extends Record<string, any> {
  iss: string;
  iat: number;
  exp: number;
  nbf: number;
  jti: string;
  sub: string;
  prv: string;
  id: string;
  sessionId: string;
}

export interface IPlayerLimit extends Record<string, any> {
  id: string;
  definition: number;
  status: number;
  amount: number | null;
  currentAmount: number | null;
  currency: string | null;
  startedAt: string | null;
  expiredAt: string | null;
  createdAt: string;
  updatedAt: string | null;
  period: string | null;
  cancelProcess: boolean;
  pendingExist: boolean;
}

export interface ICreateLimit extends Record<string, any> {
  definition: number;
  period?: string;
  currency?: string;
  amount?: number;
}

export interface IUpdateLimit extends Record<string, any> {
  limitId: string;
  period?: string;
  amount?: number;
}

export type RegistrationType = 'email' | 'phone' | 'emailOrPhone';

export interface IOtpRequest {
  phone: string;
  reason: 'registration' | 'phoneVerification' | 'changingPass';
}

export interface IPhoneVerification {
  phone: string;
  code: string;
  reason: string;
}

export interface IPlayerLoyaltyLevel extends Record<string, any> {
  id: string;
  name: string;
  order: number;
  points: number;
}

export interface IPlayerLoyaltyAccount extends Record<string, any> {
  id: string;
  playerId: string;
  points: number;
  currentLevel: IPlayerLoyaltyLevel;
  nextLevel: IPlayerLoyaltyLevel | null;
  createdAt: string;
  updatedAt: string | null;
}

export interface ILoyaltyLevelsRequest extends Record<string, any> {
  page?: number;
  perPage?: number;
  sortBy?: 'order' | 'points';
  sortOrder?: 'asc' | 'desc';
}

export interface ILoyaltyLevel {
  id: string;
  name: string;
  order: number;
  points: number;
}

export interface ILoyaltyLevelsResponse extends Record<string, any> {
  data: ILoyaltyLevel[];
  meta: IPaginationMeta;
}
