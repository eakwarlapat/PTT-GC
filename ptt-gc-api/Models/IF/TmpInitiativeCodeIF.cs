using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PTT_GC_API.Models.IF
{
    public class TmpInitiativeCodeIF
    {
        public int Id { get; set; }
        public string IFType { get; set; }
        public int InitiativeId { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string Remark { get; set; }

    }
}
