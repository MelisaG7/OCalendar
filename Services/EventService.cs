using SQLitePCL;
using StarterKit.Models;
using StarterKit.Utils;
using System.Linq;
using Microsoft.EntityFrameworkCore;


namespace StarterKit.Services;


public class EventService : IEventService
{
    private readonly DatabaseContext _context;

    public EventService(DatabaseContext context)
    {
        _context = context;
    }

    // Returned alleen future events want wrm allemaal nodig? Wacht laat me gwn een aparte functie voor maken
    public async Task<List<Event>> GetAllEvents()
    {
        // werkt wel
        return await _context.Event.ToListAsync();
    }

    public async Task<List<Event>> GetFutureEvents()
    {
        var AllEvents = await _context.Event.ToListAsync();
        // Okay nu alleen maar events returnen die nog moeten plaatsvinden
        var FutureEvents = AllEvents.Where(e => IsEventAvailable(e)).ToList();
        return FutureEvents;
    }

    // public async Task<Event> GetEventById(int id)
    // {
    //     return await _context.Event
    //         .FirstOrDefaultAsync(e => e.EventId == id); // Use the correct property name

    // }


    public async Task<Event> GetEventById(int id)
    {
        var eventItem = await _context.Event
            .FirstOrDefaultAsync(e => e.EventId == id);

        if (eventItem != null)
        {
            // Bereken de gemiddelde rating en wijs deze toe aan het evenement
            eventItem.AverageRating = CalculateAverageRating(id);
        }

        return eventItem;
    }

    public async Task AddEventToDb(Event evenement)
    {
        await _context.Event.AddAsync(evenement);
        await _context.SaveChangesAsync();
    }

    // update events

    public Event UpdateEvent(Event evenement, int id)
    {
        Event Evenement = _context.Event.FirstOrDefault(e => e.EventId == id);
        if (Evenement is null)
            return null;

        // update event
        _context.Entry(Evenement).CurrentValues.SetValues(evenement);
        _context.SaveChanges();
        return Evenement;
    }

    public async Task DeleteEvent(int id)
    {
        var Evenement = await _context.Event.FirstOrDefaultAsync(e => e.EventId == id);

        _context.Event.Remove(Evenement);
        await _context.SaveChangesAsync();

    }

    // 


    // checken of event al begonnen is
    public bool IsEventAvailable(Event evenement)
    {
        // check of datum al is geweest
        DateTime fullStartTime = evenement.EventDate.ToDateTime(new TimeOnly(evenement.StartTime.Hours, evenement.StartTime.Minutes, evenement.StartTime.Seconds));

        // Vergelijk met de huidige tijd
        return fullStartTime > DateTime.Now; // Controleert of het evenement nog niet begonnen is


    }

    public bool IsEventEnded(Event evenement)
    {
        // check het event al is geweest
        DateTime fullEndTime = evenement.EventDate.ToDateTime(new TimeOnly(evenement.EndTime.Hours, evenement.EndTime.Minutes, evenement.EndTime.Seconds));

        // Vergelijk met de huidige tijd
        return fullEndTime < DateTime.Now; // Controleert of de eindtijd al is bereikt
    }

    public bool RateEventFoutHandling(Rating rating, Event Evenement, User user)
    {
        // Check of user en evenement uberhaupt in database bestaan
        if (Evenement == null || user == null)
            return false;
        // Check of evenement wel voorbij is
        if (Evenement.EventDate.ToDateTime(TimeOnly.MinValue).Add(Evenement.EndTime) > DateTime.Now)
            return false;
        // Daarna moet ik controleren of de rating wel tussen de 1 en 5 zit
        if (rating.rating < 1 || rating.rating > 5)
            return false;
        // Daana moet ik kijken of de user uberhaupt de event heeft geattend
        if (_context.Event_Attendance.FirstOrDefault(e => e.User.UserId == rating.UserId && e.Event.EventId == rating.EventId) == null)
            return false;
        return true;
    }
    public bool RateEvent(Rating rating)
    {
        Event Evenement = _context.Event.FirstOrDefault(e => e.EventId == rating.EventId);
        User User = _context.User.FirstOrDefault(u => u.UserId == rating.UserId);
        if (!RateEventFoutHandling(rating, Evenement, User))
            return false;
        else
            // Sla in database op
            _context.Add(rating);
        _context.SaveChanges();
        return true;
        // Dus ja dat eigenlijk
        // Uhh als het goed is moet ik niks aan de andere tabellen doen?
    }

    public double CalculateAverageRating(int eventId)
    {
        var ratings = _context.Rating
            .Where(r => r.EventId == eventId)
            .ToList();

        if (ratings.Count == 0)
        {
            return 0; // Geen beoordelingen, dus geen gemiddelde
        }

        return ratings.Average(r => r.rating);
    }

    public async Task<List<Rating>> GetEventRatings(int eventId)
    {
        return await _context.Rating
            .Where(r => r.EventId == eventId)
            .ToListAsync();
    }

    public bool AddReview(Rating rating)
    {
        // Controleer of het event en de user bestaan
        var eventExists = _context.Event.Any(e => e.EventId == rating.EventId);
        var userExists = _context.User.Any(u => u.UserId == rating.UserId);
            if (!eventExists)
            {
                Console.WriteLine($"Event with ID {rating.EventId} not found.");
            }

            if (!userExists)
            {
                Console.WriteLine($"User with ID {rating.UserId} not found.");
            }

            if (!eventExists || !userExists)
            return false;



        // Sla de review op
        _context.Rating.Add(rating);
        try
        {
            _context.SaveChanges();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error saving changes: {ex.Message}");
        }        return true;
    }


}