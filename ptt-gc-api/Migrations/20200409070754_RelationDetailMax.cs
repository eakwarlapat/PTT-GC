using Microsoft.EntityFrameworkCore.Migrations;

namespace PTT_GC_API.Migrations
{
    public partial class RelationDetailMax : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_DetailInformations_InitiativeId",
                table: "DetailInformations",
                column: "InitiativeId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_DetailInformations_Initiatives_InitiativeId",
                table: "DetailInformations",
                column: "InitiativeId",
                principalTable: "Initiatives",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_DetailInformations_Initiatives_InitiativeId",
                table: "DetailInformations");

            migrationBuilder.DropIndex(
                name: "IX_DetailInformations_InitiativeId",
                table: "DetailInformations");
        }
    }
}
