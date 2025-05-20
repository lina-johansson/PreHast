using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PreHast.Server.Migrations
{
    /// <inheritdoc />
    public partial class DoctorFinalKontrollTable2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "VardpersonalId",
                table: "DoctorFinalKontrolls",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_DoctorFinalKontrolls_VardpersonalId",
                table: "DoctorFinalKontrolls",
                column: "VardpersonalId");

            migrationBuilder.AddForeignKey(
                name: "FK_DoctorFinalKontrolls_AspNetUsers_VardpersonalId",
                table: "DoctorFinalKontrolls",
                column: "VardpersonalId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.NoAction);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DoctorFinalKontrolls_AspNetUsers_VardpersonalId",
                table: "DoctorFinalKontrolls");

            migrationBuilder.DropIndex(
                name: "IX_DoctorFinalKontrolls_VardpersonalId",
                table: "DoctorFinalKontrolls");

            migrationBuilder.DropColumn(
                name: "VardpersonalId",
                table: "DoctorFinalKontrolls");
        }
    }
}
