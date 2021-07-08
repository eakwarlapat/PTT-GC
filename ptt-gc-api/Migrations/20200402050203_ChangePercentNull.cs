using Microsoft.EntityFrameworkCore.Migrations;

namespace PTT_GC_API.Migrations
{
    public partial class ChangePercentNull : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "percent",
                table: "ShareBenefitWorkstreams",
                newName: "Percent");

            migrationBuilder.AlterColumn<decimal>(
                name: "Percent",
                table: "ShareBenefitWorkstreams",
                type: "decimal(18,2)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Percent",
                table: "ShareBenefitWorkstreams",
                newName: "percent");

            migrationBuilder.AlterColumn<decimal>(
                name: "percent",
                table: "ShareBenefitWorkstreams",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)",
                oldNullable: true);
        }
    }
}
