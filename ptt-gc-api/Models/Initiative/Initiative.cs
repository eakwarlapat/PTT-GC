using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using PTT_GC_API.Models.DetailInformation;
using PTT_GC_API.Models.ImpactTracking;
using PTT_GC_API.Models.ProgressAndMilestone;

namespace PTT_GC_API.Models.Initiative
{
    public class Initiative
    {
        public int Id { get; set; }
        public string InitiativeCode { get; set; }
        public string Name { get; set; }
        public string Year { get; set; }
        public string PoolType { get; set; }
        public string OwnerName { get; set; }
        public string Organization { get; set; }
        public bool? Integration { get; set; }
        public string Company { get; set; }
        public string SpecifyCompany { get; set; }
        public string Plant { get; set; }
        public string SpecifyPlant { get; set; }
        public string Location { get; set; }
        public string SpecifyLocation { get; set; }
        public DateTime? RegisteringDate { get; set; }
        public DateTime? StartingDate { get; set; }
        public DateTime? FinishingDate { get; set; }
        [Column(TypeName = "nvarchar(MAX)")]
        public string Background { get; set; }
        [Column(TypeName = "nvarchar(MAX)")]
        public string ResultObjective { get; set; }
        [Column(TypeName = "nvarchar(MAX)")]
        public string ScopeOfWork { get; set; }
        public string Remark { get; set; }
        public string InitiativeType { get; set; }
        public string RequestCapex { get; set; }
        [RegularExpression(@"\d+(\.\d{1,2})?")]
        [Column(TypeName = "decimal(18,2)")]
        public decimal? CostEstCapex { get; set; }
        public string CostEstCapexType { get; set; }
        public string BudgetSource { get; set; }
        public string RequestOpex { get; set; }
        [RegularExpression(@"\d+(\.\d{1,2})?")]
        [Column(TypeName = "decimal(18,2)")]
        public decimal? CostEstOpex { get; set; }
        public string CostEstOpexType { get; set; }
        public string TypeOfInvestment { get; set; }
        public bool? Divestment { get; set; }
        public bool? InvolveItDigital { get; set; }
        public bool? RequestProjectEngineer { get; set; }
        public string BudgetType { get; set; }
        public string Ram { get; set; }
        [RegularExpression(@"\d+(\.\d{1,2})?")]
        [Column(TypeName = "decimal(18,2)")]
        public decimal? JFactor { get; set; }
        public string TypeBenefit { get; set; }
        [Column(TypeName = "decimal(18,3)")]
        public decimal? BenefitAmount { get; set; }
        public string BenefitAmountType { get; set; }
        [RegularExpression(@"\d+(\.\d{1,2})?")]
        [Column(TypeName = "decimal(18,2)")]
        public decimal? PayBackPeriod { get; set; }
        [RegularExpression(@"\d+(\.\d{1,2})?")]
        [Column(TypeName = "decimal(18,2)")]
        public decimal? Irr { get; set; }
        [RegularExpression(@"\d+(\.\d{1,2})?")]
        [Column(TypeName = "decimal(18,2)")]
        public decimal? Wacc { get; set; }
        [RegularExpression(@"\d+(\.\d{1,2})?")]
        [Column(TypeName = "decimal(18,2)")]
        public decimal? FxExchange { get; set; }
        public bool? Cim { get; set; }
        public bool? Pim { get; set; }
        public bool? Dim { get; set; }
        public bool? Max { get; set; }
        public bool? DirectCapex { get; set; }
        public bool? Cpi { get; set; }
        public bool? Strategy { get; set; }
        public bool? RandD { get; set; }
        public bool? Other { get; set; }
        public bool? TrackMax { get; set; }
        public DateTime? ApprovedDate { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string UpdatedBy { get; set; }
        public string LastActivity { get; set; }
        public bool? DeletedFlag { get; set; }
        public string Status { get; set; }
        public string Stage { get; set; }
        public string CommentCancelled { get; set; }
        public DateTime? LastSubmittedDate { get; set; }
        public int? LagacyInitiativeId { get; set; }
        public string LagacyInitiativeCode { get; set; }
        public string SecretProject { get; set; }
        public string GoToStage { get; set; }
        public string ITDigital { get; set; }
        public virtual ICollection<Attachment> Attachments { get; set; }
        public virtual ICollection<InitiativeCoDeveloper> InitiativeCoDevelopers { get; set; }
        public virtual ICollection<Product> Products { get; set; }
        public virtual ICollection<Milestone> Milestones { get; set; }
        public virtual ICollection<FinancialIndicator> FinancialIndicators { get; set; }
        public virtual Financial Financials { get; set; }
        public virtual InitiativeDetail InitiativeDetails { get; set; }
        public virtual ImpactTracking ImpactTrackings { get; set; }
        public virtual DetailInformation DetailInformations { get; set; }
        public virtual ICollection<ImpactTypeOfBenefit> ImpactTypeOfBenefits { get; set; }
        public virtual ICollection<KpiDetailInformation> KpiDetailInformations { get; set; }
        public virtual ICollection<ShareBenefitWorkstream> ShareBenefitWorkstreams { get; set; }
        public virtual ICollection<InitiativeAction> InitiativeActions { get; set; }
        public virtual ICollection<ProgressDetail> ProgressDetails { get; set; }
        public virtual ICollection<InitiativeStatusTracking> InitiativeStatusTrackings { get; set; }
    }
}