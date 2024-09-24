using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StarterKit.Models;
using StarterKit.Services;

namespace StarterKit.Controllers;

// Oke dus wat ik begreep moet je events kunnen bekijken, updaten, maken en verwijderen
// Bekijken kan door iedereen. Updaten, maken en verwijderen kan alleen door de admin
// Bij de GET nedpoint moet ik ook de reviews en attendees laten zien

[Route("api/v1/Events")]

public class EventController : Controller
{
    private readonly IEventService _eventService;
    public EventController(IEventService EventService)
    {
        _eventService = EventService;
    }

    [HttpGet("events")]
    // Dit is alle events bekijken. Prolly ook events kijken per id, of alleen de latter laten

    public IActionResult events()
    {
        var Events = _eventService.GetAllEvents();
        return Ok(Events);
    }

    [HttpGet("events/{id}")]

    public IActionResult events(int id)
    {
        var Event = _eventService.GetEventById(id);
        return Ok(Event);
        // Later gaan we de fouten checken enzo.. met if null and all that
    }

    /* Om te checken of dit uberhaupt wel klopt,
    moet ik eerst natuurlijk een event createn want vgm zit er niks in de database
    */

    [HttpPost("CreateEvent")]

    public IActionResult CreateEvent([FromBody] Event evenement)
    {
      // add de event naar de database
      _eventService.AddEventToDb(evenement);
      return Ok("Event successfully added");
    }

    // Deleten
    [HttpDelete("DeleteEvent/{id}")]

    public IActionResult DeleteEvent(int id)
    {
        _eventService.DeleteEvent(id);
        return Ok("Event succesfully deleted");
    }

    public class EventBody
    {
        public int EventId { get; set; }

        public required string Title { get; set; }

        public required string Description { get; set; }

        public DateOnly EventDate { get; set; }

        public TimeSpan StartTime { get; set; }

        public TimeSpan EndTime { get; set; }

        public required string Location { get; set; }

        public bool AdminApproval { get; set; }

        public required List<Event_Attendance> Event_Attendances { get; set; }
    }

// public class LoginBody
// {
//     public string? Username { get; set; }
//     public string? Password { get; set; }
// }

        // public int EventId { get; set; }

        // public required string Title { get; set; }

        // public required string Description { get; set; }

        // public DateOnly EventDate { get; set; }

        // public TimeSpan StartTime { get; set; }

        // public TimeSpan EndTime { get; set; }

        // public required string Location { get; set; }

        // public bool AdminApproval { get; set; }

        // public required List<Event_Attendance> Event_Attendances { get; set; }
}


