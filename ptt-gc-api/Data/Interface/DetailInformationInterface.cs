using System.Threading.Tasks;
using PTT_GC_API.Dtos.DetailMaxInformation;
using PTT_GC_API.Models.Initiative;

namespace PTT_GC_API.Data.Interface
{
    public interface DetailInformationInterface
    {
        void Add<T>(T entity) where T: class;
        void Update<T>(T entity) where T : class;
        void Delete<T>(T entity) where T: class;
        Task<bool> Save();
        Task<bool> Any();
        Task<bool> DetailInformationDelete(int id);
        Task<DetailInformation> GetDetailInformation(int id);
        Task<CreateKpiDetailInformation> CreateKpiDetailInformation(int id, CreateKpiDetailInformation CreateKpiDetailInformation);
    }
}