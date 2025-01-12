using StarterKit.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;


namespace StarterKit.Services;
    public class AttendanceService : IAttendanceService
    {
        private readonly DatabaseContext _context;

        public AttendanceService(DatabaseContext context)
        {
            _context = context;
        }

        public async Task<Attendance?> GetUserAttendance(int userId, DateTime date)
        {
            return await _context.Attendance
                .FirstOrDefaultAsync(a => a.User.UserId == userId && a.AttendanceDate.Date == date.Date);
        }

        public async Task<bool> AddAttendance(int userId, DateTime attendanceDate)
        {
            if (await CheckAttendanceAvailability(userId, attendanceDate))
            {
                var attendance = new Attendance
                {
                    User = await _context.User.FindAsync(userId),
                    AttendanceDate = attendanceDate
                };

                await _context.Attendance.AddAsync(attendance);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<bool> UpdateAttendance(int userId, DateTime oldDate, DateTime newDate)
        {
            var attendance = await GetUserAttendance(userId, oldDate);
            if (attendance != null && await CheckAttendanceAvailability(userId, newDate))
            {
                attendance.AttendanceDate = newDate;
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<bool> DeleteAttendance(int userId, DateTime attendanceDate)
        {
            var attendance = await GetUserAttendance(userId, attendanceDate);
            if (attendance != null)
            {
                _context.Attendance.Remove(attendance);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<bool> CheckAttendanceAvailability(int userId, DateTime date)
        {
            var existingAttendance = await GetUserAttendance(userId, date);
            return existingAttendance == null;
        }

        // Fetch logged-in user’s ID based on the email from LoginService
        public async Task<int?> GetLoggedInUserId(string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return null;
            }

            var user = await _context.User.FirstOrDefaultAsync(u => u.Email == email);
            return user?.UserId;
        }
    }

