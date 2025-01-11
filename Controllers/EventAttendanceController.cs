using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StarterKit.Models;
using StarterKit.Services;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace StarterKit.Controllers;

[Route("api/v1/EventsAD")]

public class EventAttendanceController : Controller
{
    private readonly ILoginService _loginService;
    private readonly IEventService _eventService;
    private readonly IEventAttendanceService _eventAttendanceService;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly DatabaseContext _context;


    public EventAttendanceController(IEventService EventService, ILoginService loginService, IEventAttendanceService EventAttendanceService, IHttpContextAccessor httpContextAccessor, DatabaseContext context)
    {
        _loginService = loginService;
        _eventService = EventService;
        _eventAttendanceService = EventAttendanceService;
        _httpContextAccessor = httpContextAccessor;
        _context = context;
    }

    [HttpPost("AttendEvent")]

    public async Task<IActionResult> AttendEvent([FromBody] Event_AttendanceBody evenement)
    {
        if (!_loginService.CheckUserLoggedIn())
        {
            return BadRequest("User is not logged in");
        }
        
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


            if (result == true)
            {
                // Melding over succesvolle deelname
                return Ok(new
                {
                    message = "Successfully attended the event.",
                    eventDetails = await _eventAttendanceService.ReturnEvent(evenement.event_id)
                });
            }

        

        return BadRequest("There already is an event attendance");
    }

    // Nieuwe protected GET endpoint om de lijst van deelnemers op te halen

    [HttpGet("Attendees/{eventId}")]
    public async Task<IActionResult> GetAttendees(int eventId)
    {
        // Controleer of de gebruiker is ingelogd
        if (_loginService.CheckUserLoggedIn() || _loginService.CheckAdminLoggedIn())
        {
            // Haal de lijst van deelnemers op voor het evenement
            var attendees = await _eventAttendanceService.GetAttendeesByEventId(eventId);

            if (attendees == null || !attendees.Any())
            {
                return NotFound("No attendees found for this event.");
            }

            return Ok(attendees);
        }

        return BadRequest("User is not logged in");
    }

    [HttpDelete("RemoveAttendance/{eventId}")]
    public async Task<IActionResult> RemoveAttendance(int eventId)
    {
        if (_loginService.CheckUserLoggedIn())
        {
            // Retrieve the logged-in user's email from the session
            var loggedInUserEmail = _httpContextAccessor.HttpContext.Session.GetString(SESSION_KEY.userLoggedIn.ToString());

            if (string.IsNullOrEmpty(loggedInUserEmail))
            {
                return BadRequest("Logged-in user email is missing.");
            }

            // Find the user in the database by their email
            var user = await _context.User.FirstOrDefaultAsync(u => u.Email == loggedInUserEmail);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Check if the user is attending the event
            var eventAttendance = await _context.Event_Attendance
                .FirstOrDefaultAsync(ea => ea.Event.EventId == eventId && ea.User.UserId == user.UserId);

            if (eventAttendance == null)
            {
                return NotFound("Attendance record not found for the specified event and user.");
            }

            // Remove the event attendance record
            _context.Event_Attendance.Remove(eventAttendance);
            await _context.SaveChangesAsync();

            return Ok("You have been successfully removed from the event attendance.");
        }

        return BadRequest("User is not logged in.");
    }
    
[HttpGet("AttendingEvents/{userId}")]
public async Task<IActionResult> GetAttendingEvents(int userId)
{
    if (_loginService.CheckUserLoggedIn())
    {
        var attendedEvents = await _eventAttendanceService.GetAttendingEventsByUserId(userId);
        
        if (attendedEvents == null || !attendedEvents.Any())
        {
            return NotFound("No attended events found for the user.");
        }

        return Ok(attendedEvents);
    }

    return BadRequest("User is not logged in.");
}




    public class Event_AttendanceBody
    {
        public int user_id { get; set; }
        public int event_id { get; set; }
    }


}