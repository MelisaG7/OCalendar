using Microsoft.AspNetCore.Mvc;
using StarterKit.Services;
using System;
using System.Threading.Tasks;
using StarterKit.Models;

namespace StarterKit.Controllers
{
    [Route("api/v1/Attendance")]
    public class AttendanceController : ControllerBase
    {
        private readonly IAttendanceService _attendanceService;
        private readonly ILoginService _loginService;

        public AttendanceController(IAttendanceService attendanceService, ILoginService loginService)
        {
            _attendanceService = attendanceService;
            _loginService = loginService;
        }

    [HttpGet("AllAttendances")]
    public async Task<IActionResult> GetAttendingEvents()
    {
        var email = _loginService.GetLoggedInUserEmail();
        var user = await _attendanceService.GetLoggedInUser(email);
            if (user is null)
                return Unauthorized("User not found");
        int? userId = user.UserId;
        
        if (_loginService.CheckUserLoggedIn())
        {
            if (userId is null)
                return NotFound("userid couldnt be found");

            var attendances = await _attendanceService.GetAttendancesByUserId(userId);
            
            if (attendances == null || !attendances.Any())
            {
                return NotFound("No attendances found for the user.");
            }

            return Ok(attendances);
        }

        return BadRequest("User is not logged in.");
    }


        [HttpPost("Add")]
        public async Task<IActionResult> AddAttendance([FromBody] DateTime attendanceDate)
        {
            if (!_loginService.CheckUserLoggedIn())
            {
                return Unauthorized("User is not logged in.");
            }
            var email = _loginService.GetLoggedInUserEmail();
                        var user = await _attendanceService.GetLoggedInUser(email);
            if (user is null)
                return Unauthorized("User not found");
            int? userId = user.UserId;

            if (!userId.HasValue)
            {
                return Unauthorized("Could not identify the logged-in user.");
            }

            if (await _attendanceService.AddAttendance(user, attendanceDate))
            {
                return Ok("Attendance successfully recorded.");
            }

            return BadRequest("Attendance already exists for this date.");
        }

        [HttpPut("Update")]
        public async Task<IActionResult> UpdateAttendance([FromBody] UpdateAttendanceRequest request)
        {
            if (!_loginService.CheckUserLoggedIn())
            {
                return Unauthorized("User is not logged in.");
            }

            var email = _loginService.GetLoggedInUserEmail();
            var user = await _attendanceService.GetLoggedInUser(email);
            if (user is null)
                return Unauthorized("User not found");
            int userId = user.UserId;
            
            if (await _attendanceService.UpdateAttendance(userId, request.OldDate, request.NewDate))
            {
                return Ok("Attendance successfully updated.");
            }

            return BadRequest("Could not update attendance. Either it does not exist or the new date is already occupied.");
        }

        [HttpDelete("Delete")]
        public async Task<IActionResult> DeleteAttendance([FromBody] DateTime attendanceDate)
        {
            if (!_loginService.CheckUserLoggedIn())
            {
                return Unauthorized("User is not logged in.");
            }

            var email = _loginService.GetLoggedInUserEmail();
            var user = await _attendanceService.GetLoggedInUser(email);
            if (user is null)
                return Unauthorized("User not found");

            int userId = user.UserId;
            

            if (await _attendanceService.DeleteAttendance(userId, attendanceDate))
            {
                return Ok("Attendance successfully deleted.");
            }

            return NotFound("Attendance not found for the given date.");
        }
    }


}
