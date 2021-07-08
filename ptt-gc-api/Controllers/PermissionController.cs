using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PTT_GC_API.Data.Interface;
using PTT_GC_API.Dtos.Permission;

namespace PTT_GC_API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PermissionController : ControllerBase
    {
        private readonly PermissionInterface _repository;

        public PermissionController(PermissionInterface repository)
        {
            _repository = repository;
        }
        [AllowAnonymous]
        [HttpPost("Overview")]
        public async Task<IActionResult> CheckOverviewPermission(Overview overview)
        {
            var result = await _repository.CheckOverviewPermission(overview);
            return Ok(result);
        }

        [AllowAnonymous]
        [HttpPost("Dashboard")]
        public async Task<IActionResult> CheckDashboardPermission(Dashboard dashboard)
        {
            var result = await _repository.CheckDashboardPermission(dashboard);
            return Ok(result);
        }

        [HttpGet("checksectionname")]
        public async Task<IActionResult> checksectionname(string email, string page, int initiativeId)
        {
            //CheckPermission cp = new CheckPermission();
            //cp.Email = "akrapon.s@frontiscompany.com";
            //cp.Page = "impact";
            //var aa = new List<string> { "1", "2", "3", cp.Email, cp.Page };

            var initiativesData = await _repository.GetListPermission(email, page, initiativeId);

            return Ok(initiativesData);
        }

    }
}