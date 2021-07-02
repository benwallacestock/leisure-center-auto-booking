using System;

namespace leisure_center_bookings.Models
{
    public class QueuedClass
    {
        public int Id { get; set; }
        public string ClassId { get; set; }
        public DateTime BookableDateTime { get; set; }
    }
}