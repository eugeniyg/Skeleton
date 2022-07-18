export interface ProfileInterface {
  id: string,
  status: number,
  email: string|null,
  phone: string|null,
  currency: string|null,
  country: string|null,
  birthdate: string|null
  firstName: string|null,
  lastName: string|null,
  nickname: string|null,
  gender: string|null,
  nationality: string|null,
  placeOfBirth: string|null,
  address: string|null,
  timeZone: string|null,
  profession: string|null,
  receiveEmailPromo: boolean,
  receiveSmsPromo: boolean,
  agreedTc: boolean,
  confirmedAt: string|null,
  createdAt: string|null,
  city: string|null,
  additionalAddress: string|null,
  postalCode: string|null,
  personalIdNumber: string|null,
  securityQuestion: string|null,
  securityAnswer: string|null,
}

export interface AuthorizationResponse {
  accessToken: string,
  tokenType: string,
  expiresAfter: string,
  sessionId: string,
  profile: ProfileInterface,
}

export interface ChangePasswordRequestInterface {
  currentPassword?: string,
  newPassword: string,
  repeatNewPassword: string,
}
