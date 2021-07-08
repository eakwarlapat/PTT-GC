using Microsoft.EntityFrameworkCore.Migrations;

namespace PTT_GC_API.Migrations
{
    public partial class AddStrategicObjectiveId : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "StrategicObjectiveId",
                table: "Strategies",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Strategies_StrategicObjectiveId",
                table: "Strategies",
                column: "StrategicObjectiveId");

            migrationBuilder.AddForeignKey(
                name: "FK_Strategies_StrategicObjectives_StrategicObjectiveId",
                table: "Strategies",
                column: "StrategicObjectiveId",
                principalTable: "StrategicObjectives",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Strategies_StrategicObjectives_StrategicObjectiveId",
                table: "Strategies");

            migrationBuilder.DropIndex(
                name: "IX_Strategies_StrategicObjectiveId",
                table: "Strategies");

            migrationBuilder.AddColumn<string>(
                name: "StrategicObjectiveId",
                table: "StrategicObjectives",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
