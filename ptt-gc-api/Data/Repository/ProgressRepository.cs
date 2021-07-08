using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PTT_GC_API.Data.Interface;
using PTT_GC_API.Dtos.ProgressAndMilestone;

namespace PTT_GC_API.Data.Repository
{
    public class ProgressRepository : ProgressInterface
    {
        private readonly DataContext _context;
        public ProgressRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<CreateProgressDetail> CreateProgressDetail(int id, CreateProgressDetail CreateProgressDetail)
        {
            if (_context.ProgressDetails.Any())
            {
                var List = await _context.ProgressDetails.Where(i => i.InitiativeId == id).ToListAsync();
                foreach (var entity in List)
                    _context.ProgressDetails.Remove(entity);
                await _context.SaveChangesAsync();
            }

            foreach (var item in CreateProgressDetail.details)
            {
                await _context.ProgressDetails.AddAsync(item);
                await _context.SaveChangesAsync();
            }
            return CreateProgressDetail;
        }
    }
}