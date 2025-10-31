/**
 * Aboosto Admin Service API - TypeScript Type Definitions
 * Generated from OpenAPI 3.0.1 specification
 */

import { ApiResponse, Pageable, PagedData } from './types';

// Login Request Parameters
export interface LoginRequest {
  username: string;
  password: string;
}

// Login Response (returns a map/object with authentication data)
export interface LoginResponse {
  token?: string;
  user?: any;
  [key: string]: any;
}

// Rider DTO
export interface RiderDTO {
  riderId?: number;
  signupDate?: string;
  status?: string;
  deviceToken?: string;
  phoneNumber?: string;
  otpVerified?: boolean;
  emailId?: string;
  signupMethod?: string;
  fullName?: string;
  profilePhotoUrl?: string;
  dateOfBirth?: string;
  gender?: string;
  homeAddress?: string;
  workAddress?: string;
  locationAccessPermission?: boolean;
  kycIdType?: string;
  kycIdNumber?: string;
  kycDocumentPhotoUrl?: string;
  preferredPaymentMethod?: string;
  walletBalance?: number;
  savedPaymentMethods?: string[];
  preferredLanguage?: string;
  notificationPreferences?: string[];
  promotionalConsent?: boolean;
  createdBy?: string;
  createdDate?: string;
  modifiedBy?: string;
  modifiedDate?: string;
  isDeleted?: boolean;
  isDeletedValue?: boolean;
}

// Driver DTO
export interface DriverDTO {
  driverId?: number;
  phoneNumber?: string;
  otpVerified?: boolean;
  email?: string;
  signupMethod?: string;
  fullName?: string;
  profilePhotoUrl?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  emergencyContactNumber?: string;
  preferredLanguage?: string;
  govtIdType?: string;
  govtIdNumber?: string;
  govtIdFrontUrl?: string;
  govtIdBackUrl?: string;
  drivingLicenseFrontUrl?: string;
  drivingLicenseBackUrl?: string;
  selfieWithIdUrl?: string;
  vehicleType?: string;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: number;
  vehicleColor?: string;
  vehicleLicensePlate?: string;
  vehicleRegistrationCertUrl?: string;
  vehicleInsuranceCertUrl?: string;
  vehicleInspectionCertUrl?: string;
  vehiclePhotoUrl?: string;
  bankAccountHolderName?: string;
  bankAccountNumber?: string;
  bankName?: string;
  bankIfscCode?: string;
  upiId?: string;
  backgroundCheckStatus?: string;
  backgroundCheckDate?: string;
  trainingCompletionDate?: string;
  driverStatus?: string;
  approvalDate?: string;
  rejectionReason?: string;
  currentLocationLatitude?: number;
  currentLocationLongitude?: number;
  availabilityStatus?: string;
  currentRideId?: number;
  totalRidesCompleted?: number;
  totalEarnings?: number;
  averageRating?: number;
  createdBy?: string;
  createdDate?: string;
  modifiedBy?: string;
  modifiedDate?: string;
  isDeleted?: boolean;
  isDeletedValue?: boolean;
}

// Export all types from base types
export type { ApiResponse, Pageable, PagedData };
