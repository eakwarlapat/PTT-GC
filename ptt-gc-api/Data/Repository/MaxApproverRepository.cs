using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PTT_GC_API.Data.Interface;
using PTT_GC_API.Dtos.MaxApprover;
using PTT_GC_API.Models.Initiative;

namespace PTT_GC_API.Data.Repository
{
    public class MaxApproverRepository : MaxApproverInterface
    {
        private readonly DataContext _context;
        public MaxApproverRepository(DataContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<MaxApproverSetting>> GetWorkstreamList(Workstream Workstream)
        {
            return await _context.MaxApproverSettings.Where(s => s.WorkstreamType == "Workstream" && s.WorkstreamValue == Workstream.Name).OrderBy(s => s.Order).ToListAsync();
        }

        public async Task<IEnumerable<MaxApproverSetting>> GetSubWorkstream(Workstream Workstream)
        {
            return await _context.MaxApproverSettings.Where(s =>
                s.WorkstreamType == "SubWorkstream" &&
                s.WorkstreamValue == Workstream.Name &&
                s.Indicator == Workstream.Indicator).OrderBy(s => s.Order).ToListAsync();
        }

        public async Task<MaxApprover> GetWorkstreamLead(int id)
        {
            var MaxApprover = await _context.MaxApprovers.Where(i => i.ApproverType == "WorkstreamLead").FirstOrDefaultAsync(i => i.InitiativeId == id);
            return MaxApprover;
        }

        public async Task<MaxApprover> CreateWorkstreamLead(int id, WorkstreamLead Workstream)
        {
            if (_context.MaxApprovers.Where(i => i.ApproverType == "WorkstreamLead" && i.InitiativeId == id).Any())
            {
                var data = await _context.MaxApprovers.Where(i => i.ApproverType == "WorkstreamLead" && i.InitiativeId == id).ToListAsync();
                foreach (var entity in data)
                    _context.MaxApprovers.Remove(entity);
                await _context.SaveChangesAsync();
            }
            var MaxApprover = new MaxApprover { InitiativeId = id, ApproverType = "WorkstreamLead", ApproverEmail = Workstream.Email };
            await _context.MaxApprovers.AddAsync(MaxApprover);
            await _context.SaveChangesAsync();
            return MaxApprover;
        }

        public async Task<string[]> CreateSponsor(int id, string[] form)
        {
            if (_context.MaxApprovers.Where(i => i.ApproverType == "Sponsor" && i.InitiativeId == id).Any())
            {
                var data = await _context.MaxApprovers.Where(i => i.ApproverType == "Sponsor" && i.InitiativeId == id).ToListAsync();
                foreach (var entity in data)
                    _context.MaxApprovers.Remove(entity);
                await _context.SaveChangesAsync();
            }
            foreach (string item in form)
            {
                var MaxApprover = new MaxApprover { InitiativeId = id, ApproverType = "Sponsor", ApproverEmail = item };
                await _context.MaxApprovers.AddAsync(MaxApprover);
                await _context.SaveChangesAsync();
            }

            return form;
        }

        public async Task<string[]> CreateFinance(int id, string[] form)
        {
            if (_context.MaxApprovers.Where(i => i.ApproverType == "TO Finance" && i.InitiativeId == id).Any())
            {
                var data = await _context.MaxApprovers.Where(i => i.ApproverType == "TO Finance" && i.InitiativeId == id).ToListAsync();
                foreach (var entity in data)
                    _context.MaxApprovers.Remove(entity);
                await _context.SaveChangesAsync();
            }
            foreach (string item in form)
            {
                var MaxApprover = new MaxApprover { InitiativeId = id, ApproverType = "TO Finance", ApproverEmail = item };
                await _context.MaxApprovers.AddAsync(MaxApprover);
                await _context.SaveChangesAsync();
            }
            return form;
        }

        public async Task<string[]> CreateCFO(int id, string[] form)
        {
            if (_context.MaxApprovers.Where(i => i.ApproverType == "CFO" && i.InitiativeId == id).Any())
            {
                var data = await _context.MaxApprovers.Where(i => i.ApproverType == "CFO" && i.InitiativeId == id).ToListAsync();
                foreach (var entity in data)
                    _context.MaxApprovers.Remove(entity);
                await _context.SaveChangesAsync();
            }
            foreach (string item in form)
            {
                var MaxApprover = new MaxApprover { InitiativeId = id, ApproverType = "CFO", ApproverEmail = item };
                await _context.MaxApprovers.AddAsync(MaxApprover);
                await _context.SaveChangesAsync();
            }
            return form;
        }

        public async Task<string[]> CreateCTO(int id, string[] form)
        {
            if (_context.MaxApprovers.Where(i => i.ApproverType == "CTO" && i.InitiativeId == id).Any())
            {
                var data = await _context.MaxApprovers.Where(i => i.ApproverType == "CTO" && i.InitiativeId == id).ToListAsync();
                foreach (var entity in data)
                    _context.MaxApprovers.Remove(entity);
                await _context.SaveChangesAsync();
            }
            foreach (string item in form)
            {
                var MaxApprover = new MaxApprover { InitiativeId = id, ApproverType = "CTO", ApproverEmail = item };
                await _context.MaxApprovers.AddAsync(MaxApprover);
                await _context.SaveChangesAsync();
            }
            return form;
        }

        public async Task<string[]> CreateTOTeam(int id, string[] form)
        {
            if (_context.MaxApprovers.Where(i => i.ApproverType == "TOTeam" && i.InitiativeId == id).Any())
            {
                var data = await _context.MaxApprovers.Where(i => i.ApproverType == "TOTeam" && i.InitiativeId == id).ToListAsync();
                foreach (var entity in data)
                    _context.MaxApprovers.Remove(entity);
                await _context.SaveChangesAsync();
            }
            foreach (string item in form)
            {
                var MaxApprover = new MaxApprover { InitiativeId = id, ApproverType = "TOTeam", ApproverEmail = item };
                await _context.MaxApprovers.AddAsync(MaxApprover);
                await _context.SaveChangesAsync();
            }
            return form;
        }

        public async Task<string[]> CreateTfBtTO(int id, string[] form)
        {
            if (_context.MaxApprovers.Where(i => i.ApproverType == "TF-BT-TO" && i.InitiativeId == id).Any())
            {
                var data = await _context.MaxApprovers.Where(i => i.ApproverType == "TF-BT-TO" && i.InitiativeId == id).ToListAsync();
                foreach (var entity in data)
                    _context.MaxApprovers.Remove(entity);
                await _context.SaveChangesAsync();
            }
            foreach (string item in form)
            {
                var MaxApprover = new MaxApprover { InitiativeId = id, ApproverType = "TF-BT-TO", ApproverEmail = item };
                await _context.MaxApprovers.AddAsync(MaxApprover);
                await _context.SaveChangesAsync();
            }
            return form;
        }

    }
}