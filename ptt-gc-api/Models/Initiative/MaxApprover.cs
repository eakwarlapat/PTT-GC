using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace PTT_GC_API.Models.Initiative
{
    public class MaxApprover
    {
        [Key]
        public int Id { get; set; }
        public int InitiativeId { get; set; }
        public string ApproverType { get; set; }
        public string ApproverEmail { get; set; }
        public int? Order { get; set; }
    }
}
