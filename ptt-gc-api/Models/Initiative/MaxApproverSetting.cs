using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace PTT_GC_API.Models.Initiative
{
    public class MaxApproverSetting
    {
        [Key]
        public int Id { get; set; }
        public string WorkstreamType { get; set; }
        public string WorkstreamValue { get; set; }
        public string Indicator { get; set; }
        public string ApproverEmail { get; set; }
        public int? Order { get; set; }

    }
}
