using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace PTT_GC_API.Migrations
{
    public partial class DetailInformation : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ImpactTotalTypeOfBenefit");

            migrationBuilder.CreateTable(
                name: "DetailInformations",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    InitiativeYear = table.Column<string>(nullable: true),
                    StrategicObjective = table.Column<string>(nullable: true),
                    Strategy = table.Column<string>(nullable: true),
                    InitiativeTypeMax = table.Column<string>(nullable: true),
                    Workstream = table.Column<string>(nullable: true),
                    SubWorkstream = table.Column<string>(nullable: true),
                    IL3Date = table.Column<DateTime>(nullable: true),
                    IL4Date = table.Column<DateTime>(nullable: true),
                    IL5Date = table.Column<DateTime>(nullable: true),
                    SponsorEvp = table.Column<string>(nullable: true),
                    WorkstreamLead = table.Column<string>(nullable: true),
                    ToFinance = table.Column<string>(nullable: true),
                    CTO = table.Column<string>(nullable: true),
                    CFO = table.Column<string>(nullable: true),
                    ProductionProcess = table.Column<string>(nullable: true),
                    ComparisonWithOther = table.Column<string>(nullable: true),
                    OtherInvestment = table.Column<string>(nullable: true),
                    KeySuccessFactor = table.Column<string>(nullable: true),
                    SynergyBenefit = table.Column<string>(nullable: true),
                    OtherStrategic = table.Column<string>(nullable: true),
                    MarketOverview = table.Column<string>(nullable: true),
                    PotentialCustomer = table.Column<string>(nullable: true),
                    SalesPlan = table.Column<string>(nullable: true),
                    SourceOfFeedstock = table.Column<string>(nullable: true),
                    OtherBusiness = table.Column<string>(nullable: true),
                    SafetyIndex = table.Column<string>(nullable: true),
                    CorporateImageIndex = table.Column<string>(nullable: true),
                    OtherQuality = table.Column<string>(nullable: true),
                    BaseCase = table.Column<string>(nullable: true),
                    ProjectIrrBaseCase = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    NpvBaseCase = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    PaybackBaseCase = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    EbitdaBaseCase = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    OptimisticCase = table.Column<string>(nullable: true),
                    ProjectIrrOptimisticCase = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    NpvOptimisticCase = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    PaybackOptimisticCase = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    EbitdaOptimisticCase = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    PessimisticCase = table.Column<string>(nullable: true),
                    ProjectIrrPessimisticCase = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    NpvPessimisticCase = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    PaybackPessimisticCase = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    EbitdaPessimisticCase = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    DepreciationCost = table.Column<string>(nullable: true),
                    UsefulLife = table.Column<string>(nullable: true),
                    Remark = table.Column<string>(nullable: true),
                    SubmitTo = table.Column<string>(nullable: true),
                    InitiativeId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DetailInformations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Frequencies",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FrequencyTitle = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Frequencies", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "InitiativeTypeMaxs",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    InitiativeTypeMaxTitle = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_InitiativeTypeMaxs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "KpiDetailInformations",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Kpis = table.Column<string>(nullable: true),
                    Target = table.Column<string>(nullable: true),
                    Frequency = table.Column<string>(nullable: true),
                    InitiativeId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KpiDetailInformations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_KpiDetailInformations_Initiatives_InitiativeId",
                        column: x => x.InitiativeId,
                        principalTable: "Initiatives",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Kpises",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    KpisTitle = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Kpises", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SubWorkstreams",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    WorkStreamTitle = table.Column<string>(nullable: true),
                    SubWorkstreamTitle = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SubWorkstreams", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_KpiDetailInformations_InitiativeId",
                table: "KpiDetailInformations",
                column: "InitiativeId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DetailInformations");

            migrationBuilder.DropTable(
                name: "Frequencies");

            migrationBuilder.DropTable(
                name: "InitiativeTypeMaxs");

            migrationBuilder.DropTable(
                name: "KpiDetailInformations");

            migrationBuilder.DropTable(
                name: "Kpises");

            migrationBuilder.DropTable(
                name: "SubWorkstreams");

            migrationBuilder.CreateTable(
                name: "ImpactTotalTypeOfBenefit",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ImpactTypeOfBenefitTable = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    InitiativeId = table.Column<int>(type: "int", nullable: false),
                    Month1 = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Month10 = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Month11 = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Month12 = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Month13 = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Month14 = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Month15 = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Month16 = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Month17 = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Month18 = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Month19 = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Month2 = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Month20 = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Month21 = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Month22 = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Month23 = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Month24 = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Month25 = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Month26 = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Month27 = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Month28 = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Month29 = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Month3 = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Month30 = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Month31 = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Month32 = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Month33 = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Month34 = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Month35 = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Month36 = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Month4 = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Month5 = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Month6 = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Month7 = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Month8 = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Month9 = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    RunRate = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    TypeOfBenefit = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    VersionPrice = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ImpactTotalTypeOfBenefit", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ImpactTotalTypeOfBenefit_Initiatives_InitiativeId",
                        column: x => x.InitiativeId,
                        principalTable: "Initiatives",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_ImpactTotalTypeOfBenefit_InitiativeId",
                table: "ImpactTotalTypeOfBenefit",
                column: "InitiativeId");
        }
    }
}
