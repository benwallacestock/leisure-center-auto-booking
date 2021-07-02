using System.Collections.Generic;

namespace leisure_center_bookings.Dtos
{
    public class AttendeeDetails
    {
        public string ExterciserUuid { get; set; }
        public bool Booked { get; set; }
        public bool Queued { get; set; } = false;
        public bool WaitlistBooked { get; set; }
        public List<string> AvailableActions { get; set; }
    }
}