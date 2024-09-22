using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StarterKit.Migrations
{
    /// <inheritdoc />
    public partial class SeedEventData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Event",
                columns: new[] { "EventId", "AdminApproval", "Description", "EndTime", "EventDate", "Location", "StartTime", "Title" },
                values: new object[] { 101, true, "A conference about the latest in tech.", new TimeSpan(0, 17, 0, 0, 0), new DateOnly(2024, 10, 25), "Convention Center", new TimeSpan(0, 9, 0, 0, 0), "Tech Conference" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Event",
                keyColumn: "EventId",
                keyValue: 101);
        }
    }
}
