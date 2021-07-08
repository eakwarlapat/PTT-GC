using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using PTT_GC_API.Dtos.Capexs;
using PTT_GC_API.Models.CapexInformation;

namespace PTT_GC_API.Data.Interface
{
    public interface CapexsInformationsInterface 
    {
        void Add<T>(T entity) where T : class;
        void Update<T>(T entity) where T : class;
        void Delete<T>(T entity) where T : class;
        Task<bool> Save();
        Task<bool> Any();
        Task<CapexInformations> GetCapexsInformations(int id, string CapexType);
        Task<CapexInformations> GetCapexsInformations_one(int id);
        Task<CreateAnnualInvestmentPlanDtos> CreateAnnualInvestmentPlan(int id,int capexid ,CreateAnnualInvestmentPlanDtos annualInvestmentPlan);
        
        Task<IEnumerable<AnnualInvestmentPlan>> GetAnnualInvestmentPlan(int id, int capexid);

        Task<CreateMonthlyInvestmentPlanDtos> CreateMonthlyInvestmentPlan(int id,int capexid,CreateMonthlyInvestmentPlanDtos annualInvestmentPlan);
        
        Task<IEnumerable<MonthlyInvestmentPlan>> GetMonthlyInvestmentPlan(int id, int capexid, string  year);

        Task<IEnumerable<AnnualInvestmentPlan>> GetTotalByRevisionAll(int id);

        Task<IEnumerable<CapexInformations>> GetCapexsInformationBySubmit(int id);

        Task<IEnumerable<CapexInitiaitve>> GetPoolInnitiative(string pooltype, int year);

        Task<IEnumerable<CapexInitiaitve>> GetPoolInnitiativeByID(int poolid);

        Task<IEnumerable<CodeCostCenterDtos>> GetCodeOfCostCenterVP(CodeCostCenterDtos data);
    }
}