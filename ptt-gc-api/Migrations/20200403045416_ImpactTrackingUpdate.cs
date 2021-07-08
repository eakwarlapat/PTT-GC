using Microsoft.EntityFrameworkCore.Migrations;

namespace PTT_GC_API.Migrations
{
    public partial class ImpactTrackingUpdate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IL5RunRate",
                table: "ImpactTrackings",
                newName: "IL5RunRateRecurring");

            migrationBuilder.RenameColumn(
                name: "IL4RunRate",
                table: "ImpactTrackings",
                newName: "IL5RunRateOnetime");

            migrationBuilder.AddColumn<decimal>(
                name: "IL4RunRateOnetime",
                table: "ImpactTrackings",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "IL4RunRateRecurring",
                table: "ImpactTrackings",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "IL5FixedFxOnetime",
                table: "ImpactTrackings",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "IL5FixedFxRecurring",
                table: "ImpactTrackings",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "IL5FloatFxOnetime",
                table: "ImpactTrackings",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "IL5FloatFxRecurring",
                table: "ImpactTrackings",
                type: "decimal(18,2)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IL4RunRateOnetime",
                table: "ImpactTrackings");

            migrationBuilder.DropColumn(
                name: "IL4RunRateRecurring",
                table: "ImpactTrackings");

            migrationBuilder.DropColumn(
                name: "IL5FixedFxOnetime",
                table: "ImpactTrackings");

            migrationBuilder.DropColumn(
                name: "IL5FixedFxRecurring",
                table: "ImpactTrackings");

            migrationBuilder.DropColumn(
                name: "IL5FloatFxOnetime",
                table: "ImpactTrackings");

            migrationBuilder.DropColumn(
                name: "IL5FloatFxRecurring",
                table: "ImpactTrackings");

            migrationBuilder.RenameColumn(
                name: "IL5RunRateRecurring",
                table: "ImpactTrackings",
                newName: "IL5RunRate");

            migrationBuilder.RenameColumn(
                name: "IL5RunRateOnetime",
                table: "ImpactTrackings",
                newName: "IL4RunRate");
        }
    }
}
