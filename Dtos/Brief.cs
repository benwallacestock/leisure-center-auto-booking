using System;

namespace leisure_center_bookings.Dtos
{
    public class Brief
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public double StartDateTime { get; set; }
        public double EndDateTime { get; set; }
        public int MaxCapacity { get; set; }
        public int TotalBooked { get; set; }
        public int WaitlistCapacity { get; set; }
        public int WaitlistBooked { get; set; }
        public Instructor Instructor { get; set; }
        public Activity Activity { get; set; }
        public bool Free { get; set; }
        public bool ChildCare { get; set; }
        public bool Reservable { get; set; }
        public bool LiveStreamClass { get; set; }
        public bool Cancelled{ get; set; }
        public bool Booked { get; set; }
        public string ClubUuid { get; set; }
    }
}