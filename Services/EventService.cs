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

    public async Task<List<Event>> GetAllEvents()
{
    // werkt wel
    return await _context.Event.ToListAsync();
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

    public Event UpdateEvent(EventBody evenement, int id)
    {
        Event Evenement = _context.Event.FirstOrDefault(e => e.EventId == id);
        if (Evenement is null)
            return null;

        // update event
        Evenement.EventId = evenement.EventId;
        Evenement.Description = evenement.Description;
        Evenement.EventDate = evenement.EventDate;
        Evenement.Title = evenement.Title;
        Evenement.Location = evenement.Location;
        Evenement.StartTime = evenement.StartTime;
        Evenement.EndTime = evenement.EndTime;
        Evenement.Event_Attendances = evenement.Event_Attendances;
        Evenement.AdminApproval = evenement.AdminApproval;
        // _context.Entry(Evenement).State = EntityState.Modified;
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
        if(!RateEventFoutHandling(rating, Evenement, User))
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



}