using Microsoft.EntityFrameworkCore;
using PTT_GC_API.Models.User;
using PTT_GC_API.Models.Initiative;
using PTT_GC_API.Models.Milestone;
using PTT_GC_API.Models.Product;
using PTT_GC_API.Models.TypeOfInvestment;
using PTT_GC_API.Models.Organization;
using PTT_GC_API.Models.CoDeveloper;
using PTT_GC_API.Models.EntryMode;
using PTT_GC_API.Models.Owner;
using PTT_GC_API.Models.Plant;
using PTT_GC_API.Models.Strategy;
using PTT_GC_API.Models.TypeOfBenefit;
using PTT_GC_API.Models.WorkStream;
using PTT_GC_API.Models.ImpactTracking;
using PTT_GC_API.Models.DetailInformation;
using PTT_GC_API.Models.CapexInformation;
using PTT_GC_API.Models.PoolBudget;
using PTT_GC_API.Models.Currency;
using PTT_GC_API.Models.SettingChart;
using PTT_GC_API.Models.ProgressAndMilestone;
using PTT_GC_API.Models.TypeofStage;
using PTT_GC_API.Models.OverviewPermission;
using PTT_GC_API.Models.Chart;
using PTT_GC_API.Models.TempHRWebService;
using PTT_GC_API.Models.Permission;
using PTT_GC_API.Models.URLTableSetting;
using PTT_GC_API.Models.ITBudget;
using PTT_GC_API.Models.IF;

namespace PTT_GC_API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }
        public DbSet<User> Users { get; set; }
        public DbSet<Plant> Plants { get; set; }
        public DbSet<Organization> Organizations { get; set; }
        public DbSet<CoDeveloper> CoDevelopers { get; set; }
        public DbSet<Owner> Owners { get; set; }
        public DbSet<TypeOfInvestment> TypeOfInvestments { get; set; }
        public DbSet<Initiative> Initiatives { get; set; }
        public DbSet<Attachment> Attachments { get; set; }
        public DbSet<InitiativeCoDeveloper> InitiativeCoDevelopers { get; set; }
        public DbSet<InitiativeDetail> InitiativeDetails { get; set; }
        public DbSet<FinancialIndicator> FinancialIndicators { get; set; }
        public DbSet<Milestone> Milestones { get; set; }
        public DbSet<MilestoneStatus> MilestoneStatuses { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductUnit> ProductUnits { get; set; }
        public DbSet<Strategy> Strategies { get; set; }
        public DbSet<StrategicObjective> StrategicObjectives { get; set; }
        public DbSet<EntryMode> EntryModes { get; set; }
        public DbSet<Financial> Financials { get; set; }
        public DbSet<TypeOfBenefit> TypeOfBenefits { get; set; }
        public DbSet<WorkStream> WorkStreams { get; set; }
        public DbSet<ImpactTracking> ImpactTrackings { get; set; }
        public DbSet<ImpactTypeOfBenefit> ImpactTypeOfBenefits { get; set; }
        public DbSet<ShareBenefitWorkstream> ShareBenefitWorkstreams { get; set; }
        public DbSet<DetailInformation> DetailInformations { get; set; }
        public DbSet<InitiativeTypeMax> InitiativeTypeMaxs { get; set; }
        public DbSet<SubWorkstream> SubWorkstreams { get; set; }
        public DbSet<Kpis> Kpises { get; set; }
        public DbSet<Frequency> Frequencies { get; set; }
        public DbSet<KpiDetailInformation> KpiDetailInformations { get; set; }
        public DbSet<InitiativeAction> InitiativeActions { get; set; }
        public DbSet<DetailCapex> DetailCapexs { get; set; }
        public DbSet<KpisCapex> KpisCapexs { get; set; }
        public DbSet<AnnualInvestmentPlan> AnnualInvestmentPlans { get; set; }
        public DbSet<CapexInformations> CapexInformations { get; set; }
        public DbSet<MonthlyInvestmentPlan> MonthlyInvestmentPlans { get; set; }
        public DbSet<PoolBudgetFrom> PoolBudgetFrom { get; set; }
        public DbSet<CapexInformations> CapexInformation { get; set; }
        public DbSet<Currency> Currency { get; set; }
        public DbSet<CustomReportDetail> CustomReportDetail { get; set; }
        public DbSet<CustomReportHeader> CustomReportHeader { get; set; }
        public DbSet<CustomReportParameter> CustomReportParameter { get; set; }
        public DbSet<ProgressDetail> ProgressDetails { get; set; }
        public DbSet<CustomReportReportType> CustomReportReportType { get; set; }
        public DbSet<CustomReportStageType> CustomReportStageType { get; set; }
        public DbSet<InitiativeStatusTracking> InitiativeStatusTrackings { get; set; }
        public DbSet<OverviewPermission> OverviewPermissions { get; set; }
        public DbSet<V_Graph_DDL_Param> V_Graph_DDL_Param { get; set; }
        public DbSet<V_Graph_DDL_X_Axis> V_Graph_DDL_X_Axis { get; set; }
        public DbSet<V_Graph_DDL_Y_Axis> V_Graph_DDL_Y_Axis { get; set; }
        public DbSet<V_CustomExcel1_Y> V_CustomExcel1_Y { get; set; }
        public DbSet<TypeStage> TypeStage { get; set; }
        public DbSet<TypeStageApprover> TypeStageApprover { get; set; }
        public DbSet<BlankablePlan> BlankablePlans { get; set; }
        public DbSet<CLevelTargetLine> CLevelTargetLines { get; set; }
        public DbSet<Audit> Audits { get; set; }
        public DbSet<V_Audit> V_Audits { get; set; }
        public DbSet<MaxApprover> MaxApprovers { get; set; }
        public DbSet<MaxApproverSetting> MaxApproverSettings { get; set; }
        public DbSet<TempHRWebService> TempHRWebServices { get; set; }
        public DbSet<InitiativeStatusHistory> InitiativeStatusHistory { get; set; }

       //Permission
        public DbSet<PageSetting> PageSettings { get; set; }
        public DbSet<RoleManagement> RoleManagements { get; set; }
        public DbSet<RoleSetting> RoleSettings { get; set; }
        public DbSet<SectionSetting> SectionSettings { get; set; }
        public DbSet<UserManagement> UserManagements { get; set; }
        public DbSet<UserOrganization> UserOrganizations { get; set; }
        public DbSet<UserRole> UserRoles { get; set; }
        public DbSet<UserWorkstream> UserWorkstreams { get; set; }
        public DbSet<URLTable> URLTables { get; set; }

        public DbSet<ITAsset> ITAssets { get; set; }  // Master Data
        public DbSet<CapexTopic> CapexTopics { get; set; } // Master Data
        public DbSet<CapexChoice> CapexChoices { get; set; } // Master Data
        public DbSet<CapexBudgetSurvey> CapexBudgetSurveys { get; set; }
        public DbSet<ITBudgetSurvey> ITBudgetSurveys { get; set; }
        public DbSet<ITBudgetSurveyAsset> ITBudgetSurveyAssets { get; set; }
        public DbSet<Procurement> Procurements { get; set; }
        public DbSet<IncomingFile> IncomingFile { get; set; }
        public DbSet<OutgoingFile> OutgoingFile { get; set; }
        public DbSet<TmpInitiativeCodeIF> TmpInitiativeIdIFs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<V_Graph_DDL_Param>(e => e.ToView("v_Graph_DDL_Param").HasNoKey());
            modelBuilder.Entity<V_Graph_DDL_X_Axis>(e => e.ToView("v_Graph_DDL_X_Axis").HasNoKey());
            modelBuilder.Entity<V_Graph_DDL_Y_Axis>(e => e.ToView("v_Graph_DDL_Y_Axis").HasNoKey());
            modelBuilder.Entity<V_CustomExcel1_Y>(e => e.ToView("v_CustomExcel1_Y").HasNoKey());
            // modelBuilder.Entity<V_Audit>(e => e.ToView("v_Audits").HasNoKey());
        }

    }
}