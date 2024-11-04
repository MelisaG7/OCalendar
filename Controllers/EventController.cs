using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StarterKit.Models;
using StarterKit.Services;
using System.ComponentModel.DataAnnotations;


namespace StarterKit.Controllers;
[ApiController]
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

    [AdminOnly]
    [HttpPost("CreateEvent")]

    public IActionResult CreateEvent([FromBody] Event evenement)
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
        _eventService.AddEventToDb(evenement);

        return Ok("Event successfully added");
    }

    [AdminOnly]
    [HttpPut("UpdateEvent/{id}")]

    public IActionResult UpdateEvent([FromBody] Event evenement, int id)
    {
        var updated = _eventService.UpdateEvent(evenement, id);
        if (updated is null)
        {
            return BadRequest("Update dismissed");
        }
        return Ok("Event successfully updated");
    }

    [AdminOnly]
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
            return Ok("Rating has been placed");
        }
        return BadRequest("Rating couldnt be placed!");

    }

    [HttpGet("ratings/{id}")]
    public async Task<IActionResult> GetEventRatings(int id)
    {
        if (!_loginService.CheckAdminLoggedIn())
        {
            return Unauthorized(); // Zorg ervoor dat alleen ingelogde admins toegang hebben
        }

        var ratings = await _eventService.GetEventRatings(id);
        if (ratings == null || ratings.Count == 0)
        {
            return NotFound("No ratings found for this event.");
        }

        return Ok(ratings);
    }
}






