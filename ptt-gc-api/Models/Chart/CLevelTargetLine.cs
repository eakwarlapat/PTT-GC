using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace PTT_GC_API.Models.Chart
{
    public class CLevelTargetLine
    {
        [Key]
        public int Id { get; set; }
        public string CLevel { get; set; }
        public string Year { get; set; }
        [RegularExpression(@"\d+(\.\d{1,2})?")]
        [Column(TypeName = "decimal(18,2)")]
        public decimal? Target { get; set; }
        public string StageType { get; set; }
    }
}
