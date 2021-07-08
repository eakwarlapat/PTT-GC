using System;
using Microsoft.AspNetCore.Http;

namespace PTT_GC_API.Dtos.Initiative
{
    public class InitiativeCreateAttachment
    {
        public IFormFile File { get; set; }
        public DateTime CreatedDate { get; set; }
        public InitiativeCreateAttachment()
        {
            CreatedDate = DateTime.Now;
        }
    }
}