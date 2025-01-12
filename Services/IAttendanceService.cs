using StarterKit.Models;
using System;
using System.Threading.Tasks;

namespace StarterKit.Services;
    public interface IAttendanceService
    {
        public Task<Attendance?> GetUserAttendance(int userId, DateTime date);
        public Task<bool> AddAttendance(int userId, DateTime attendanceDate);
        public Task<bool> UpdateAttendance(int userId, DateTime oldDate, DateTime newDate);
        public Task<bool> DeleteAttendance(int userId, DateTime attendanceDate);
        public Task<bool> CheckAttendanceAvailability(int userId, DateTime date);
        public Task<int?> GetLoggedInUserId(string email);
    }

