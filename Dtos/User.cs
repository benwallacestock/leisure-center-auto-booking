namespace leisure_center_bookings.Dtos
{
    public class User
    {
        public string Uuid { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public bool Verified { get; set; }
        public string HomeClubUuid { get; set; }
        public string HomeClubName { get; set; }
        public string Timezone { get; set; }
        public int TimezoneOffset { get; set; }
        public bool ProfileCompleted { get; set; }
        public string MembershipType { get; set; }
        public string Barcode { get; set; }
        public string ExternalAuthToken { get; set; }
        public string MeasurementUnit { get; set; }
        public bool GuestPassUser { get; set; }
        public string AuthenticationCookieHeaderValue { get; set; }
    }
}