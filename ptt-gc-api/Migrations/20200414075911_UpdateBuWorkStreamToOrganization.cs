using Microsoft.EntityFrameworkCore.Migrations;

namespace PTT_GC_API.Migrations
{
    public partial class UpdateBuWorkStreamToOrganization : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BuWorkStream",
                table: "Initiatives");

            migrationBuilder.AlterColumn<string>(
                name: "Remark",
                table: "Initiatives",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(MAX)",
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Organization",
                table: "Initiatives",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Organization",
                table: "Initiatives");

            migrationBuilder.AlterColumn<string>(
                name: "Remark",
                table: "Initiatives",
                type: "nvarchar(MAX)",
                nullable: true,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BuWorkStream",
                table: "Initiatives",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
