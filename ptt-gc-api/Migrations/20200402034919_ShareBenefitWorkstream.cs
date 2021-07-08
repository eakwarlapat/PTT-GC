using Microsoft.EntityFrameworkCore.Migrations;

namespace PTT_GC_API.Migrations
{
    public partial class ShareBenefitWorkstream : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImpactTrackingId",
                table: "ShareBenefitWorkstreams");

            migrationBuilder.AddColumn<int>(
                name: "InitiativeId",
                table: "ShareBenefitWorkstreams",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_ShareBenefitWorkstreams_InitiativeId",
                table: "ShareBenefitWorkstreams",
                column: "InitiativeId");

            migrationBuilder.AddForeignKey(
                name: "FK_ShareBenefitWorkstreams_Initiatives_InitiativeId",
                table: "ShareBenefitWorkstreams",
                column: "InitiativeId",
                principalTable: "Initiatives",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ShareBenefitWorkstreams_Initiatives_InitiativeId",
                table: "ShareBenefitWorkstreams");

            migrationBuilder.DropIndex(
                name: "IX_ShareBenefitWorkstreams_InitiativeId",
                table: "ShareBenefitWorkstreams");

            migrationBuilder.DropColumn(
                name: "InitiativeId",
                table: "ShareBenefitWorkstreams");

            migrationBuilder.AddColumn<int>(
                name: "ImpactTrackingId",
                table: "ShareBenefitWorkstreams",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
