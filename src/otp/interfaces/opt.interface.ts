export interface IOtpData {
  email: string;
  fullName: string;
}

export interface IOtpResponse {
  success: boolean;
  email?: string;
  validFor?: number;
  message?: string;
}

export interface IStoredOtpData {
  otp: number;
  attempts: number;
  createdAt: number;
}
