using System;

namespace PTT_GC_API.Dtos.Initiative
{
    public class InitiativeSubmit
    {
        public string Status { get; set; }
        public string Remark { get; set; }
        public string Stage { get; set; }
        public string Username { get; set; }
        public string SecretProject { get; set; }
        public string GoToStage { get; set; }
        public DateTime? ApprovedDate { get; set; }
        public InitiativeSubmit()
        {
            ApprovedDate = DateTime.Now;
        }
    }
}