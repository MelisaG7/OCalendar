using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StarterKit.Migrations
{
    /// <inheritdoc />
    public partial class AddAverageRatingToEvent : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "AverageRating",
                table: "Event",
                type: "REAL",
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Event",
                keyColumn: "EventId",
                keyValue: 101,
                column: "AverageRating",
                value: null);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AverageRating",
                table: "Event");
        }
    }
}
