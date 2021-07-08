using Microsoft.EntityFrameworkCore.Migrations;

namespace PTT_GC_API.Migrations
{
    public partial class UpdateDetailTwoColumn : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProjectPropose",
                table: "DetailInformations");

            migrationBuilder.AddColumn<string>(
                name: "HaveAdditional",
                table: "DetailInformations",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "OtherKpis",
                table: "DetailInformations",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "HaveAdditional",
                table: "DetailInformations");

            migrationBuilder.DropColumn(
                name: "OtherKpis",
                table: "DetailInformations");

            migrationBuilder.AddColumn<string>(
                name: "ProjectPropose",
                table: "DetailInformations",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
