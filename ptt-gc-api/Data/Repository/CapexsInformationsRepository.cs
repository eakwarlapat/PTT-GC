using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using PTT_GC_API.Data.Interface;
using PTT_GC_API.Dtos.Capexs;
using PTT_GC_API.Models.CapexInformation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PTT_GC_API.Data.Repository
{
    public class CapexsInformationsRepository : CapexsInformationsInterface
    {
        private readonly DataContext _context;
        public CapexsInformationsRepository(DataContext context)
        {
            _context = context;
        }
        public async void Add<T>(T entity) where T : class
        {
            await _context.AddAsync(entity);
        }
        public async Task<bool> Any()
        {
            return await _context.CapexInformation.AnyAsync();
        }
        public async Task<bool> Save()
        {
            return await _context.SaveChangesAsync() > 0;
        }
        
        public async Task<CapexInformations> GetCapexsInformations(int id ,string CapexType)
        {            
            //var impactTrackings = await _context.CapexInformation.SingleOrDefaultAsync(i => i.InitiativeId == id && i.CapexType.Contains(CapexType) && i.CapexStatus.Contains("Savedraft"));
            var impactTrackings = await _context.CapexInformation.OrderByDescending(p => p.Revistion).OrderByDescending(p => p.Sequent).FirstOrDefaultAsync(i => i.InitiativeId == id && i.CapexType == CapexType);
            if(impactTrackings == null)
            {
                impactTrackings = await _context.CapexInformation.OrderByDescending(p => p.Revistion).OrderByDescending(p => p.Sequent).FirstOrDefaultAsync(i => i.InitiativeId == id && i.CapexStatus == "Submit");
            }
            return impactTrackings;
        }

        public async Task<CapexInformations> GetCapexsInformations_one(int id)
        {
            //var impactTrackings = await _context.CapexInformation.SingleOrDefaultAsync(i => i.InitiativeId == id && i.CapexType.Contains(CapexType) && i.CapexStatus.Contains("Savedraft"));
            var impactTrackings = await _context.CapexInformation.OrderByDescending(p => p.CapexInformationId).FirstOrDefaultAsync(i => i.InitiativeId == id );
            //if (impactTrackings == null)
            //{
            //    impactTrackings = await _context.CapexInformation.OrderByDescending(p => p.Revistion).OrderByDescending(p => p.Sequent).FirstOrDefaultAsync(i => i.InitiativeId == id && i.CapexStatus == "Submit");
            //}
            return impactTrackings;
        }


        public async Task<CreateAnnualInvestmentPlanDtos> CreateAnnualInvestmentPlan(int id, int capexid, CreateAnnualInvestmentPlanDtos annualInvestmentPlan)
        {
            if (_context.AnnualInvestmentPlans.Any())
            {
                var AnnualInvestmentPlanList = await _context.AnnualInvestmentPlans
                .Where(i => i.InitiativeId == id && i.CapexInformationId == capexid)
                .ToListAsync();
                foreach (var entity in AnnualInvestmentPlanList)
                    _context.AnnualInvestmentPlans.Remove(entity);
                await _context.SaveChangesAsync();
            }

            foreach (var item in annualInvestmentPlan.AnnualInvestmentPlanTableDtos)
            {
                var DataannualInvestmentPlan = new AnnualInvestmentPlan
                {
                    CapexInformationId = capexid,
                    InitiativeId = id,
                    Currency = item.Currency,
                    CurrencyFx = item.CurrencyFx,
                    Year1 = item.Year1,
                    Year2 = item.Year2,
                    Year3 = item.Year3,
                    Year4 = item.Year4,
                    Year5 = item.Year5,
                    Year6 = item.Year6,
                    Year7 = item.Year7,
                    Year8 = item.Year8,
                    Year9 = item.Year9,
                    Year10 = item.Year10,
                    YearOverall = item.YearOverall,
                    PlanType = item.PlanType,
                    //ActualSpendingThisYear = item.ActualSpendingThisYear,
                    //FutureSpendingThisYear = item.FutureSpendingThisYear,
                    //CarryBudget = item.CarryBudget

                };
                await _context.AnnualInvestmentPlans.AddAsync(DataannualInvestmentPlan);
                await _context.SaveChangesAsync();
            }
            return annualInvestmentPlan;
        }

        
        public async Task<IEnumerable<AnnualInvestmentPlan>> GetAnnualInvestmentPlan(int id, int capexid)
        {
            var GetAnnualInvestmentPlanList = await _context.AnnualInvestmentPlans
            .Where(i => i.InitiativeId == id && i.CapexInformationId == capexid)
            .ToListAsync();
            return GetAnnualInvestmentPlanList;
        }

        public async Task<CreateMonthlyInvestmentPlanDtos> CreateMonthlyInvestmentPlan(int id, int capexid, CreateMonthlyInvestmentPlanDtos monthlyInvestment)
        {
            if (_context.MonthlyInvestmentPlans.Any())
            {
                var MonthlyInvestmentPlanList = await _context.MonthlyInvestmentPlans
                .Where(i => i.InitiativeId == id && i.CapexInformationId == capexid)
                .ToListAsync();
                foreach (var entity in MonthlyInvestmentPlanList)
                    _context.MonthlyInvestmentPlans.Remove(entity);
                await _context.SaveChangesAsync();
            }

            foreach (var item in monthlyInvestment.MonthlyInvestmentPlanTableDtos)
            {
                var DatamonthlyInvestmentPlan = new MonthlyInvestmentPlan
                {
                    InitiativeId = id,
                    CapexInformationId = capexid,
                    AnnualInvestmentPlanId = item.AnnualInvestmentPlanId,
                    InvestmentCost = item.InvestmentCost,
                    InvestmentCostFx = item.InvestmentCostFx,                   
                    Jan = item.Jan,
                    Feb = item.Feb,
                    Mar = item.Mar,
                    Apr = item.Apr,
                    May = item.May,
                    Jun = item.Jun,
                    Jul = item.Jul,
                    Aug = item.Aug,
                    Sep = item.Sep,
                    Oct = item.Oct,
                    Nov = item.Nov,
                    Dec = item.Dec,
                    MonthlyOverall = item.MonthlyOverall,
                    YearOfMonth = item.YearOfMonth,
                    SumMonthlyType = item.SumMonthlyType

                };
                await _context.MonthlyInvestmentPlans.AddAsync(DatamonthlyInvestmentPlan);
                await _context.SaveChangesAsync();
            }
            return monthlyInvestment;
        }
        
        public async Task<IEnumerable<MonthlyInvestmentPlan>> GetMonthlyInvestmentPlan(int id, int capexid, string year)
        {
            var GetMonthlyInvestmentPlanList = await _context.MonthlyInvestmentPlans
            .Where(i => i.InitiativeId == id && i.CapexInformationId == capexid && i.YearOfMonth.Contains(year))
            .ToListAsync();
            return GetMonthlyInvestmentPlanList;
        }

        public async Task<IEnumerable<AnnualInvestmentPlan>> GetTotalByRevisionAll(int id)
        {
            var GetAnnualInvestmentPlanList = await _context.AnnualInvestmentPlans
            .Where(i => i.InitiativeId == id && i.PlanType == "TotalBahtbyRevision")
            .ToListAsync();
            return GetAnnualInvestmentPlanList;
        }

        public async Task<IEnumerable<CapexInformations>> GetCapexsInformationBySubmit(int id)
        {  
            var GetAnnualInvestmentPlanList = await _context.CapexInformation
            .Where(i => i.InitiativeId == id && i.CapexStatus == "Submit")
            .ToListAsync();
            return GetAnnualInvestmentPlanList;
        }

        public async Task<IEnumerable<CapexInitiaitve>> GetPoolInnitiative(string pooltype, int year)
        {

            //var query = (from t1 in _context.Initiatives.AsEnumerable()
            //             join t2 in _context.CapexInformation.AsEnumerable()
            //             on t1.Id equals t2.InitiativeId

            //             where t1.InitiativeType == "Request Pool" && t1.PoolType == pooltype && t1.Stage == "VP"
            //                    && t1.Status == "wait for approval" && t2.StartingDate.Value.Year == year

            //             orderby t2.Sequent descending
            //             group t2 by t2.InitiativeId into pg
            //             select new CapexInitiaitve
            //             {
            //                 Id = t1.Id,
            //                 InitiativeCode = t1.InitiativeCode,
            //                 ProjectCost = t2.ProjectCost.Value,
            //                 AvailableBudget = t2.AvailableBudget.Value,
            //                 name = t1.InitiativeCode + " " + t1.Name

            //             }).ToList();
            var result = (from c in _context.CapexInformation.AsEnumerable()
                          orderby c.Sequent descending
                          group c by c.InitiativeId into capex
                        
                          join i in _context.Initiatives.AsEnumerable() on capex.FirstOrDefault().InitiativeId equals i.Id
                          where i.InitiativeType == "Request Pool" && i.PoolType == pooltype && i.Stage == "VP"
                                && i.Status == "wait for approval" && capex.FirstOrDefault().StartingDate.Value.Year == year
                      
                          select new CapexInitiaitve
                         {
                             Id = i.Id,
                             InitiativeCode = i.InitiativeCode,
                              ProjectCost = capex.FirstOrDefault().ProjectCost.Value,
                              AvailableBudget = capex.FirstOrDefault().AvailableBudget.Value,
                              name = i.InitiativeCode + " " + i.Name
                          }).ToList();
            return result;
           
        }

        public async Task<IEnumerable<CapexInitiaitve>> GetPoolInnitiativeByID(int poolid)
        {
            var query = (from t1 in _context.Initiatives.AsEnumerable()
                         join t2 in _context.CapexInformation.AsEnumerable()
                         on t1.Id equals t2.InitiativeId
                         where t1.Id == poolid
                         select new CapexInitiaitve
                         {
                             Id = t1.Id,
                             InitiativeCode = t1.InitiativeCode,
                             ProjectCost = t2.ProjectCost.Value,
                             AvailableBudget = t2.AvailableBudget.Value,
                             name = t1.InitiativeCode + " " + t1.Name

                         }).ToList();
            return query;
        }

        public async Task<IEnumerable<CodeCostCenterDtos>> GetCodeOfCostCenterVP(CodeCostCenterDtos data)
        {
            /*  var query = (from t1 in _context.Owners.AsEnumerable()
                           where t1.OwnerName == data.OwnerName
                           select new CodeCostCenterDtos
                           {
                               OwnerName = t1.OwnerName,
                               MainPositionCostCenter = t1.MainPositionCostCenter.Value

                           }).ToList(); */
            var query = (from t1 in _context.Owners
                         where t1.OwnerName == data.OwnerName
                         select new CodeCostCenterDtos
                         {
                             OwnerName = t1.OwnerName,
                             MainPositionCostCenter = t1.MainPositionCostCenter.Value

                         }).ToList();
            return query;
        }


        public void Update<T>(T entity) where T : class
        {
            _context.Update(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }
    }
}
