using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StarterKit.Models;
using StarterKit.Services;
using System.ComponentModel.DataAnnotations;


namespace StarterKit.Controllers;

// Oke dus wat ik begreep moet je events kunnen bekijken, updaten, maken en verwijderen
// Bekijken kan door iedereen. Updaten, maken en verwijderen kan alleen door de admin
// Bij de GET nedpoint moet ik ook de reviews en attendees laten zien

[Route("api/v1/Events")]

public class EventController : Controller
{
    private readonly ILoginService _loginService;
    private readonly IEventService _eventService;
    public EventController(IEventService EventService, ILoginService loginService)
    {
        _loginService = loginService;
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
    if (!_loginService.CheckAdminLoggedIn())
    {
        return Unauthorized("Admin not logged in.");
    }

    // Controleer of het evenement object null is of niet alle vereiste velden heeft
    if (evenement == null || 
        string.IsNullOrWhiteSpace(evenement.Title) ||
        string.IsNullOrWhiteSpace(evenement.Description) ||
        evenement.EventDate == default ||
        evenement.StartTime == default ||
        evenement.EndTime == default ||
        string.IsNullOrWhiteSpace(evenement.Location))
    {
        return BadRequest("You are missing required fields");
    }

    // Voeg het evenement toe aan de database
    _eventService.AddEventToDb(evenement);
    return Ok("Event successfully added");
    }

    [HttpPut("UpdateEvent/{id}")]

    public IActionResult UpdateEvent([FromBody] Event evenement, int id)
    {
        // allowing only admin to update
        if (!_loginService.CheckAdminLoggedIn())
        {
            return Unauthorized();
        }
        _eventService.UpdateEvent(evenement, id);
        return Ok("Event successfully updated");
    }

    // Deleten
    [HttpDelete("DeleteEvent/{id}")]

    public IActionResult DeleteEvent(int id)
    {
        // allowing only admin to delete
        if (!_loginService.CheckAdminLoggedIn())
        {
            return Unauthorized();
        }
        _eventService.DeleteEvent(id);
        return Ok("Event succesfully deleted");
    }


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


    // public class EventBody
    // {
    //     public int EventId { get; set; }

    //     public required string Title { get; set; }

    //     public required string Description { get; set; }

    //     public DateOnly EventDate { get; set; }

    //     public TimeSpan StartTime { get; set; }

    //     public TimeSpan EndTime { get; set; }

    //     public required string Location { get; set; }

    //     public bool AdminApproval { get; set; }

    //     public required List<Event_Attendance> Event_Attendances { get; set; }
    // }


