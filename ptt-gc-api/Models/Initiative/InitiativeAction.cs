namespace PTT_GC_API.Models.Initiative
{
    public class InitiativeAction
    {
        public int Id { get; set; }
        public string ActionBy { get; set; }
        public string ActionByName { get; set; }
        public string Action { get; set; }
        public string Position { get; set; }
        public string Status { get; set; }
        public string Stage { get; set; }
        public int InitiativeId { get; set; }
    }
}