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
}