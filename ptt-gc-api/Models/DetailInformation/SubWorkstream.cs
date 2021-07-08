namespace PTT_GC_API.Models.DetailInformation
{
    public class SubWorkstream
    {
        public int Id { get; set; }
        public string WorkStreamTitle { get; set; }
        public string SubWorkstream1 { get; set; }
        public string SubWorkstream2 { get; set; }
        public string CLevel { get; set; }

        public int? CLevelOrder { get; set; }
        public int? WorkstreamOrder { get; set; }
        public int? Subworkstream1Order { get; set; }
        public int? Subworkstream2Order { get; set; }
    }
}
