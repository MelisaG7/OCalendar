using SQLitePCL;
using StarterKit.Models;
using StarterKit.Utils;
using System.Linq;
using Microsoft.EntityFrameworkCore;


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

    public async Task<Event> ReturnEvent(int event_id)
    {
        Event evenement = await _context.Event.FirstOrDefaultAsync(e => e.EventId == event_id);
        return evenement;
    }
}