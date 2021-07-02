namespace leisure_center_bookings.Dtos
{
    public class Details
    {
        public string Description { get; set; } 
        public Room Room { get; set; } 
        public double? CancellationWindowEnd { get; set; }
        public double? BookingWindowStart { get; set; }
        public double? BookingWindowEnd { get; set; }
        
    }
}