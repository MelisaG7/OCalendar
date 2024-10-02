using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StarterKit.Models;
using StarterKit.Services;

namespace StarterKit.Controllers;

[Route("api/v1/Events")]

public class EventAttendanceController : Controller
{
    private readonly ILoginService _loginService;
    private readonly IEventService _eventService;
    private readonly IEventAttendanceService _eventAttendanceService;
    public EventAttendanceController(IEventService EventService, ILoginService loginService, IEventAttendanceService EventAttendanceService)
    {
        _loginService = loginService;
        _eventService = EventService;
        _eventAttendanceService = EventAttendanceService;
    } 

    [HttpPost("AttendEvent")]

    public async Task<IActionResult> AttendEvent([FromBody] Event_AttendanceBody evenement)
    {

    if (_loginService.CheckUserLoggedIn())
    {
        // Haal het evenement op
        var eventDetails = await _eventService.GetEventById(evenement.event_id);

        if (eventDetails == null)
        {
            return NotFound("Event not found");
        }

        // Controleer de beschikbaarheid van het evenement (datum en tijd)
        if (!_eventService.IsEventAvailable(eventDetails))
        {
            return BadRequest("Event is not available. It may have already started or ended.");
        }

        // Voeg de aanwezigheid toe als het evenement beschikbaar is
        var result = await _eventAttendanceService.AddAttendance(evenement.user_id, evenement.event_id);

        // if (result == true)
        // {
        //     var EventAttended = await _eventAttendanceService.ReturnEvent(evenement.event_id);
        //     return Ok(EventAttended);
        // }

        // return BadRequest("Failed to attend event");

        if (result == true)
        {
            // Melding over succesvolle deelname
            return Ok(new
            {
                message = "Successfully attended the event.",
                eventDetails = await _eventAttendanceService.ReturnEvent(evenement.event_id)
            });
        }

    }

    return BadRequest("User is not logged in");
}

    public class Event_AttendanceBody
    {
        public int user_id {get; set;}
        public int event_id {get; set;}
    }
}