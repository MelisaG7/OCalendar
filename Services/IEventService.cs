using Microsoft.EntityFrameworkCore.Diagnostics;
using StarterKit.Models;
using Microsoft.EntityFrameworkCore;


namespace StarterKit.Services;

public interface IEventService {
    public Task<List<Event>> GetAllEvents();
    public Task<Event> GetEventById(int id);
    public Task AddEventToDb(Event evenement);

    public Event UpdateEvent(EventBody evenement, int id);
    public Task DeleteEvent(int id);

    bool IsEventAvailable(Event evenement);
    bool IsEventEnded(Event evenement);

    public bool RateEvent(Rating rating);

    Task<List<Rating>> GetEventRatings(int eventId);




}