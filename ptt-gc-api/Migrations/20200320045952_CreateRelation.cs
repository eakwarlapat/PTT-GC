using Microsoft.EntityFrameworkCore.Migrations;

namespace PTT_GC_API.Migrations
{
    public partial class CreateRelation : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImpactTypeOfBenefitGroupId",
                table: "ImpactTypeOfBenefits");

            migrationBuilder.AlterColumn<decimal>(
                name: "Month4",
                table: "ImpactTypeOfBenefits",
                type: "decimal(18,2)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "Month4",
                table: "ImpactTypeOfBenefits",
                type: "decimal(18,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)",
                oldNullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ImpactTypeOfBenefitGroupId",
                table: "ImpactTypeOfBenefits",
                type: "int",
                nullable: true);
        }
    }
}
