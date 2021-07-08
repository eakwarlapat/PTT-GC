using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace PTT_GC_API.Migrations
{
    public partial class UpdateBackendLast : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ValueIL4",
                table: "BlankablePlans");

            migrationBuilder.RenameColumn(
                name: "ValueIL5",
                table: "BlankablePlans",
                newName: "BlankableValue");

            migrationBuilder.AddColumn<string>(
                name: "SystemReportType",
                table: "CustomReportHeader",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "AdditionalCost",
                table: "CapexInformations",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "SpendingActual",
                table: "AnnualInvestmentPlans",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Audits",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ChangeSetId = table.Column<int>(nullable: false),
                    InitiativeCode = table.Column<string>(nullable: true),
                    ActionType = table.Column<string>(nullable: true),
                    TableName = table.Column<string>(nullable: true),
                    PK = table.Column<string>(nullable: true),
                    FieldName = table.Column<string>(nullable: true),
                    OldValue = table.Column<string>(nullable: true),
                    NewValue = table.Column<string>(nullable: true),
                    ActionDate = table.Column<DateTime>(nullable: true),
                    ActionBy = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Audits", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CLevelTargetLines",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CLevel = table.Column<string>(nullable: true),
                    Year = table.Column<string>(nullable: true),
                    Target = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    StageType = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CLevelTargetLines", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Audits");

            migrationBuilder.DropTable(
                name: "CLevelTargetLines");

            migrationBuilder.DropColumn(
                name: "SystemReportType",
                table: "CustomReportHeader");

            migrationBuilder.DropColumn(
                name: "AdditionalCost",
                table: "CapexInformations");

            migrationBuilder.DropColumn(
                name: "SpendingActual",
                table: "AnnualInvestmentPlans");

            migrationBuilder.RenameColumn(
                name: "BlankableValue",
                table: "BlankablePlans",
                newName: "ValueIL5");

            migrationBuilder.AddColumn<decimal>(
                name: "ValueIL4",
                table: "BlankablePlans",
                type: "decimal(18,2)",
                nullable: true);
        }
    }
}
