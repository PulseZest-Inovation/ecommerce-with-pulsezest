export interface UserType {
  id: string;
  email: string;
  phoneNumber: string;
  fullName: string;
  roleType: string;
  createdAt?: any;
  isDelete: boolean; // Indicates if the user is deleted
  applicationId?: string; // Optional field for application ID
};

