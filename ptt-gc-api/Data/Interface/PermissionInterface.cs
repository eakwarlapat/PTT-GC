using System.Threading.Tasks;
using PTT_GC_API.Dtos.Permission;

namespace PTT_GC_API.Data.Interface
{
    public interface PermissionInterface
    {
        Task<bool> CheckOverviewPermission(Overview overview);
        Task<bool> CheckDashboardPermission(Dashboard dashboard);
        Task<object> GetListPermission(string email, string page,int initiativeId);
    }
}