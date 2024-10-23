using System.ComponentModel.DataAnnotations;

namespace StarterKit.Models
{
    public class EventBody
    {
        public int EventId { get; set; }

        [Required(ErrorMessage = "Title is required")]
        public string Title { get; set; }

        [Required(ErrorMessage = "Description is required")]
        public string Description { get; set; }

        [Required(ErrorMessage = "Event date is required")]
        public DateOnly EventDate { get; set; }

        [Required(ErrorMessage = "Start time is required")]
        public TimeSpan StartTime { get; set; }

        [Required(ErrorMessage = "End time is required")]
        public TimeSpan EndTime { get; set; }

        [Required(ErrorMessage = "Location is required")]
        public string Location { get; set; }

        public bool AdminApproval { get; set; }

        [Required(ErrorMessage = "At least one attendee is required")]
        public List<Event_Attendance> Event_Attendances { get; set; }
        
    }   
}