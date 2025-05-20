using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PreHast.Server.Migrations
{
    /// <inheritdoc />
    public partial class DoctorFinalKontrollTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DoctorFinalKontrolls",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Seen = table.Column<bool>(type: "bit", nullable: false),
                    SeenDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    FinalKontrollId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DoctorFinalKontrolls", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DoctorFinalKontrolls_FinalKontrolls_FinalKontrollId",
                        column: x => x.FinalKontrollId,
                        principalTable: "FinalKontrolls",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DoctorFinalKontrolls_FinalKontrollId",
                table: "DoctorFinalKontrolls",
                column: "FinalKontrollId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DoctorFinalKontrolls");
        }
    }
}
