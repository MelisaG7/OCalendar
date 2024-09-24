using Microsoft.EntityFrameworkCore.Diagnostics;
using StarterKit.Models;
using Microsoft.EntityFrameworkCore;


namespace StarterKit.Services;

public interface IEventService {
    public Task<List<Event>> GetAllEvents();
    public Task<Event> GetEventById(int id);
    public Task AddEventToDb(Event evenement);

    public Task DeleteEvent(int id);

}