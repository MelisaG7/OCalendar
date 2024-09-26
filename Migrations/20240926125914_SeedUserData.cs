using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace StarterKit.Migrations
{
    /// <inheritdoc />
    public partial class SeedUserData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "User",
                columns: new[] { "UserId", "Email", "FirstName", "LastName", "Password", "RecuringDays" },
                values: new object[,]
                {
                    { 1, "john.doe@example.com", "John", "Doe", "^�H��(qQ��o��)'s`=\rj���*�rB�", "mo,tu,we" },
                    { 2, "jane.smith@example.com", "Jane", "Smith", "��6� ry@�M��%>��v�im��,���gg�", "th,fr" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "User",
                keyColumn: "UserId",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "User",
                keyColumn: "UserId",
                keyValue: 2);
        }
    }
}
