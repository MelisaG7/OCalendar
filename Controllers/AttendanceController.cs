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

        [HttpPost("Add")]
        public async Task<IActionResult> AddAttendance([FromBody] DateTime attendanceDate)
        {
            if (!_loginService.CheckUserLoggedIn())
            {
                return Unauthorized("User is not logged in.");
            }
            var email = _loginService.GetLoggedInUserEmail();
            var userId = await _attendanceService.GetLoggedInUserId(email);
            if (!userId.HasValue)
            {
                return Unauthorized("Could not identify the logged-in user.");
            }

            if (await _attendanceService.AddAttendance(userId.Value, attendanceDate))
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
            var userId = await _attendanceService.GetLoggedInUserId(email);
            if (!userId.HasValue)
            {
                return Unauthorized("Could not identify the logged-in user.");
            }

            if (await _attendanceService.UpdateAttendance(userId.Value, request.OldDate, request.NewDate))
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
            var userId = await _attendanceService.GetLoggedInUserId(email);
            if (!userId.HasValue)
            {
                return Unauthorized("Could not identify the logged-in user.");
            }

            if (await _attendanceService.DeleteAttendance(userId.Value, attendanceDate))
            {
                return Ok("Attendance successfully deleted.");
            }

            return NotFound("Attendance not found for the given date.");
        }
    }

}
