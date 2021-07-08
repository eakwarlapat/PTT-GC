using Microsoft.EntityFrameworkCore.Migrations;

namespace PTT_GC_API.Migrations
{
    public partial class AddAndRemoveColumnDetail : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Checklist",
                table: "DetailInformations");

            migrationBuilder.DropColumn(
                name: "UsefulLife",
                table: "DetailInformations");

            migrationBuilder.AddColumn<string>(
                name: "UsefulYear",
                table: "DetailInformations",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "usefulMonth",
                table: "DetailInformations",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UsefulYear",
                table: "DetailInformations");

            migrationBuilder.DropColumn(
                name: "usefulMonth",
                table: "DetailInformations");

            migrationBuilder.AddColumn<bool>(
                name: "Checklist",
                table: "DetailInformations",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UsefulLife",
                table: "DetailInformations",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
