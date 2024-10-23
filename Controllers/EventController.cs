using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StarterKit.Models;
using StarterKit.Services;
using System.ComponentModel.DataAnnotations;


namespace StarterKit.Controllers;

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


    [HttpPost("CreateEvent")]

    public IActionResult CreateEvent([FromBody] EventBody evenement)
    {
        // Hij krijgt....geen evenement binnen? Bij debuggen staat er evenement = null?!
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
        Event evento = new Event()
        {
            EventId = evenement.EventId,
            Title = evenement.Title,
            Description = evenement.Description,
            EventDate = evenement.EventDate,
            StartTime = evenement.StartTime,
            EndTime = evenement.EndTime,
            Location = evenement.Location,
            AdminApproval = evenement.AdminApproval,
            Event_Attendances = evenement.Event_Attendances
        };
        _eventService.AddEventToDb(evento);
        return Ok("Event successfully added");
    }

    [HttpPut("UpdateEvent/{id}")]

    public IActionResult UpdateEvent([FromBody] EventBody evenement, int id)
    {
        _eventService.UpdateEvent(evenement, id);
        return Ok("Event successfully updated");
    }

    // Deleten
    [HttpDelete("DeleteEvent/{id}")]

    public IActionResult DeleteEvent(int id)
    {
        _eventService.DeleteEvent(id);
        return Ok("Event succesfully deleted");
    }

    [HttpPost("RateEvent")]

    public async Task<IActionResult> RateEvent([FromBody] Rating rating)
    {
        if (!_loginService.CheckAdminLoggedIn() && !_loginService.CheckUserLoggedIn())
        {
            return Unauthorized();
        }
        if (_eventService.RateEvent(rating))
        {
            return Created();
        }
        return BadRequest("Rating couldnt be placed!");
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


