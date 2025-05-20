using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PreHast.Server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateSvarKod2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "HasLeftRight",
                table: "Svars",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "SelectedSvarLeft",
                table: "Kontrolls",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "SelectedSvarRight",
                table: "Kontrolls",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HasLeftRight",
                table: "Svars");

            migrationBuilder.DropColumn(
                name: "SelectedSvarLeft",
                table: "Kontrolls");

            migrationBuilder.DropColumn(
                name: "SelectedSvarRight",
                table: "Kontrolls");
        }
    }
}
