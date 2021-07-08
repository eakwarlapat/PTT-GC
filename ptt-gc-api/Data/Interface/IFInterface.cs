using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PTT_GC_API.Data.Interface
{
    public interface IFInterface
    {
        Task<bool> CAPEX_IF_001_SAPIM_CP(int initiativeId, DateTime nowDateTIme);
        Task<bool> CAPEX_IF_001_SAPIM_General(int initiativeId, DateTime nowDateTIme);
        Task<bool> CAPEX_IF_001_SAPIM_Yearly(int initiativeId, DateTime nowDateTIme);
        Task<bool> CAPEX_IF_001_SAPIM_Monthly(int initiativeId, DateTime nowDateTIme);
        Task<bool> InsertInitiativeIdToTempTable(int InitiativeId, string IFtype);

    }
}
