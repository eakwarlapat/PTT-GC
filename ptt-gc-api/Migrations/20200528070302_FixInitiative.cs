using Microsoft.EntityFrameworkCore.Migrations;

namespace PTT_GC_API.Migrations
{
    public partial class FixInitiative : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MaxApprovers_Initiatives_InitiativeId",
                table: "MaxApprovers");

            migrationBuilder.DropIndex(
                name: "IX_MaxApprovers_InitiativeId",
                table: "MaxApprovers");

            migrationBuilder.DropColumn(
                name: "CFO",
                table: "DetailInformations");

            migrationBuilder.DropColumn(
                name: "CTO",
                table: "DetailInformations");

            migrationBuilder.DropColumn(
                name: "SponsorEvp",
                table: "DetailInformations");

            migrationBuilder.DropColumn(
                name: "ToFinance",
                table: "DetailInformations");

            migrationBuilder.DropColumn(
                name: "WorkstreamLead",
                table: "DetailInformations");

            migrationBuilder.AddColumn<decimal>(
                name: "AprAdd",
                table: "MonthlyInvestmentPlans",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "AugAdd",
                table: "MonthlyInvestmentPlans",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "DecAdd",
                table: "MonthlyInvestmentPlans",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "FebAdd",
                table: "MonthlyInvestmentPlans",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "JanAdd",
                table: "MonthlyInvestmentPlans",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "JulAdd",
                table: "MonthlyInvestmentPlans",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "JunAdd",
                table: "MonthlyInvestmentPlans",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "MarAdd",
                table: "MonthlyInvestmentPlans",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "MayAdd",
                table: "MonthlyInvestmentPlans",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "MonthlyOverallAdd",
                table: "MonthlyInvestmentPlans",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "NovAdd",
                table: "MonthlyInvestmentPlans",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "OctAdd",
                table: "MonthlyInvestmentPlans",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "SepAdd",
                table: "MonthlyInvestmentPlans",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "TotalAdditional",
                table: "AnnualInvestmentPlans",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Year10Add",
                table: "AnnualInvestmentPlans",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Year1Add",
                table: "AnnualInvestmentPlans",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Year2Add",
                table: "AnnualInvestmentPlans",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Year3Add",
                table: "AnnualInvestmentPlans",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Year4Add",
                table: "AnnualInvestmentPlans",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Year5Add",
                table: "AnnualInvestmentPlans",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Year6Add",
                table: "AnnualInvestmentPlans",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Year7Add",
                table: "AnnualInvestmentPlans",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Year8Add",
                table: "AnnualInvestmentPlans",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Year9Add",
                table: "AnnualInvestmentPlans",
                type: "decimal(18,2)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AprAdd",
                table: "MonthlyInvestmentPlans");

            migrationBuilder.DropColumn(
                name: "AugAdd",
                table: "MonthlyInvestmentPlans");

            migrationBuilder.DropColumn(
                name: "DecAdd",
                table: "MonthlyInvestmentPlans");

            migrationBuilder.DropColumn(
                name: "FebAdd",
                table: "MonthlyInvestmentPlans");

            migrationBuilder.DropColumn(
                name: "JanAdd",
                table: "MonthlyInvestmentPlans");

            migrationBuilder.DropColumn(
                name: "JulAdd",
                table: "MonthlyInvestmentPlans");

            migrationBuilder.DropColumn(
                name: "JunAdd",
                table: "MonthlyInvestmentPlans");

            migrationBuilder.DropColumn(
                name: "MarAdd",
                table: "MonthlyInvestmentPlans");

            migrationBuilder.DropColumn(
                name: "MayAdd",
                table: "MonthlyInvestmentPlans");

            migrationBuilder.DropColumn(
                name: "MonthlyOverallAdd",
                table: "MonthlyInvestmentPlans");

            migrationBuilder.DropColumn(
                name: "NovAdd",
                table: "MonthlyInvestmentPlans");

            migrationBuilder.DropColumn(
                name: "OctAdd",
                table: "MonthlyInvestmentPlans");

            migrationBuilder.DropColumn(
                name: "SepAdd",
                table: "MonthlyInvestmentPlans");

            migrationBuilder.DropColumn(
                name: "TotalAdditional",
                table: "AnnualInvestmentPlans");

            migrationBuilder.DropColumn(
                name: "Year10Add",
                table: "AnnualInvestmentPlans");

            migrationBuilder.DropColumn(
                name: "Year1Add",
                table: "AnnualInvestmentPlans");

            migrationBuilder.DropColumn(
                name: "Year2Add",
                table: "AnnualInvestmentPlans");

            migrationBuilder.DropColumn(
                name: "Year3Add",
                table: "AnnualInvestmentPlans");

            migrationBuilder.DropColumn(
                name: "Year4Add",
                table: "AnnualInvestmentPlans");

            migrationBuilder.DropColumn(
                name: "Year5Add",
                table: "AnnualInvestmentPlans");

            migrationBuilder.DropColumn(
                name: "Year6Add",
                table: "AnnualInvestmentPlans");

            migrationBuilder.DropColumn(
                name: "Year7Add",
                table: "AnnualInvestmentPlans");

            migrationBuilder.DropColumn(
                name: "Year8Add",
                table: "AnnualInvestmentPlans");

            migrationBuilder.DropColumn(
                name: "Year9Add",
                table: "AnnualInvestmentPlans");

            migrationBuilder.AddColumn<string>(
                name: "CFO",
                table: "DetailInformations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CTO",
                table: "DetailInformations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SponsorEvp",
                table: "DetailInformations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ToFinance",
                table: "DetailInformations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WorkstreamLead",
                table: "DetailInformations",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_MaxApprovers_InitiativeId",
                table: "MaxApprovers",
                column: "InitiativeId");

            migrationBuilder.AddForeignKey(
                name: "FK_MaxApprovers_Initiatives_InitiativeId",
                table: "MaxApprovers",
                column: "InitiativeId",
                principalTable: "Initiatives",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
