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
            var result = await _eventAttendanceService.AddAttendance(evenement.user_id, evenement.event_id);
            if (result == true)
            {
                var EventAttended = await _eventAttendanceService.ReturnEvent(evenement.event_id);
                return Ok(EventAttended);
            }
            return BadRequest("Failed to attend event");
            // Maak methode in service die checked of event en user bestaat.
            // Vervolgens ga je dan die event toevoegen aan de attendances van de user?
            
        }
        return BadRequest("User is not logged in");
    }

    public class Event_AttendanceBody
    {
        public int user_id {get; set;}
        public int event_id {get; set;}
    }
}