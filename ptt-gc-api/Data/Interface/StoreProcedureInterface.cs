using System.Data;
using System.Threading.Tasks;

namespace PTT_GC_API.Data.Interface
{
    public interface StoreProcedureInterface
    {
        Task<DataTable> ExecuteReturnDatatable(string sqlcommandstring);
        Task<string> Execute(string value);
    }
}