using Microsoft.EntityFrameworkCore;

namespace leisure_center_bookings.Models
{
    public class LeisureCenterDbContext : DbContext
    {
        public LeisureCenterDbContext(DbContextOptions<LeisureCenterDbContext> options)
            : base(options)
        { }
        
        public DbSet<QueuedClass> QueuedClasses { get; set; }
    }
}