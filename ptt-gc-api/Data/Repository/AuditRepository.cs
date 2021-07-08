using System.Linq;
using System.Threading.Tasks;
using PTT_GC_API.API.Helpers;
using PTT_GC_API.Data.Interface;
using PTT_GC_API.Helpers;
using PTT_GC_API.Models.Initiative;

namespace PTT_GC_API.Data.Repository
{
    public class AuditRepository : AuditInterface
    {
        private readonly DataContext _context;
        public AuditRepository(DataContext context)
        {
            _context = context;
        }
        public async Task<PagedList<V_Audit>> GetAudits(AuditParams AuditParams)
        {
            var audits = _context.V_Audits.AsQueryable();

            audits = audits.Where(i => i.InitiativeCode == AuditParams.Code);

            if (!string.IsNullOrEmpty(AuditParams.Keyword))
            {
                audits = audits.Where(i =>
                    i.ChangeSetId.ToString().Contains(AuditParams.Keyword) ||
                    i.FieldName.Contains(AuditParams.Keyword.Trim()) ||
                    i.OldValue.Contains(AuditParams.Keyword.Trim())  ||
                    i.NewValue.Contains(AuditParams.Keyword.Trim())  ||
                    i.ActionBy.Contains(AuditParams.Keyword.Trim())
                );
            }
            if (AuditParams.StartDate.HasValue && AuditParams.EndDate.HasValue)
            {
                audits = audits.Where(i => i.ActionDate.Value.Date >= AuditParams.StartDate && i.ActionDate.Value.Date <= AuditParams.EndDate);
            }

            audits = audits.OrderByDescending(i => i.ActionDate);

            return await PagedList<V_Audit>.CreateAsync(audits, AuditParams.PageNumber, AuditParams.PageSize);
        }
    }
}