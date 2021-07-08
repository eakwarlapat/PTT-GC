using Microsoft.EntityFrameworkCore.Migrations;

namespace PTT_GC_API.Migrations
{
    public partial class UpdateRalation : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ImpactTypeOfBenefits_ImpactTrackings_ImpactTrackingId",
                table: "ImpactTypeOfBenefits");

            migrationBuilder.DropIndex(
                name: "IX_ImpactTypeOfBenefits_ImpactTrackingId",
                table: "ImpactTypeOfBenefits");

            migrationBuilder.DropColumn(
                name: "ImpactTrackingId",
                table: "ImpactTypeOfBenefits");

            migrationBuilder.AddColumn<int>(
                name: "InitiativeId",
                table: "ImpactTypeOfBenefits",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_ImpactTypeOfBenefits_InitiativeId",
                table: "ImpactTypeOfBenefits",
                column: "InitiativeId");

            migrationBuilder.AddForeignKey(
                name: "FK_ImpactTypeOfBenefits_Initiatives_InitiativeId",
                table: "ImpactTypeOfBenefits",
                column: "InitiativeId",
                principalTable: "Initiatives",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ImpactTypeOfBenefits_Initiatives_InitiativeId",
                table: "ImpactTypeOfBenefits");

            migrationBuilder.DropIndex(
                name: "IX_ImpactTypeOfBenefits_InitiativeId",
                table: "ImpactTypeOfBenefits");

            migrationBuilder.DropColumn(
                name: "InitiativeId",
                table: "ImpactTypeOfBenefits");

            migrationBuilder.AddColumn<int>(
                name: "ImpactTrackingId",
                table: "ImpactTypeOfBenefits",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_ImpactTypeOfBenefits_ImpactTrackingId",
                table: "ImpactTypeOfBenefits",
                column: "ImpactTrackingId");

            migrationBuilder.AddForeignKey(
                name: "FK_ImpactTypeOfBenefits_ImpactTrackings_ImpactTrackingId",
                table: "ImpactTypeOfBenefits",
                column: "ImpactTrackingId",
                principalTable: "ImpactTrackings",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
