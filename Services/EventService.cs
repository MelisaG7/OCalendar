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

    public async Task<Event> GetEventById(int id)
    {
        return await _context.Event
            .FirstOrDefaultAsync(e => e.EventId == id); // Use the correct property name
    }
    


    public async Task AddEventToDb(Event evenement)
    {
        await _context.Event.AddAsync(evenement);
        await _context.SaveChangesAsync();
    }

    // update events
    public Event UpdateEvent(Event evenement, int id)
    {
        var Evenement = _context.Event.FirstOrDefault(e => e.EventId == id);
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


}