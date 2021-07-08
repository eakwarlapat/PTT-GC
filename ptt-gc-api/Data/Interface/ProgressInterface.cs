using System.Threading.Tasks;
using PTT_GC_API.Dtos.ProgressAndMilestone;

namespace PTT_GC_API.Data.Interface
{
    public interface ProgressInterface
    {
        Task<CreateProgressDetail> CreateProgressDetail(int id, CreateProgressDetail CreateProgressDetail);
    }
}