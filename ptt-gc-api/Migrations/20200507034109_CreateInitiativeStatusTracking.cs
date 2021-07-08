using Microsoft.EntityFrameworkCore.Migrations;

namespace PTT_GC_API.Migrations
{
    public partial class CreateInitiativeStatusTracking : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CLevel",
                table: "WorkStreams",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "InitiativeStatusTrackings",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Status = table.Column<string>(nullable: true),
                    Stage = table.Column<string>(nullable: true),
                    ApprovedBy = table.Column<string>(nullable: true),
                    ApprovedDate = table.Column<string>(nullable: true),
                    Sequence = table.Column<int>(nullable: false),
                    ProcessType = table.Column<string>(nullable: true),
                    HistoryId = table.Column<int>(nullable: false),
                    InitiativeId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InitiativeStatusTrackings", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "InitiativeStatusTrackings");

            migrationBuilder.DropColumn(
                name: "CLevel",
                table: "WorkStreams");
        }
    }
}
