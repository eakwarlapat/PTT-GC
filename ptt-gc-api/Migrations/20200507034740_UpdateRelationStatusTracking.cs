using Microsoft.EntityFrameworkCore.Migrations;

namespace PTT_GC_API.Migrations
{
    public partial class UpdateRelationStatusTracking : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_InitiativeStatusTrackings_InitiativeId",
                table: "InitiativeStatusTrackings",
                column: "InitiativeId");

            migrationBuilder.AddForeignKey(
                name: "FK_InitiativeStatusTrackings_Initiatives_InitiativeId",
                table: "InitiativeStatusTrackings",
                column: "InitiativeId",
                principalTable: "Initiatives",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InitiativeStatusTrackings_Initiatives_InitiativeId",
                table: "InitiativeStatusTrackings");

            migrationBuilder.DropIndex(
                name: "IX_InitiativeStatusTrackings_InitiativeId",
                table: "InitiativeStatusTrackings");
        }
    }
}
