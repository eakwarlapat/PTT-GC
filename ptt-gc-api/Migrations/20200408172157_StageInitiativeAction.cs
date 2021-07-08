using Microsoft.EntityFrameworkCore.Migrations;

namespace PTT_GC_API.Migrations
{
    public partial class StageInitiativeAction : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ApprovedBy",
                table: "Initiatives");

            migrationBuilder.DropColumn(
                name: "Approver1",
                table: "Initiatives");

            migrationBuilder.DropColumn(
                name: "Approver2",
                table: "Initiatives");

            migrationBuilder.DropColumn(
                name: "Approver3",
                table: "Initiatives");

            migrationBuilder.DropColumn(
                name: "Status1",
                table: "Initiatives");

            migrationBuilder.DropColumn(
                name: "Status2",
                table: "Initiatives");

            migrationBuilder.DropColumn(
                name: "Status3",
                table: "Initiatives");

            migrationBuilder.AddColumn<string>(
                name: "Stage",
                table: "InitiativeActions",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Stage",
                table: "InitiativeActions");

            migrationBuilder.AddColumn<string>(
                name: "ApprovedBy",
                table: "Initiatives",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Approver1",
                table: "Initiatives",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Approver2",
                table: "Initiatives",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Approver3",
                table: "Initiatives",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Status1",
                table: "Initiatives",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Status2",
                table: "Initiatives",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Status3",
                table: "Initiatives",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
