using System.Collections.Generic;
using System.Threading.Tasks;
using PTT_GC_API.Models.Initiative;

namespace PTT_GC_API.Data.Interface
{
    public interface InitiativeActionInterface
    {
        Task<IEnumerable<InitiativeAction>> GetInitiativeAction(int id);
    }
}