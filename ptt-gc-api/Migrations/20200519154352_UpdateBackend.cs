using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace PTT_GC_API.Migrations
{
    public partial class UpdateBackend : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CLevelOrder",
                table: "SubWorkstreams",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Subworkstream1Order",
                table: "SubWorkstreams",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "WorkstreamOrder",
                table: "SubWorkstreams",
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
                    ActionDate = table.Column<DateTime>(nullable: false),
                    ActionBy = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Audits", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "BlankablePlans",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Week = table.Column<int>(nullable: false),
                    CLevel = table.Column<string>(nullable: true),
                    Year = table.Column<string>(nullable: true),
                    StageType = table.Column<string>(nullable: true),
                    ValueIL5 = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    ValueIL4 = table.Column<decimal>(type: "decimal(18,2)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BlankablePlans", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Audits");

            migrationBuilder.DropTable(
                name: "BlankablePlans");

            migrationBuilder.DropColumn(
                name: "CLevelOrder",
                table: "SubWorkstreams");

            migrationBuilder.DropColumn(
                name: "Subworkstream1Order",
                table: "SubWorkstreams");

            migrationBuilder.DropColumn(
                name: "WorkstreamOrder",
                table: "SubWorkstreams");
        }
    }
}
