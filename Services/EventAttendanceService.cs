using SQLitePCL;
using StarterKit.Models;
using StarterKit.Utils;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;


namespace StarterKit.Services;

public class EventAttendanceService : IEventAttendanceService
{
    private readonly DatabaseContext _context;

    public EventAttendanceService(DatabaseContext context)
    {
        _context = context;
    }
    public async Task<bool?> AddAttendance(int user_id, int event_id)
    {
        // add event to the user's event attendances
        // add user to the event's attendencees?


        // okay first I need to find the event and user
        Event evenement = await _context.Event.FirstOrDefaultAsync(e => e.EventId == event_id);
        if (evenement == null)
        {
            return false;
        }
        // 
        // if null bla bla bla fouthandling
        User user = await _context.User.FirstOrDefaultAsync(u => u.UserId == user_id);
        if (user == null)
        {
            return false;
        }
        
        // var existingAttendance = await _context.Event_Attendance
        // .FirstOrDefaultAsync(ea => ea.User.UserId == user_id && ea.Event.EventId == event_id);

        // if (existingAttendance != null)
        // {
        //     // User has already attended the event
        //     return false;
        // }
        
        // yeyy user en evenement gevonden!
        // Okay als ik goed begrijp moet je hiermee twee object maken : Attendance en Event_attendance.
        Attendance attendance = new(){User = user};
        Event_Attendance event_Attendance = new(){User = user, Event = evenement, Feedback = ""};
        // // Add event attendance to user list
        // user.Event_Attendances.Add(event_Attendance);
        // // Add attendance to user list
        // user.Attendances.Add(attendance);
        // // Add Event Attendance to event list
        // evenement.Event_Attendances.Add(event_Attendance);
        // Add Attendance and Event Attendance to database
        await _context.Attendance.AddAsync(attendance);
        await _context.Event_Attendance.AddAsync(event_Attendance);
        // Attendance en Event_Attendance voeg je toe aan de user
        // Event_Attendance voeg je toe aan Event
        // Aan Event_Attendance object voeg je user EN event
        // aan Attendance alleen de user
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<List<Attendee>> GetAttendeesByEventId(int eventId)
    {
        var attendees = await _context.Event_Attendance
            .Where(ea => ea.Event.EventId == eventId)
            .Select(ea => new Attendee
            {
                UserId = ea.User.UserId,
                FirstName = ea.User.FirstName,
                LastName = ea.User.LastName,
                Email = ea.User.Email,
                Rating = ea.Rating,
                Feedback = ea.Feedback,
            })
            .ToListAsync();

        return attendees;
    }

    public async Task<Event> ReturnEvent(int event_id)
    {
        Event evenement = await _context.Event.FirstOrDefaultAsync(e => e.EventId == event_id);
        return evenement;
    }

    public async Task<Event_Attendance?> GetEventAttendanceByUserAndEvent(int userId, int eventId)
    {
        return await _context.Event_Attendance
            .FirstOrDefaultAsync(ea => ea.User.UserId == userId && ea.Event.EventId == eventId);
    }

    public async Task<bool> RemoveAttendance(Event_Attendance eventAttendance)
    {
        _context.Event_Attendance.Remove(eventAttendance);
        var result = await _context.SaveChangesAsync();
        return result > 0;
    }

}