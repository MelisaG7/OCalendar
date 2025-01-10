using Microsoft.EntityFrameworkCore.Diagnostics;
using StarterKit.Models;
using Microsoft.EntityFrameworkCore;


namespace StarterKit.Services;

public interface IEventAttendanceService
{
    public Task<bool?> AddAttendance(int user_id, int event_id);
    public Task<Event> ReturnEvent(int event_id);
    Task<List<Attendee>> GetAttendeesByEventId(int eventId);
  public Task<List<Event>> GetAttendingEventsByUserId(int userId);

}