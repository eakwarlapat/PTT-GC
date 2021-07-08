using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PTT_GC_API.Data.Interface;
using PTT_GC_API.Dtos.ITBudget;
using PTT_GC_API.Models.ITBudget;

namespace PTT_GC_API.Data.Repository
{
    public class ITBudgetRepository : ITBudgetInterface
    {
        private readonly DataContext _context;
        public ITBudgetRepository(DataContext context)
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

        public async Task<IEnumerable<ITBudgetSurvey>> GetITBudget(int id)
        {
            return await _context.ITBudgetSurveys.Where(i => i.InitiativeId == id).ToListAsync();
        }

        public async Task<IEnumerable<ITAsset>> GetHardwareList()
        {
            return await _context.ITAssets.Where(i => i.AssetType == "Hardware").ToListAsync();
        }

        public async Task<IEnumerable<ITAsset>> GetSoftwareList()
        {
            return await _context.ITAssets.Where(i => i.AssetType == "Software").ToListAsync();
        }

        public async Task<IEnumerable<ITBudgetSurveyAsset>> GetHardware(int id)
        {
            return await _context.ITBudgetSurveyAssets.Where(i => i.ITBudgetSurveyId == id).ToListAsync();
        }

        public async Task<IEnumerable<ITBudgetSurveyAsset>> GetSoftware(int id)
        {
            return await _context.ITBudgetSurveyAssets.Where(i => i.ITBudgetSurveyId == id).ToListAsync();
        }

        public async Task<CreateHardware> CreateHardware(int id, CreateHardware CreateHardware)
        {
            if (_context.ITBudgetSurveyAssets.Any())
            {
                var List = await _context.ITBudgetSurveyAssets.Where(i => i.ITBudgetSurveyId == id).ToListAsync();
                foreach (var entity in List)
                    _context.ITBudgetSurveyAssets.Remove(entity);
                await _context.SaveChangesAsync();
            }
            foreach (var item in CreateHardware.capexHardware)
            {
                item.ITBudgetSurveyId = id;
                await _context.ITBudgetSurveyAssets.AddAsync(item);
                await _context.SaveChangesAsync();
            }
            return CreateHardware;
        }

        public async Task<CreateSoftware> CreateSoftware(int id, CreateSoftware CreateSoftware)
        {
            if (_context.ITBudgetSurveyAssets.Any())
            {
                var List = await _context.ITBudgetSurveyAssets.Where(i => i.ITBudgetSurveyId == id).ToListAsync();
                foreach (var entity in List)
                    _context.ITBudgetSurveyAssets.Remove(entity);
                await _context.SaveChangesAsync();
            }
            foreach (var item in CreateSoftware.opexSoftware)
            {
                item.ITBudgetSurveyId = id;
                await _context.ITBudgetSurveyAssets.AddAsync(item);
                await _context.SaveChangesAsync();
            }
            return CreateSoftware;
        }

        public async Task<IEnumerable<CapexTopic>> GetCapexTopic()
        {
            return await _context.CapexTopics.ToListAsync();
        }

        public async Task<CreateCapexBudgetSurvey> CreateCapexBudgetSurvey(int id, CreateCapexBudgetSurvey CreateCapexBudgetSurvey)
        {
            if (_context.CapexBudgetSurveys.Any())
            {
                var List = await _context.CapexBudgetSurveys.Where(i => i.InitiativeId == id).ToListAsync();
                foreach (var entity in List)
                    _context.CapexBudgetSurveys.Remove(entity);
                await _context.SaveChangesAsync();
            }
            foreach (var item in CreateCapexBudgetSurvey.budgetSurvey)
            {
                await _context.CapexBudgetSurveys.AddAsync(item);
                await _context.SaveChangesAsync();
            }
            return CreateCapexBudgetSurvey;
        }

        public async Task<IEnumerable<CapexBudgetSurvey>> GetCapexBudgetSurvey(int id)
        {
            return await _context.CapexBudgetSurveys.Where(i => i.InitiativeId == id).ToListAsync();
        }
    }
}