using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace PTT_GC_API.Migrations
{
    public partial class UpdateCapexBudgetSurvey : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "Effective",
                table: "CapexBudgetSurveys",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Impact",
                table: "CapexBudgetSurveys",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Law",
                table: "CapexBudgetSurveys",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "CapexBudgetSurveys",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Effective",
                table: "CapexBudgetSurveys");

            migrationBuilder.DropColumn(
                name: "Impact",
                table: "CapexBudgetSurveys");

            migrationBuilder.DropColumn(
                name: "Law",
                table: "CapexBudgetSurveys");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "CapexBudgetSurveys");
        }
    }
}
