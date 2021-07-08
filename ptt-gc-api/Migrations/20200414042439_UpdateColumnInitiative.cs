using Microsoft.EntityFrameworkCore.Migrations;

namespace PTT_GC_API.Migrations
{
    public partial class UpdateColumnInitiative : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Integration",
                table: "Initiatives",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ScopeOfWork",
                table: "Initiatives",
                type: "nvarchar(MAX)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Integration",
                table: "Initiatives");

            migrationBuilder.DropColumn(
                name: "ScopeOfWork",
                table: "Initiatives");
        }
    }
}
