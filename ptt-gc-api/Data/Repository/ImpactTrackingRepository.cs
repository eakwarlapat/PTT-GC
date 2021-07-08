using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PTT_GC_API.Data.Interface;
using PTT_GC_API.Dtos.ImpactTracking;
using PTT_GC_API.Models.ImpactTracking;
using PTT_GC_API.Models.Initiative;

namespace PTT_GC_API.Data.Repository
{
    public class ImpactTrackingRepository : ImpactTrackingInterface
    {
        private readonly DataContext _context;
        public ImpactTrackingRepository(DataContext context)
        {
            _context = context;
        }

        public async void Add<T>(T entity) where T : class
        {
            await _context.AddAsync(entity);
        }

        public void Update<T>(T entity) where T : class
        {
            _context.Update(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public async Task<bool> Save()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> Any()
        {
            return await _context.Initiatives.AnyAsync();
        }

        public async Task<bool> ImpactTrackingDelete(int id)
        {
            if (_context.ImpactTrackings.Any())
            {
                var ImpactTrackingList = await _context.ImpactTrackings.Where(i => i.InitiativeId == id).ToListAsync();
                foreach (var entity in ImpactTrackingList)
                    _context.ImpactTrackings.Remove(entity);
                await _context.SaveChangesAsync();
                return true;
            }
            return true;
        }

        public async Task<ImpactTracking> GetImpactTracking(int id)
        {
            var impactTrackings = await _context.ImpactTrackings.FirstOrDefaultAsync(i => i.InitiativeId == id);
            return impactTrackings;
        }

        public async Task<FirstRunRateCreate> CreateFirstRunRate(int id, FirstRunRateCreate firstRunRateCreate)
        {
            if (_context.ImpactTypeOfBenefits.Any())
            {
                var ImpactTypeOfBenefitsList = await _context.ImpactTypeOfBenefits
                .Where(i => i.InitiativeId == id)
                .Where(i => i.ImpactTypeOfBenefitTable == "FirstRunRate")
                .ToListAsync();
                foreach (var entity in ImpactTypeOfBenefitsList)
                    _context.ImpactTypeOfBenefits.Remove(entity);
                await _context.SaveChangesAsync();
            }

            foreach (var item in firstRunRateCreate.FirstRunRateTable)
            {
                for (int i = 1; i <= 3; i++)
                {
                    var impactTypeOfBenefit = new ImpactTypeOfBenefit
                    {
                        ImpactTypeOfBenefitTable = "FirstRunRate",
                        TypeOfBenefit = item.TypeOfBenefit,
                        InitiativeId = id
                    };
                    switch (i)
                    {
                        case 1: impactTypeOfBenefit.VersionPrice = item.VersionPrice.Row1; break;
                        case 2: impactTypeOfBenefit.VersionPrice = item.VersionPrice.Row2; break;
                        case 3: impactTypeOfBenefit.VersionPrice = item.VersionPrice.Row3; break;
                    }
                    switch (i)
                    {
                        case 1: impactTypeOfBenefit.RunRate = item.RunRate.Row1; break;
                        case 2: impactTypeOfBenefit.RunRate = item.RunRate.Row2; break;
                        case 3: impactTypeOfBenefit.RunRate = item.RunRate.Row3; break;
                    }
                    switch (i)
                    {
                        case 1:
                            impactTypeOfBenefit.Month1 = item.monthRows1.Month1;
                            impactTypeOfBenefit.Month2 = item.monthRows1.Month2;
                            impactTypeOfBenefit.Month3 = item.monthRows1.Month3;
                            impactTypeOfBenefit.Month4 = item.monthRows1.Month4;
                            impactTypeOfBenefit.Month5 = item.monthRows1.Month5;
                            impactTypeOfBenefit.Month6 = item.monthRows1.Month6;
                            impactTypeOfBenefit.Month7 = item.monthRows1.Month7;
                            impactTypeOfBenefit.Month8 = item.monthRows1.Month8;
                            impactTypeOfBenefit.Month9 = item.monthRows1.Month9;
                            impactTypeOfBenefit.Month10 = item.monthRows1.Month10;
                            impactTypeOfBenefit.Month11 = item.monthRows1.Month11;
                            impactTypeOfBenefit.Month12 = item.monthRows1.Month12;
                            impactTypeOfBenefit.Month13 = item.monthRows1.Month13;
                            impactTypeOfBenefit.Month14 = item.monthRows1.Month14;
                            impactTypeOfBenefit.Month15 = item.monthRows1.Month15;
                            impactTypeOfBenefit.Month16 = item.monthRows1.Month16;
                            impactTypeOfBenefit.Month17 = item.monthRows1.Month17;
                            impactTypeOfBenefit.Month18 = item.monthRows1.Month18;
                            impactTypeOfBenefit.Month19 = item.monthRows1.Month19;
                            impactTypeOfBenefit.Month20 = item.monthRows1.Month20;
                            impactTypeOfBenefit.Month21 = item.monthRows1.Month21;
                            impactTypeOfBenefit.Month22 = item.monthRows1.Month22;
                            impactTypeOfBenefit.Month23 = item.monthRows1.Month23;
                            impactTypeOfBenefit.Month24 = item.monthRows1.Month24;
                            impactTypeOfBenefit.Month25 = item.monthRows1.Month25;
                            impactTypeOfBenefit.Month26 = item.monthRows1.Month26;
                            impactTypeOfBenefit.Month27 = item.monthRows1.Month27;
                            impactTypeOfBenefit.Month28 = item.monthRows1.Month28;
                            impactTypeOfBenefit.Month29 = item.monthRows1.Month29;
                            impactTypeOfBenefit.Month30 = item.monthRows1.Month30;
                            impactTypeOfBenefit.Month31 = item.monthRows1.Month31;
                            impactTypeOfBenefit.Month32 = item.monthRows1.Month32;
                            impactTypeOfBenefit.Month33 = item.monthRows1.Month33;
                            impactTypeOfBenefit.Month34 = item.monthRows1.Month34;
                            impactTypeOfBenefit.Month35 = item.monthRows1.Month35;
                            impactTypeOfBenefit.Month36 = item.monthRows1.Month36;
                            break;
                        case 2:
                            impactTypeOfBenefit.Month1 = item.monthRows2.Month1;
                            impactTypeOfBenefit.Month2 = item.monthRows2.Month2;
                            impactTypeOfBenefit.Month3 = item.monthRows2.Month3;
                            impactTypeOfBenefit.Month4 = item.monthRows2.Month4;
                            impactTypeOfBenefit.Month5 = item.monthRows2.Month5;
                            impactTypeOfBenefit.Month6 = item.monthRows2.Month6;
                            impactTypeOfBenefit.Month7 = item.monthRows2.Month7;
                            impactTypeOfBenefit.Month8 = item.monthRows2.Month8;
                            impactTypeOfBenefit.Month9 = item.monthRows2.Month9;
                            impactTypeOfBenefit.Month10 = item.monthRows2.Month10;
                            impactTypeOfBenefit.Month11 = item.monthRows2.Month11;
                            impactTypeOfBenefit.Month12 = item.monthRows2.Month12;
                            impactTypeOfBenefit.Month13 = item.monthRows2.Month13;
                            impactTypeOfBenefit.Month14 = item.monthRows2.Month14;
                            impactTypeOfBenefit.Month15 = item.monthRows2.Month15;
                            impactTypeOfBenefit.Month16 = item.monthRows2.Month16;
                            impactTypeOfBenefit.Month17 = item.monthRows2.Month17;
                            impactTypeOfBenefit.Month18 = item.monthRows2.Month18;
                            impactTypeOfBenefit.Month19 = item.monthRows2.Month19;
                            impactTypeOfBenefit.Month20 = item.monthRows2.Month20;
                            impactTypeOfBenefit.Month21 = item.monthRows2.Month21;
                            impactTypeOfBenefit.Month22 = item.monthRows2.Month22;
                            impactTypeOfBenefit.Month23 = item.monthRows2.Month23;
                            impactTypeOfBenefit.Month24 = item.monthRows2.Month24;
                            impactTypeOfBenefit.Month25 = item.monthRows2.Month25;
                            impactTypeOfBenefit.Month26 = item.monthRows2.Month26;
                            impactTypeOfBenefit.Month27 = item.monthRows2.Month27;
                            impactTypeOfBenefit.Month28 = item.monthRows2.Month28;
                            impactTypeOfBenefit.Month29 = item.monthRows2.Month29;
                            impactTypeOfBenefit.Month30 = item.monthRows2.Month30;
                            impactTypeOfBenefit.Month31 = item.monthRows2.Month31;
                            impactTypeOfBenefit.Month32 = item.monthRows2.Month32;
                            impactTypeOfBenefit.Month33 = item.monthRows2.Month33;
                            impactTypeOfBenefit.Month34 = item.monthRows2.Month34;
                            impactTypeOfBenefit.Month35 = item.monthRows2.Month35;
                            impactTypeOfBenefit.Month36 = item.monthRows2.Month36;
                            break;
                        case 3:
                            impactTypeOfBenefit.Month1 = item.monthRows3.Month1;
                            impactTypeOfBenefit.Month2 = item.monthRows3.Month2;
                            impactTypeOfBenefit.Month3 = item.monthRows3.Month3;
                            impactTypeOfBenefit.Month4 = item.monthRows3.Month4;
                            impactTypeOfBenefit.Month5 = item.monthRows3.Month5;
                            impactTypeOfBenefit.Month6 = item.monthRows3.Month6;
                            impactTypeOfBenefit.Month7 = item.monthRows3.Month7;
                            impactTypeOfBenefit.Month8 = item.monthRows3.Month8;
                            impactTypeOfBenefit.Month9 = item.monthRows3.Month9;
                            impactTypeOfBenefit.Month10 = item.monthRows3.Month10;
                            impactTypeOfBenefit.Month11 = item.monthRows3.Month11;
                            impactTypeOfBenefit.Month12 = item.monthRows3.Month12;
                            impactTypeOfBenefit.Month13 = item.monthRows3.Month13;
                            impactTypeOfBenefit.Month14 = item.monthRows3.Month14;
                            impactTypeOfBenefit.Month15 = item.monthRows3.Month15;
                            impactTypeOfBenefit.Month16 = item.monthRows3.Month16;
                            impactTypeOfBenefit.Month17 = item.monthRows3.Month17;
                            impactTypeOfBenefit.Month18 = item.monthRows3.Month18;
                            impactTypeOfBenefit.Month19 = item.monthRows3.Month19;
                            impactTypeOfBenefit.Month20 = item.monthRows3.Month20;
                            impactTypeOfBenefit.Month21 = item.monthRows3.Month21;
                            impactTypeOfBenefit.Month22 = item.monthRows3.Month22;
                            impactTypeOfBenefit.Month23 = item.monthRows3.Month23;
                            impactTypeOfBenefit.Month24 = item.monthRows3.Month24;
                            impactTypeOfBenefit.Month25 = item.monthRows3.Month25;
                            impactTypeOfBenefit.Month26 = item.monthRows3.Month26;
                            impactTypeOfBenefit.Month27 = item.monthRows3.Month27;
                            impactTypeOfBenefit.Month28 = item.monthRows3.Month28;
                            impactTypeOfBenefit.Month29 = item.monthRows3.Month29;
                            impactTypeOfBenefit.Month30 = item.monthRows3.Month30;
                            impactTypeOfBenefit.Month31 = item.monthRows3.Month31;
                            impactTypeOfBenefit.Month32 = item.monthRows3.Month32;
                            impactTypeOfBenefit.Month33 = item.monthRows3.Month33;
                            impactTypeOfBenefit.Month34 = item.monthRows3.Month34;
                            impactTypeOfBenefit.Month35 = item.monthRows3.Month35;
                            impactTypeOfBenefit.Month36 = item.monthRows3.Month36;
                            break;
                    }
                    await _context.ImpactTypeOfBenefits.AddAsync(impactTypeOfBenefit);
                    await _context.SaveChangesAsync();
                }
            }
            return firstRunRateCreate;
        }

        public async Task<IEnumerable<ImpactTypeOfBenefit>> GetFirstRunRate(int id)
        {
            var impactTypeOfBenefits = await _context.ImpactTypeOfBenefits
            .Where(i => i.InitiativeId == id)
            .Where(i => i.ImpactTypeOfBenefitTable == "FirstRunRate")
            .ToListAsync();
            return impactTypeOfBenefits;
        }

        public async Task<IndirectCreate> CreateIndirect(int id, IndirectCreate IndirectCreate)
        {
            if (_context.ImpactTypeOfBenefits.Any())
            {
                var ImpactTypeOfBenefitsList = await _context.ImpactTypeOfBenefits
                .Where(i => i.InitiativeId == id)
                .Where(i => i.ImpactTypeOfBenefitTable == "IndirectBenefit")
                .ToListAsync();
                foreach (var entity in ImpactTypeOfBenefitsList)
                    _context.ImpactTypeOfBenefits.Remove(entity);
                await _context.SaveChangesAsync();
            }

            foreach (var item in IndirectCreate.IndirectTable)
            {
                for (int i = 1; i <= 2; i++)
                {
                    var impactTypeOfBenefit = new ImpactTypeOfBenefit
                    {
                        ImpactTypeOfBenefitTable = "IndirectBenefit",
                        TypeOfBenefit = item.TypeOfBenefit,
                        InitiativeId = id
                    };
                    switch (i)
                    {
                        case 1: impactTypeOfBenefit.VersionPrice = item.VersionPrice.Row1; break;
                        case 2: impactTypeOfBenefit.VersionPrice = item.VersionPrice.Row2; break;
                    }
                    switch (i)
                    {
                        case 1: impactTypeOfBenefit.RunRate = item.RunRate.Row1; break;
                        case 2: impactTypeOfBenefit.RunRate = item.RunRate.Row2; break;
                    }
                    await _context.ImpactTypeOfBenefits.AddAsync(impactTypeOfBenefit);
                    await _context.SaveChangesAsync();
                }
            }
            return IndirectCreate;
        }

        public async Task<IEnumerable<ImpactTypeOfBenefit>> GetIndirect(int id)
        {
            var impactTypeOfBenefits = await _context.ImpactTypeOfBenefits
            .Where(i => i.InitiativeId == id)
            .Where(i => i.ImpactTypeOfBenefitTable == "IndirectBenefit")
            .ToListAsync();
            return impactTypeOfBenefits;
        }

        public async Task<ImpiemantCostCreate> CreateImpiemantCost(int id, ImpiemantCostCreate impiemantCostCreate)
        {
            if (_context.ImpactTypeOfBenefits.Any())
            {
                var ImpactTypeOfBenefitsList = await _context.ImpactTypeOfBenefits
                .Where(i => i.InitiativeId == id)
                .Where(i => i.ImpactTypeOfBenefitTable == "ImpiemantCost")
                .ToListAsync();
                foreach (var entity in ImpactTypeOfBenefitsList)
                    _context.ImpactTypeOfBenefits.Remove(entity);
                await _context.SaveChangesAsync();
            }

            for (int i = 1; i <= 2; i++)
            {
                var impactTypeOfBenefit = new ImpactTypeOfBenefit
                {
                    ImpactTypeOfBenefitTable = "ImpiemantCost",
                    TypeOfBenefit = impiemantCostCreate.TypeOfBenefit,
                    InitiativeId = id
                };
                switch (i)
                {
                    case 1: impactTypeOfBenefit.VersionPrice = impiemantCostCreate.VersionPrice.Row1; break;
                    case 2: impactTypeOfBenefit.VersionPrice = impiemantCostCreate.VersionPrice.Row2; break;
                }
                switch (i)
                {
                    case 1: impactTypeOfBenefit.RunRate = impiemantCostCreate.RunRate.Row1; break;
                    case 2: impactTypeOfBenefit.RunRate = impiemantCostCreate.RunRate.Row2; break;
                }
                switch (i)
                {
                    case 1:
                        impactTypeOfBenefit.Month1  = impiemantCostCreate.monthRows1.Month1;
                        impactTypeOfBenefit.Month2  = impiemantCostCreate.monthRows1.Month2;
                        impactTypeOfBenefit.Month3  = impiemantCostCreate.monthRows1.Month3;
                        impactTypeOfBenefit.Month4  = impiemantCostCreate.monthRows1.Month4;
                        impactTypeOfBenefit.Month5  = impiemantCostCreate.monthRows1.Month5;
                        impactTypeOfBenefit.Month6  = impiemantCostCreate.monthRows1.Month6;
                        impactTypeOfBenefit.Month7  = impiemantCostCreate.monthRows1.Month7;
                        impactTypeOfBenefit.Month8  = impiemantCostCreate.monthRows1.Month8;
                        impactTypeOfBenefit.Month9  = impiemantCostCreate.monthRows1.Month9;
                        impactTypeOfBenefit.Month10 = impiemantCostCreate.monthRows1.Month10;
                        impactTypeOfBenefit.Month11 = impiemantCostCreate.monthRows1.Month11;
                        impactTypeOfBenefit.Month12 = impiemantCostCreate.monthRows1.Month12;
                        impactTypeOfBenefit.Month13 = impiemantCostCreate.monthRows1.Month13;
                        impactTypeOfBenefit.Month14 = impiemantCostCreate.monthRows1.Month14;
                        impactTypeOfBenefit.Month15 = impiemantCostCreate.monthRows1.Month15;
                        impactTypeOfBenefit.Month16 = impiemantCostCreate.monthRows1.Month16;
                        impactTypeOfBenefit.Month17 = impiemantCostCreate.monthRows1.Month17;
                        impactTypeOfBenefit.Month18 = impiemantCostCreate.monthRows1.Month18;
                        impactTypeOfBenefit.Month19 = impiemantCostCreate.monthRows1.Month19;
                        impactTypeOfBenefit.Month20 = impiemantCostCreate.monthRows1.Month20;
                        impactTypeOfBenefit.Month21 = impiemantCostCreate.monthRows1.Month21;
                        impactTypeOfBenefit.Month22 = impiemantCostCreate.monthRows1.Month22;
                        impactTypeOfBenefit.Month23 = impiemantCostCreate.monthRows1.Month23;
                        impactTypeOfBenefit.Month24 = impiemantCostCreate.monthRows1.Month24;
                        impactTypeOfBenefit.Month25 = impiemantCostCreate.monthRows1.Month25;
                        impactTypeOfBenefit.Month26 = impiemantCostCreate.monthRows1.Month26;
                        impactTypeOfBenefit.Month27 = impiemantCostCreate.monthRows1.Month27;
                        impactTypeOfBenefit.Month28 = impiemantCostCreate.monthRows1.Month28;
                        impactTypeOfBenefit.Month29 = impiemantCostCreate.monthRows1.Month29;
                        impactTypeOfBenefit.Month30 = impiemantCostCreate.monthRows1.Month30;
                        impactTypeOfBenefit.Month31 = impiemantCostCreate.monthRows1.Month31;
                        impactTypeOfBenefit.Month32 = impiemantCostCreate.monthRows1.Month32;
                        impactTypeOfBenefit.Month33 = impiemantCostCreate.monthRows1.Month33;
                        impactTypeOfBenefit.Month34 = impiemantCostCreate.monthRows1.Month34;
                        impactTypeOfBenefit.Month35 = impiemantCostCreate.monthRows1.Month35;
                        impactTypeOfBenefit.Month36 = impiemantCostCreate.monthRows1.Month36;
                        break;
                    case 2:
                        impactTypeOfBenefit.Month1  = impiemantCostCreate.monthRows2.Month1;
                        impactTypeOfBenefit.Month2  = impiemantCostCreate.monthRows2.Month2;
                        impactTypeOfBenefit.Month3  = impiemantCostCreate.monthRows2.Month3;
                        impactTypeOfBenefit.Month4  = impiemantCostCreate.monthRows2.Month4;
                        impactTypeOfBenefit.Month5  = impiemantCostCreate.monthRows2.Month5;
                        impactTypeOfBenefit.Month6  = impiemantCostCreate.monthRows2.Month6;
                        impactTypeOfBenefit.Month7  = impiemantCostCreate.monthRows2.Month7;
                        impactTypeOfBenefit.Month8  = impiemantCostCreate.monthRows2.Month8;
                        impactTypeOfBenefit.Month9  = impiemantCostCreate.monthRows2.Month9;
                        impactTypeOfBenefit.Month10 = impiemantCostCreate.monthRows2.Month10;
                        impactTypeOfBenefit.Month11 = impiemantCostCreate.monthRows2.Month11;
                        impactTypeOfBenefit.Month12 = impiemantCostCreate.monthRows2.Month12;
                        impactTypeOfBenefit.Month13 = impiemantCostCreate.monthRows2.Month13;
                        impactTypeOfBenefit.Month14 = impiemantCostCreate.monthRows2.Month14;
                        impactTypeOfBenefit.Month15 = impiemantCostCreate.monthRows2.Month15;
                        impactTypeOfBenefit.Month16 = impiemantCostCreate.monthRows2.Month16;
                        impactTypeOfBenefit.Month17 = impiemantCostCreate.monthRows2.Month17;
                        impactTypeOfBenefit.Month18 = impiemantCostCreate.monthRows2.Month18;
                        impactTypeOfBenefit.Month19 = impiemantCostCreate.monthRows2.Month19;
                        impactTypeOfBenefit.Month20 = impiemantCostCreate.monthRows2.Month20;
                        impactTypeOfBenefit.Month21 = impiemantCostCreate.monthRows2.Month21;
                        impactTypeOfBenefit.Month22 = impiemantCostCreate.monthRows2.Month22;
                        impactTypeOfBenefit.Month23 = impiemantCostCreate.monthRows2.Month23;
                        impactTypeOfBenefit.Month24 = impiemantCostCreate.monthRows2.Month24;
                        impactTypeOfBenefit.Month25 = impiemantCostCreate.monthRows2.Month25;
                        impactTypeOfBenefit.Month26 = impiemantCostCreate.monthRows2.Month26;
                        impactTypeOfBenefit.Month27 = impiemantCostCreate.monthRows2.Month27;
                        impactTypeOfBenefit.Month28 = impiemantCostCreate.monthRows2.Month28;
                        impactTypeOfBenefit.Month29 = impiemantCostCreate.monthRows2.Month29;
                        impactTypeOfBenefit.Month30 = impiemantCostCreate.monthRows2.Month30;
                        impactTypeOfBenefit.Month31 = impiemantCostCreate.monthRows2.Month31;
                        impactTypeOfBenefit.Month32 = impiemantCostCreate.monthRows2.Month32;
                        impactTypeOfBenefit.Month33 = impiemantCostCreate.monthRows2.Month33;
                        impactTypeOfBenefit.Month34 = impiemantCostCreate.monthRows2.Month34;
                        impactTypeOfBenefit.Month35 = impiemantCostCreate.monthRows2.Month35;
                        impactTypeOfBenefit.Month36 = impiemantCostCreate.monthRows2.Month36;
                        break;
                }
                await _context.ImpactTypeOfBenefits.AddAsync(impactTypeOfBenefit);
                await _context.SaveChangesAsync();
            }

            return impiemantCostCreate;
        }

        public async Task<bool> DeleteImpiemantCost(int id)
        {
            if (_context.ImpactTypeOfBenefits.Any())
            {
                var ImpactTrackingList = await _context.ImpactTypeOfBenefits.Where(i => i.InitiativeId == id && i.ImpactTypeOfBenefitTable == "ImpiemantCost").ToListAsync();
                foreach (var entity in ImpactTrackingList)
                    _context.ImpactTypeOfBenefits.Remove(entity);
                await _context.SaveChangesAsync();
                return true;
            }
            return true;
        }

        public async Task<IEnumerable<ImpactTypeOfBenefit>> GetImpiemantCost(int id)
        {
            var impactTypeOfBenefits = await _context.ImpactTypeOfBenefits
            .Where(i => i.InitiativeId == id)
            .Where(i => i.ImpactTypeOfBenefitTable == "ImpiemantCost")
            .ToListAsync();
            return impactTypeOfBenefits;
        }

        public async Task<TypeBenefitCreate> CreateTypeOfBenefit(int id, TypeBenefitCreate typeBenefitCreate)
        {
            if (_context.ImpactTypeOfBenefits.Any())
            {
                var ImpactTypeOfBenefitsList = await _context.ImpactTypeOfBenefits
                .Where(i => i.InitiativeId == id)
                .Where(i => i.ImpactTypeOfBenefitTable == "TypeBenefit")
                .ToListAsync();
                foreach (var entity in ImpactTypeOfBenefitsList)
                    _context.ImpactTypeOfBenefits.Remove(entity);
                await _context.SaveChangesAsync();
            }

            foreach (var item in typeBenefitCreate.TypeBenefitTable)
            {
                for (int i = 1; i <= 2; i++)
                {
                    var impactTypeOfBenefit = new ImpactTypeOfBenefit
                    {
                        ImpactTypeOfBenefitTable = "TypeBenefit",
                        TypeOfBenefit = item.TypeOfBenefit,
                        InitiativeId = id
                    };
                    switch (i)
                    {
                        case 1:
                            impactTypeOfBenefit.VersionPrice = "FixedFX";
                            impactTypeOfBenefit.FixedFX      = item.VersionPrice.Row1;
                        break;
                        case 2:
                            impactTypeOfBenefit.VersionPrice = "FloatFX";
                            impactTypeOfBenefit.FixedFX = item.VersionPrice.Row2;
                        break;
                    }
                    switch (i)
                    {
                        case 1: impactTypeOfBenefit.RunRate = item.RunRate.Row1; break;
                        case 2: impactTypeOfBenefit.RunRate = item.RunRate.Row2; break;
                    }
                    switch (i)
                    {
                        case 1:
                            impactTypeOfBenefit.Month1  = item.monthRows1.Month1;
                            impactTypeOfBenefit.Month2  = item.monthRows1.Month2;
                            impactTypeOfBenefit.Month3  = item.monthRows1.Month3;
                            impactTypeOfBenefit.Month4  = item.monthRows1.Month4;
                            impactTypeOfBenefit.Month5  = item.monthRows1.Month5;
                            impactTypeOfBenefit.Month6  = item.monthRows1.Month6;
                            impactTypeOfBenefit.Month7  = item.monthRows1.Month7;
                            impactTypeOfBenefit.Month8  = item.monthRows1.Month8;
                            impactTypeOfBenefit.Month9  = item.monthRows1.Month9;
                            impactTypeOfBenefit.Month10 = item.monthRows1.Month10;
                            impactTypeOfBenefit.Month11 = item.monthRows1.Month11;
                            impactTypeOfBenefit.Month12 = item.monthRows1.Month12;
                            impactTypeOfBenefit.Month13 = item.monthRows1.Month13;
                            impactTypeOfBenefit.Month14 = item.monthRows1.Month14;
                            impactTypeOfBenefit.Month15 = item.monthRows1.Month15;
                            impactTypeOfBenefit.Month16 = item.monthRows1.Month16;
                            impactTypeOfBenefit.Month17 = item.monthRows1.Month17;
                            impactTypeOfBenefit.Month18 = item.monthRows1.Month18;
                            impactTypeOfBenefit.Month19 = item.monthRows1.Month19;
                            impactTypeOfBenefit.Month20 = item.monthRows1.Month20;
                            impactTypeOfBenefit.Month21 = item.monthRows1.Month21;
                            impactTypeOfBenefit.Month22 = item.monthRows1.Month22;
                            impactTypeOfBenefit.Month23 = item.monthRows1.Month23;
                            impactTypeOfBenefit.Month24 = item.monthRows1.Month24;
                            impactTypeOfBenefit.Month25 = item.monthRows1.Month25;
                            impactTypeOfBenefit.Month26 = item.monthRows1.Month26;
                            impactTypeOfBenefit.Month27 = item.monthRows1.Month27;
                            impactTypeOfBenefit.Month28 = item.monthRows1.Month28;
                            impactTypeOfBenefit.Month29 = item.monthRows1.Month29;
                            impactTypeOfBenefit.Month30 = item.monthRows1.Month30;
                            impactTypeOfBenefit.Month31 = item.monthRows1.Month31;
                            impactTypeOfBenefit.Month32 = item.monthRows1.Month32;
                            impactTypeOfBenefit.Month33 = item.monthRows1.Month33;
                            impactTypeOfBenefit.Month34 = item.monthRows1.Month34;
                            impactTypeOfBenefit.Month35 = item.monthRows1.Month35;
                            impactTypeOfBenefit.Month36 = item.monthRows1.Month36;
                            break;
                        case 2:
                            impactTypeOfBenefit.Month1  = item.monthRows2.Month1;
                            impactTypeOfBenefit.Month2  = item.monthRows2.Month2;
                            impactTypeOfBenefit.Month3  = item.monthRows2.Month3;
                            impactTypeOfBenefit.Month4  = item.monthRows2.Month4;
                            impactTypeOfBenefit.Month5  = item.monthRows2.Month5;
                            impactTypeOfBenefit.Month6  = item.monthRows2.Month6;
                            impactTypeOfBenefit.Month7  = item.monthRows2.Month7;
                            impactTypeOfBenefit.Month8  = item.monthRows2.Month8;
                            impactTypeOfBenefit.Month9  = item.monthRows2.Month9;
                            impactTypeOfBenefit.Month10 = item.monthRows2.Month10;
                            impactTypeOfBenefit.Month11 = item.monthRows2.Month11;
                            impactTypeOfBenefit.Month12 = item.monthRows2.Month12;
                            impactTypeOfBenefit.Month13 = item.monthRows2.Month13;
                            impactTypeOfBenefit.Month14 = item.monthRows2.Month14;
                            impactTypeOfBenefit.Month15 = item.monthRows2.Month15;
                            impactTypeOfBenefit.Month16 = item.monthRows2.Month16;
                            impactTypeOfBenefit.Month17 = item.monthRows2.Month17;
                            impactTypeOfBenefit.Month18 = item.monthRows2.Month18;
                            impactTypeOfBenefit.Month19 = item.monthRows2.Month19;
                            impactTypeOfBenefit.Month20 = item.monthRows2.Month20;
                            impactTypeOfBenefit.Month21 = item.monthRows2.Month21;
                            impactTypeOfBenefit.Month22 = item.monthRows2.Month22;
                            impactTypeOfBenefit.Month23 = item.monthRows2.Month23;
                            impactTypeOfBenefit.Month24 = item.monthRows2.Month24;
                            impactTypeOfBenefit.Month25 = item.monthRows2.Month25;
                            impactTypeOfBenefit.Month26 = item.monthRows2.Month26;
                            impactTypeOfBenefit.Month27 = item.monthRows2.Month27;
                            impactTypeOfBenefit.Month28 = item.monthRows2.Month28;
                            impactTypeOfBenefit.Month29 = item.monthRows2.Month29;
                            impactTypeOfBenefit.Month30 = item.monthRows2.Month30;
                            impactTypeOfBenefit.Month31 = item.monthRows2.Month31;
                            impactTypeOfBenefit.Month32 = item.monthRows2.Month32;
                            impactTypeOfBenefit.Month33 = item.monthRows2.Month33;
                            impactTypeOfBenefit.Month34 = item.monthRows2.Month34;
                            impactTypeOfBenefit.Month35 = item.monthRows2.Month35;
                            impactTypeOfBenefit.Month36 = item.monthRows2.Month36;
                            break;
                    }
                    await _context.ImpactTypeOfBenefits.AddAsync(impactTypeOfBenefit);
                    await _context.SaveChangesAsync();
                }
            }
            return typeBenefitCreate;
        }

        public async Task<IEnumerable<ImpactTypeOfBenefit>> GetTypeOfBenefit(int id)
        {
            var impactTypeOfBenefits = await _context.ImpactTypeOfBenefits
            .Where(i => i.InitiativeId == id)
            .Where(i => i.ImpactTypeOfBenefitTable == "TypeBenefit")
            .ToListAsync();
            return impactTypeOfBenefits;
        }

        public async Task<CreateWorkstream> CreateWorkstream(int id, CreateWorkstream CreateWorkstream)
        {
            if (_context.ShareBenefitWorkstreams.Any())
            {
                var List = await _context.ShareBenefitWorkstreams.Where(i => i.InitiativeId == id).ToListAsync();
                foreach (var entity in List)
                    _context.ShareBenefitWorkstreams.Remove(entity);
                await _context.SaveChangesAsync();
            }

            foreach (var item in CreateWorkstream.ShareBenefitWorkstreams)
            {
                await _context.ShareBenefitWorkstreams.AddAsync(item);
                await _context.SaveChangesAsync();
            }
            return CreateWorkstream;
        }

        public async Task<bool> DeleteShareBenefitWorkstream(int id)
        {
            if (_context.ShareBenefitWorkstreams.Any())
            {
                var List = await _context.ShareBenefitWorkstreams.Where(i => i.InitiativeId == id).ToListAsync();
                foreach (var entity in List)
                    _context.ShareBenefitWorkstreams.Remove(entity);
                await _context.SaveChangesAsync();
                return true;
            }
            return true;
        }
    }
}