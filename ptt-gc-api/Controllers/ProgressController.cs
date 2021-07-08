using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PTT_GC_API.Data.Interface;
using PTT_GC_API.Dtos.ProgressAndMilestone;

namespace PTT_GC_API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class ProgressController : ControllerBase
    {
        private readonly ProgressInterface _repository;
        public ProgressController(ProgressInterface repository)
        {
            _repository = repository;
        }

        [HttpPost("CreateProgressDetail/{id}")]
        public async Task<IActionResult> CreateProgressDetail(int id, CreateProgressDetail CreateProgressDetail)
        {
            await _repository.CreateProgressDetail(id, CreateProgressDetail);
            return StatusCode(201);
        }
    }
}