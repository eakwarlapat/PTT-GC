using AutoMapper;
using PTT_GC_API.Dtos.Audit;
using PTT_GC_API.Dtos.Capexs;
using PTT_GC_API.Dtos.CoDeveloper;
using PTT_GC_API.Dtos.DetailMaxInformation;
using PTT_GC_API.Dtos.ImpactTracking;
using PTT_GC_API.Dtos.Initiative;
using PTT_GC_API.Dtos.ITBudget;
using PTT_GC_API.Dtos.Owner;
using PTT_GC_API.Dtos.StrategicObjective;
using PTT_GC_API.Dtos.User;
using PTT_GC_API.Models.CapexInformation;
using PTT_GC_API.Models.CoDeveloper;
using PTT_GC_API.Models.Initiative;
using PTT_GC_API.Models.ITBudget;
using PTT_GC_API.Models.Owner;
using PTT_GC_API.Models.Strategy;
using PTT_GC_API.Models.User;

namespace PTT_GC_API.Helpers
{
    public class AutoMapperProfiles: Profile
    {
        public AutoMapperProfiles()
        {
            // User
            CreateMap<UserRegister, User>();
            CreateMap<UserEdit, User>();
            CreateMap<User, UserList>();
            CreateMap<User, UserDetail>();
            // CoDeveloper
            CreateMap<CoDeveloper, CoDeveloperList>();
            // Owner
            CreateMap<Owner, OwnerList>();
            // Initiative
            CreateMap<InitiativeCreate, Initiative>();
            CreateMap<InitiativeUpdate, Initiative>();
            CreateMap<InitiativeRequestOpex, Initiative>();
            CreateMap<InitiativeBenefitAmount, Initiative>();
            CreateMap<Initiative, InitiativeList>();
            CreateMap<Initiative, InitiativeGeneral>();
            CreateMap<Initiative, InitiativeAttachment>();
            CreateMap<Initiative, InitiativeInformation>();
            CreateMap<Initiative, InitiativeSuggestStatus>();
            CreateMap<InitiativeSubmit, Initiative>();
            CreateMap<InitiativeImpact, Initiative>();
            CreateMap<InitiativeSubmitStageStatus, Initiative>();
            CreateMap<InitiativeAddmore, Initiative>();
            // Initiative Detail Product
            CreateMap<Initiative, InitiativeProgress>();
            CreateMap<Product, InitiativeProductList>();
            CreateMap<InitiativeCreateFinancial, Financial>();
            CreateMap<InitiativeCreateDetail, InitiativeDetail>();
            // StrategicObjectiveList
            CreateMap<StrategicObjective, StrategicObjectiveList>();
            // ImpactTracking
            CreateMap<ImpactTrackingCreate, ImpactTracking>();
            CreateMap<ImpactTracking, ImpactTrackingDetail>();
            // DetailMaxInformation
            CreateMap<CreateDetailInformation, DetailInformation>();
            CreateMap<Initiative, InitiativeDetailMax>();
            // Kpi
            CreateMap<Initiative, InitiativeKpi>();
            // ShareBenefitWorkstream
            CreateMap<Initiative, InitiativeShareBenefitWorkstream>();
            //DetailCarpexs
            CreateMap<DetailCapexsCreate, DetailCapex>();
            //CapexsInformation
            CreateMap<CapexsInformations, CapexInformations>();
            CreateMap<UpdateDraft, Initiative>();
            CreateMap<UpdateCostPool, CapexInformations>();
            // ProgressDetail
            CreateMap<Initiative, InitiativeProgressAndMilestone>();
            // Status Tracking
            CreateMap<Initiative, StatusTracking>();
            // Audit
            CreateMap<V_Audit, AuditList>();
            CreateMap<LogComment, Audit>();
            // ITBudget
            CreateMap<ITBudgetCapex, ITBudgetSurvey>();
            CreateMap<ITBudgetOpex , ITBudgetSurvey>();


        }
    }
}
