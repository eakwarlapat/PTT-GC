using Microsoft.EntityFrameworkCore.Migrations;

namespace PTT_GC_API.Migrations
{
    public partial class CalDetailMax : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "Baseline",
                table: "DetailInformations",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "BaselineHistorical",
                table: "DetailInformations",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "BaselineNonHistorical",
                table: "DetailInformations",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Saving",
                table: "DetailInformations",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "SavingHistorical",
                table: "DetailInformations",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "SavingNonHistorical",
                table: "DetailInformations",
                type: "decimal(18,2)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Baseline",
                table: "DetailInformations");

            migrationBuilder.DropColumn(
                name: "BaselineHistorical",
                table: "DetailInformations");

            migrationBuilder.DropColumn(
                name: "BaselineNonHistorical",
                table: "DetailInformations");

            migrationBuilder.DropColumn(
                name: "Saving",
                table: "DetailInformations");

            migrationBuilder.DropColumn(
                name: "SavingHistorical",
                table: "DetailInformations");

            migrationBuilder.DropColumn(
                name: "SavingNonHistorical",
                table: "DetailInformations");
        }
    }
}
