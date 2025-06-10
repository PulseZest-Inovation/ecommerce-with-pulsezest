export interface UserType {
  id: string;
  email: string;
  phoneNumber: string;
  fullName: string;
  roleType: string;
  createdAt?: any;
  isDelete?: boolean;
  applicationId?: string; // Optional field for application ID
};

