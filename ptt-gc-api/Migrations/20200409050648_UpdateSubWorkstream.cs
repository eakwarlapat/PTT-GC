using Microsoft.EntityFrameworkCore.Migrations;

namespace PTT_GC_API.Migrations
{
    public partial class UpdateSubWorkstream : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SubWorkstreamTitle",
                table: "SubWorkstreams");

            migrationBuilder.DropColumn(
                name: "SubWorkstream",
                table: "DetailInformations");

            migrationBuilder.AddColumn<string>(
                name: "SubWorkstream1",
                table: "SubWorkstreams",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SubWorkstream2",
                table: "SubWorkstreams",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SubWorkstream1",
                table: "DetailInformations",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SubWorkstream2",
                table: "DetailInformations",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SubWorkstream1",
                table: "SubWorkstreams");

            migrationBuilder.DropColumn(
                name: "SubWorkstream2",
                table: "SubWorkstreams");

            migrationBuilder.DropColumn(
                name: "SubWorkstream1",
                table: "DetailInformations");

            migrationBuilder.DropColumn(
                name: "SubWorkstream2",
                table: "DetailInformations");

            migrationBuilder.AddColumn<string>(
                name: "SubWorkstreamTitle",
                table: "SubWorkstreams",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SubWorkstream",
                table: "DetailInformations",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
