using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PTT_GC_API.Data.Interface;
using PTT_GC_API.Models.Initiative;

namespace PTT_GC_API.Data.Repository
{
    public class InitiativeActionRepository : InitiativeActionInterface
    {
        private readonly DataContext _context;
        public InitiativeActionRepository(DataContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<InitiativeAction>> GetInitiativeAction(int id)
        {
            return await _context.InitiativeActions.Where(i => i.InitiativeId == id).ToListAsync();
        }
    }
}