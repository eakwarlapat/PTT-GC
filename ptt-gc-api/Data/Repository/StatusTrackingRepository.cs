using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PTT_GC_API.Data.Interface;
using PTT_GC_API.Dtos.StatusTracking;
using PTT_GC_API.Models.Initiative;

namespace PTT_GC_API.Data.Repository
{
    public class StatusTrackingRepository : StatusTrackingInterface
    {
        private readonly DataContext _context;
        public StatusTrackingRepository(DataContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<InitiativeStatusTracking>> GetList(int id)
        {
            return await _context.InitiativeStatusTrackings.Where(s => s.InitiativeId == id).OrderBy(s => s.Sequence).ToListAsync();
        }

        public async Task<InitiativeStatusHistory> GetApproveComment(int id, ApproveComment ApproveComment)
        {
            return await _context.InitiativeStatusHistory.Where(s => s.InitiativeId == id).OrderByDescending(s => s.ActionDate).FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<InitiativeStatusHistory>> GetHistoryStatus(int id, HistoryStatus HistoryStatus)
        {
            return await _context.InitiativeStatusHistory.Where(s => s.InitiativeId == id && s.Stage == HistoryStatus.Stage).OrderBy(s => s.Id).ToListAsync();
        }

        public async Task<IEnumerable<InitiativeStatusHistory>> GetHistoryStatusList(int id)
        {
            string[] stage = { "SIL1", "SIL2", "SIL3", "SIL4", "SIL5", "DM", "VP", "EVP/MD/SEVP/COE/PSD/CEO", "Budget Team", "BOD", "App. Request", "WBS Request", "Budget Distribute" };
            return await _context.InitiativeStatusHistory.Where(s => s.InitiativeId == id && stage.Contains(s.Stage)).OrderBy(s => s.Id).ToListAsync();
        }
    }
}