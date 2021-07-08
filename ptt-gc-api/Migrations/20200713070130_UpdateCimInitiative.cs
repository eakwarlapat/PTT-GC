using Microsoft.EntityFrameworkCore.Migrations;

namespace PTT_GC_API.Migrations
{
    public partial class UpdateCimInitiative : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "WorkstreamId",
                table: "UserWorkstreams");

            migrationBuilder.AddColumn<string>(
                name: "WorkstreamTitle",
                table: "UserWorkstreams",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Subworkstream2Order",
                table: "SubWorkstreams",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "WorkstreamTitle",
                table: "UserWorkstreams");

            migrationBuilder.DropColumn(
                name: "Subworkstream2Order",
                table: "SubWorkstreams");

            migrationBuilder.AddColumn<string>(
                name: "WorkstreamId",
                table: "UserWorkstreams",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
