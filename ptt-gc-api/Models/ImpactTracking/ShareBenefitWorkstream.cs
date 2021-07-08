using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PTT_GC_API.Models.ImpactTracking
{
    public class ShareBenefitWorkstream
    {
        public int Id { get; set; }
        public string Workstream { get; set; }
        [RegularExpression(@"\d+(\.\d{1,2})?")]
        [Column(TypeName = "decimal(18,2)")]
        public decimal? Percent { get; set; }
        public int InitiativeId { get; set; }
    }
}