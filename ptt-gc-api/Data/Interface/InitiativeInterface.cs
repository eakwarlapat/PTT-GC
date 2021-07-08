using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using PTT_GC_API.API.Helpers;
using PTT_GC_API.Dtos.Initiative;
using PTT_GC_API.Helpers;
using PTT_GC_API.Models.Initiative;
using PTT_GC_API.Models.User;

namespace PTT_GC_API.Data.Interface
{
    public interface InitiativeInterface
    {
        void Add<T>(T entity) where T : class;
        void Update<T>(T entity) where T : class;
        void Delete<T>(T entity) where T : class;
        Task<bool> Save();
        Task<bool> Any();
        Task<int> LastIdInitiative();
        Task<Initiative> LastInitiative();
        Task<PagedList<Initiative>> GetInitiatives(InitiativeParams InitiativeParams);
        Task<Initiative> GetInitiative(int id);
        Task<string[]> InitiativeCoDeveloperCreate(int id, string[] coDevelopers);
        Task<bool> InitiativeCoDeveloperDelete(int id);
        Task<bool> CheckApproved(int id);
        Task<Attachment> InitiativeAttachmentCreate(int id, [FromForm]InitiativeCreateAttachment initiative);
        Task<Attachment> GetAttachment(int id);
        Task<InitiativeCreateProduct> CreateInitiativeProduct(int id, InitiativeCreateProduct initiativeCreateProduct);
        Task<InitiativeCreateMilestone> CreateInitiativeMilestone(int id, InitiativeCreateMilestone initiativeCreateMilestone);
        Task<InitiativeCreateFinancialIndicator> CreateFinancialIndicator(int id, InitiativeCreateFinancialIndicator initiativeFinancialIndicator);
        Task<bool> InitiativeFinancialDelete(int id);
        Task<bool> InitiativeDetailDelete(int id);
        Task<User> GetUserInitiative(string username);
        Task<Initiative> SetActionBy(int id, string username, string status, string stage);
        Task<bool> CheckApprove(int id, string actionBy);
        Task<int> RemoveInitiativeActions(int initiativeId, string actionBy);
        Task<int> CountInitiativeAction(int id);
        Task<int> CreateStagesTracking(Initiative initiative);
        Task<int> UpdateStagesTracking_OnApprove(Initiative initiative, InitiativeSubmit initiativeSubmit);
        Task<int> UpdateStagesTracking_OnSubmit(Initiative initiative, InitiativeSubmitStageStatus initiativeSubmitStageStatus, string statusDirection);
        Task<int> InsertStagesHistory(Initiative initiative, InitiativeSubmit initiativeSubmit);
        Task CallMicrosoftFlow_SendMail(int id, string action);
        Task<int> ChangeApproverStatusTrackingFromSetActionBy(Initiative initiative);
        Task<bool> isRemainsActionBy(int initiativeId, string approverType);
        Task<bool> isMatchedApproverType(int initiativeId, string approverEmail, string approverType);
        Task<int> RemoveActionBy_ByApproverType(int initiativeId, string approverType, string approverEmail);
        Task<int> UpdateLastestApproved(int initiativeId, string stage);
        Task<int> UpdateLastestSubmittedSIL(int initiativeId, string stage, DateTime? dateTime);
        Task CallMicrosoftFlow_OnApproved(int initiativeId, string actionType, string urlType);
        Task CallMicrosoftFlow_OnSubmit(int initiativeId, string direction, string urlType);
        //Task<int> UpdateStagesTracking_NextStatus(Initiative initiative, InitiativeSubmitStageStatus initiativeSubmitStageStatus);
        Task<DateTime> GetLastestUpdate(int id);
        Task<int> MyTaskInProgress(MyInitiative MyInitiative);
        Task<int> MyTaskNotStarted(MyInitiative MyInitiative);
        Task<int> MyInitiativeDraft(MyInitiative MyInitiative);
        Task<int> MyInitiativeInProgress(MyInitiative MyInitiative);
        Task<int> MyInitiativeCompleted(MyInitiative MyInitiative);
        Task<int> MyInitiativeCanceled(MyInitiative MyInitiative);
        Task<string> GetUserCompany(string email);
    }
}