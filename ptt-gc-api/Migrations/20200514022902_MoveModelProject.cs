using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace PTT_GC_API.Migrations
{
    public partial class MoveModelProject : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AnnualInvestmentPlans",
                columns: table => new
                {
                    AnnualInvestmentPlanId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CapexInformationId = table.Column<int>(nullable: false),
                    InitiativeId = table.Column<int>(nullable: false),
                    InvestmentPlan = table.Column<string>(nullable: true),
                    InvestmentPlanFx = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Year1 = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Year2 = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Year3 = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Year4 = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Year5 = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Year6 = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Year7 = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Year8 = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Year9 = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Year10 = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    YearOverall = table.Column<decimal>(type: "decimal(18,2)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AnnualInvestmentPlans", x => x.AnnualInvestmentPlanId);
                });

            migrationBuilder.CreateTable(
                name: "CapexInformations",
                columns: table => new
                {
                    CapexInformationId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    InitiativeId = table.Column<int>(nullable: false),
                    StartingDate = table.Column<DateTime>(nullable: true),
                    ProjecctComRun = table.Column<DateTime>(nullable: true),
                    RequestIniNoDate = table.Column<DateTime>(nullable: true),
                    ProjectExePeriodYear = table.Column<string>(nullable: true),
                    ProjectExePeriodMonth = table.Column<string>(nullable: true),
                    CostCenterOfVP = table.Column<string>(nullable: true),
                    ProjectCost = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    ReasonOfChanging = table.Column<string>(nullable: true),
                    BudgetPeriod = table.Column<string>(nullable: true),
                    BetweenYear = table.Column<string>(nullable: true),
                    TransferForm = table.Column<string>(nullable: true),
                    PoolBudgetForm = table.Column<string>(nullable: true),
                    RequestPoolMAX = table.Column<bool>(nullable: true),
                    CostCenter = table.Column<int>(nullable: true),
                    CodeCostCenterOfVP = table.Column<string>(nullable: true),
                    SubmitTo = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CapexInformations", x => x.CapexInformationId);
                });

            migrationBuilder.CreateTable(
                name: "Currency",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CurrencyTitle = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Currency", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CustomReportDetail",
                columns: table => new
                {
                    RunningID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ReportID = table.Column<int>(nullable: true),
                    FieldName = table.Column<string>(nullable: true),
                    AggregateFunction = table.Column<string>(nullable: true),
                    Axis = table.Column<string>(nullable: true),
                    Sequence = table.Column<int>(nullable: true),
                    ColorCode = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CustomReportDetail", x => x.RunningID);
                });

            migrationBuilder.CreateTable(
                name: "CustomReportHeader",
                columns: table => new
                {
                    RunningID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ReportID = table.Column<int>(nullable: true),
                    ReportCode = table.Column<string>(nullable: true),
                    ReportName = table.Column<string>(nullable: true),
                    Description = table.Column<string>(nullable: true),
                    GraphType = table.Column<string>(nullable: true),
                    X_AxisLabel = table.Column<string>(nullable: true),
                    Y_AxisLabel = table.Column<string>(nullable: true),
                    OtherTypeLabel = table.Column<string>(nullable: true),
                    CreateUser = table.Column<string>(nullable: true),
                    CreateDate = table.Column<DateTime>(nullable: true),
                    UpdateUser = table.Column<string>(nullable: true),
                    UpdateDate = table.Column<DateTime>(nullable: true),
                    StageType = table.Column<string>(nullable: true),
                    isAccumulate = table.Column<bool>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CustomReportHeader", x => x.RunningID);
                });

            migrationBuilder.CreateTable(
                name: "CustomReportParameter",
                columns: table => new
                {
                    RunningID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ReportID = table.Column<int>(nullable: true),
                    Sequence = table.Column<int>(nullable: true),
                    ParameterName = table.Column<string>(nullable: true),
                    ParameterField = table.Column<string>(nullable: true),
                    FilterCondition = table.Column<string>(nullable: true),
                    ParameterType = table.Column<string>(nullable: true),
                    Required = table.Column<string>(nullable: true),
                    DefaultValue = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CustomReportParameter", x => x.RunningID);
                });

            migrationBuilder.CreateTable(
                name: "CustomReportReportType",
                columns: table => new
                {
                    RunningID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(nullable: true),
                    Value = table.Column<string>(nullable: true),
                    OrderBy = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CustomReportReportType", x => x.RunningID);
                });

            migrationBuilder.CreateTable(
                name: "CustomReportStageType",
                columns: table => new
                {
                    RunningID = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(nullable: true),
                    Value = table.Column<string>(nullable: true),
                    OrderBy = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CustomReportStageType", x => x.RunningID);
                });

            migrationBuilder.CreateTable(
                name: "DetailCapexs",
                columns: table => new
                {
                    DetailCapexId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    InitiativeId = table.Column<int>(nullable: false),
                    VicePresidentOfOwner = table.Column<string>(nullable: true),
                    DivisionManagerOfOwner = table.Column<string>(nullable: true),
                    ProductionProcess = table.Column<string>(nullable: true),
                    MileStoneAndSchedule = table.Column<string>(nullable: true),
                    ExpectedTargetAndResult = table.Column<string>(nullable: true),
                    ComparisonWithOther = table.Column<string>(nullable: true),
                    OtherResourcesNeeded = table.Column<string>(nullable: true),
                    OtherInvestment = table.Column<string>(nullable: true),
                    ConsistenWithCompanyStrategy = table.Column<string>(nullable: true),
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
                    UsefulLife = table.Column<string>(nullable: true),
                    DepreciationCost = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    KpisCapexId = table.Column<int>(nullable: false),
                    KpisRemark = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DetailCapexs", x => x.DetailCapexId);
                });

            migrationBuilder.CreateTable(
                name: "KpisCapexs",
                columns: table => new
                {
                    KpisCapexId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    DetailCapexId = table.Column<int>(nullable: false),
                    Kpis = table.Column<string>(nullable: true),
                    Target = table.Column<string>(nullable: true),
                    Frequency = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KpisCapexs", x => x.KpisCapexId);
                });

            migrationBuilder.CreateTable(
                name: "MonthlyInvestmentPlans",
                columns: table => new
                {
                    MonthlyInvestmentPlanId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AnnualInvestmentPlanId = table.Column<int>(nullable: false),
                    InitiativeId = table.Column<int>(nullable: false),
                    InvestmentCost = table.Column<string>(nullable: true),
                    InvestmentCostFx = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Jan = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Feb = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Mar = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Apr = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    May = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Jun = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Jul = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Aug = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Sep = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Oct = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Nov = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Dec = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    MonthlyOverall = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    YearOfMonth = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MonthlyInvestmentPlans", x => x.MonthlyInvestmentPlanId);
                });

            migrationBuilder.CreateTable(
                name: "PoolBudgetFrom",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PoolBudgetFromId = table.Column<string>(nullable: true),
                    PoolBudgetFromName = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PoolBudgetFrom", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TypeStage",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Type = table.Column<string>(nullable: true),
                    Stage = table.Column<string>(nullable: true),
                    Order = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TypeStage", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TypeStageApprover",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Type = table.Column<string>(nullable: true),
                    Stage = table.Column<string>(nullable: true),
                    Approver = table.Column<string>(nullable: true),
                    Order = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TypeStageApprover", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AnnualInvestmentPlans");

            migrationBuilder.DropTable(
                name: "CapexInformations");

            migrationBuilder.DropTable(
                name: "Currency");

            migrationBuilder.DropTable(
                name: "CustomReportDetail");

            migrationBuilder.DropTable(
                name: "CustomReportHeader");

            migrationBuilder.DropTable(
                name: "CustomReportParameter");

            migrationBuilder.DropTable(
                name: "CustomReportReportType");

            migrationBuilder.DropTable(
                name: "CustomReportStageType");

            migrationBuilder.DropTable(
                name: "DetailCapexs");

            migrationBuilder.DropTable(
                name: "KpisCapexs");

            migrationBuilder.DropTable(
                name: "MonthlyInvestmentPlans");

            migrationBuilder.DropTable(
                name: "PoolBudgetFrom");

            migrationBuilder.DropTable(
                name: "TypeStage");

            migrationBuilder.DropTable(
                name: "TypeStageApprover");
        }
    }
}
