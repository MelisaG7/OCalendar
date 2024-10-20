using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace StarterKit.Migrations
{
    /// <inheritdoc />
    public partial class Rating : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Rating",
                columns: table => new
                {
                    rating = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    UserId = table.Column<int>(type: "INTEGER", nullable: false),
                    EventId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rating", x => x.rating);
                });

            migrationBuilder.UpdateData(
                table: "Event",
                keyColumn: "EventId",
                keyValue: 101,
                column: "EventDate",
                value: new DateOnly(2024, 1, 25));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Rating");

            migrationBuilder.UpdateData(
                table: "Event",
                keyColumn: "EventId",
                keyValue: 101,
                column: "EventDate",
                value: new DateOnly(2024, 10, 25));
        }
    }
}
