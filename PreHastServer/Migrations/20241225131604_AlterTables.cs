using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PreHast.Server.Migrations
{
    /// <inheritdoc />
    public partial class AlterTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Datum",
                table: "Kontrolls");

            migrationBuilder.DropColumn(
                name: "Svarkod",
                table: "Kontrolls");

            migrationBuilder.DropColumn(
                name: "SvarKod",
                table: "FinalKontrolls");

            migrationBuilder.AddColumn<int>(
                name: "FinalKontrollId",
                table: "Kontrolls",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Kontrolls_FinalKontrollId",
                table: "Kontrolls",
                column: "FinalKontrollId");

            migrationBuilder.AddForeignKey(
                name: "FK_Kontrolls_FinalKontrolls_FinalKontrollId",
                table: "Kontrolls",
                column: "FinalKontrollId",
                principalTable: "FinalKontrolls",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Kontrolls_FinalKontrolls_FinalKontrollId",
                table: "Kontrolls");

            migrationBuilder.DropIndex(
                name: "IX_Kontrolls_FinalKontrollId",
                table: "Kontrolls");

            migrationBuilder.DropColumn(
                name: "FinalKontrollId",
                table: "Kontrolls");

            migrationBuilder.AddColumn<DateTime>(
                name: "Datum",
                table: "Kontrolls",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "Svarkod",
                table: "Kontrolls",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "SvarKod",
                table: "FinalKontrolls",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
