using Microsoft.EntityFrameworkCore.Migrations;

namespace PTT_GC_API.Migrations
{
    public partial class DropRunrate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IL4ActualPriceFixedFx",
                table: "ImpactTrackings");

            migrationBuilder.DropColumn(
                name: "IL5ActualPriceFloatFx",
                table: "ImpactTrackings");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "IL4ActualPriceFixedFx",
                table: "ImpactTrackings",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "IL5ActualPriceFloatFx",
                table: "ImpactTrackings",
                type: "decimal(18,2)",
                nullable: true);
        }
    }
}
