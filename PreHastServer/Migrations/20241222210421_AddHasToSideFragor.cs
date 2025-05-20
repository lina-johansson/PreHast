using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PreHast.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddHasToSideFragor : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HasLeftRight",
                table: "Svars");

            migrationBuilder.AddColumn<bool>(
                name: "HasLeftRight",
                table: "Fragors",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HasLeftRight",
                table: "Fragors");

            migrationBuilder.AddColumn<bool>(
                name: "HasLeftRight",
                table: "Svars",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }
    }
}
