using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PTT_GC_API.Data.Interface;

namespace PTT_GC_API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class InitiativeActionController : ControllerBase
    {
        private readonly InitiativeActionInterface _repository;
        public InitiativeActionController(InitiativeActionInterface repository)
        {
            _repository = repository;
        }
        [HttpGet("{id}")]
        public async Task<IActionResult> GetInitiativeAction(int id)
        {
            return Ok(await _repository.GetInitiativeAction(id));
        }
    }
}