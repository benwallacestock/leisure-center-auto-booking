export type User = {
  uuid: string;
  firstName: string;
  lastName: string;
  verified: boolean;
  homeClubUuid: string;
  homeClubName: string;
  timezoneOffset: number;
  profileCompleted: boolean;
  membershipType: string;
  barcode: string;
  externalAuthToken: string;
  measurementUnit: string;
  guestPassUser: boolean;
};
