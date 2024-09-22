using Microsoft.EntityFrameworkCore;
using StarterKit.Utils;

namespace StarterKit.Models
{
    public class DatabaseContext : DbContext
    {
        // The admin table will be used in both cases
        public DbSet<Admin> Admin { get; set; }

        // You can comment out or remove the case you are not going to use.

        // Tables for the Theatre ticket case

        // public DbSet<Customer> Customer { get; set; }
        // public DbSet<Reservation> Reservation { get; set; }
        // public DbSet<TheatreShowDate> TheatreShowDate { get; set; }
        // public DbSet<TheatreShow> TheatreShow { get; set; }
        // public DbSet<Venue> Venue { get; set; }

        // Tables for the event calendar case

        public DbSet<User> User { get; set; }
        public DbSet<Attendance> Attendance { get; set; }
        public DbSet<Event_Attendance> Event_Attendance { get; set; }
        public DbSet<Event> Event { get; set; }



        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Admin>()
                .HasIndex(p => p.UserName).IsUnique();

            modelBuilder.Entity<Admin>()
                .HasData(new Admin { AdminId = 1, Email = "admin1@example.com", UserName = "admin1", Password = EncryptionHelper.EncryptPassword("password") });
            modelBuilder.Entity<Admin>()
                .HasData(new Admin { AdminId = 2, Email = "admin2@example.com", UserName = "admin2", Password = EncryptionHelper.EncryptPassword("tooeasytooguess") });
            modelBuilder.Entity<Admin>()
                .HasData(new Admin { AdminId = 3, Email = "admin3@example.com", UserName = "admin3", Password = EncryptionHelper.EncryptPassword("helloworld") });
            modelBuilder.Entity<Admin>()
                .HasData(new Admin { AdminId = 4, Email = "admin4@example.com", UserName = "admin4", Password = EncryptionHelper.EncryptPassword("Welcome123") });
            modelBuilder.Entity<Admin>()
                .HasData(new Admin { AdminId = 5, Email = "admin5@example.com", UserName = "admin5", Password = EncryptionHelper.EncryptPassword("Whatisapassword?") });

            modelBuilder.Entity<Event>();
            modelBuilder.Entity<Event>().HasData(
                new{ EventId = 101, Title = "Tech Conference", Description = "A conference about the latest in tech.", EventDate = new DateOnly(2024, 10, 25), StartTime = new TimeSpan(9, 0, 0), EndTime = new TimeSpan(17, 0, 0), Location = "Convention Center", AdminApproval = true, Event_Attendances = ""}
            );

        }

    }

}