using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PTT_GC_API.Data.Interface;
using PTT_GC_API.Dtos.DetailMaxInformation;
using PTT_GC_API.Models.Initiative;

namespace PTT_GC_API.Data.Repository
{
    public class DetailInformationRepository : DetailInformationInterface
    {
        private readonly DataContext _context;
        public DetailInformationRepository(DataContext context)
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

        public async Task<bool> DetailInformationDelete(int id)
        {
            if (_context.DetailInformations.Any())
            {
                var List = await _context.DetailInformations.Where(i => i.InitiativeId == id).ToListAsync();
                foreach (var entity in List)
                    _context.DetailInformations.Remove(entity);
                await _context.SaveChangesAsync();
                return true;
            }
            return true;
        }

        public async Task<DetailInformation> GetDetailInformation(int id)
        {
            return await _context.DetailInformations.FirstOrDefaultAsync(i => i.InitiativeId == id);
        }

        public async Task<CreateKpiDetailInformation> CreateKpiDetailInformation(int id, CreateKpiDetailInformation CreateKpiDetailInformation)
        {
            if (_context.KpiDetailInformations.Any())
            {
                var List = await _context.KpiDetailInformations.Where(i => i.InitiativeId == id).ToListAsync();
                foreach (var entity in List)
                    _context.KpiDetailInformations.Remove(entity);
                await _context.SaveChangesAsync();
            }

            foreach (var item in CreateKpiDetailInformation.kpis)
            {
                await _context.KpiDetailInformations.AddAsync(item);
                await _context.SaveChangesAsync();
            }
            return CreateKpiDetailInformation;
        }
    }
}