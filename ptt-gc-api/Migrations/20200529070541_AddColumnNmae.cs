using Microsoft.EntityFrameworkCore.Migrations;

namespace PTT_GC_API.Migrations
{
    public partial class AddColumnNmae : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CommentByName",
                table: "V_Audits",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CommentByName",
                table: "Audits",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CommentByName",
                table: "V_Audits");

            migrationBuilder.DropColumn(
                name: "CommentByName",
                table: "Audits");
        }
    }
}
