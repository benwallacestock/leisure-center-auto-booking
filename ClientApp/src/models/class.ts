export type Class = {
  brief: Brief;
  details?: Details;
  attendeeDetails?: AttendeeDetails;
};

export type Brief = {
  id: string;
  name: string;
  startDateTime: number;
  endDateTime: number;
  maxCapacity: number;
  totalBooked: number;
  waitlistCapacity: number;
  waitlistBooked: number;
  instructor: Instructor;
  activity: Activity;
  free: boolean;
  childCare: boolean;
  reservable: boolean;
  liveStreamClass: boolean;
  cancelled: boolean;
  booked: boolean;
  clubUuid: string;
};

export type Instructor = {
  id: string;
  fullName: string;
};

export type Activity = {
  id: string;
  name: string;
};

export type Details = {
  description: string;
  room: Room;
  cancellationWindowEnd: number;
  bookingWindowStart: number;
  bookingWindowEnd: number;
};

export type Room = {
  id: string;
  description: string;
};

export type AttendeeDetails = {
  exerciserUuid: string;
  booked: boolean;
  waitlistBooked: boolean;
  availableActions: Array<string>;
  queued: boolean;
};
