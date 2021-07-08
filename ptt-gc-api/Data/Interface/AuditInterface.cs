using System.Threading.Tasks;
using PTT_GC_API.API.Helpers;
using PTT_GC_API.Helpers;
using PTT_GC_API.Models.Initiative;

namespace PTT_GC_API.Data.Interface
{
    public interface AuditInterface
    {
        Task<PagedList<V_Audit>> GetAudits(AuditParams AuditParams);
    }
}