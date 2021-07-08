using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace PTT_GC_API.Migrations
{
    public partial class V_AuditSet : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "V_Audits",
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
                    ActionBy = table.Column<string>(nullable: true),
                    CommentDetail = table.Column<string>(nullable: true),
                    CommentBy = table.Column<string>(nullable: true),
                    CommentByName = table.Column<string>(nullable: true),
                    CommentDate = table.Column<DateTime>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_V_Audits", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "V_Audits");
        }
    }
}
