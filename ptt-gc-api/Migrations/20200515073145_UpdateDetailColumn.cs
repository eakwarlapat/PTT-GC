using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace PTT_GC_API.Migrations
{
    public partial class UpdateDetailColumn : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Cycle",
                table: "DetailInformations");

            migrationBuilder.RenameColumn(
                name: "usefulMonth",
                table: "DetailInformations",
                newName: "UsefulMonth");

            migrationBuilder.AlterColumn<decimal>(
                name: "UsefulMonth",
                table: "DetailInformations",
                type: "decimal(18,2)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<decimal>(
                name: "UsefulYear",
                table: "DetailInformations",
                type: "decimal(18,2)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "CycleMonth",
                table: "DetailInformations",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "CycleYear",
                table: "DetailInformations",
                type: "decimal(18,2)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CycleMonth",
                table: "DetailInformations");

            migrationBuilder.DropColumn(
                name: "CycleYear",
                table: "DetailInformations");

            migrationBuilder.RenameColumn(
                name: "UsefulMonth",
                table: "DetailInformations",
                newName: "usefulMonth");

            migrationBuilder.AlterColumn<string>(
                name: "UsefulYear",
                table: "DetailInformations",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "usefulMonth",
                table: "DetailInformations",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(decimal),
                oldType: "decimal(18,2)",
                oldNullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "Cycle",
                table: "DetailInformations",
                type: "datetime2",
                nullable: true);
        }
    }
}
