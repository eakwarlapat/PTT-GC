using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace PTT_GC_API.Models
{
    public class Risk
    {
        [Key]
        public int RiskId { get; set; }
        public int InitiativeId { get; set; }

        public string RiskFactorId { get; set; }  //dropdown
        public string RootCauseDesction { get; set; }
        public string Phase { get; set; }  //dropdown
        public string Impact { get; set; } //dropdown
        public string Likelihood { get; set; } //dropdown
        public string MitigationPlan { get; set; }
        public DateTime? CompletingDate { get; set; }
        public string MitigationProgress { get; set; }

    }
}
