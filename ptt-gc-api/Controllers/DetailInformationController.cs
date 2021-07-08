using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PTT_GC_API.Data.Interface;
using PTT_GC_API.Dtos.DetailMaxInformation;
using PTT_GC_API.Models.Initiative;

namespace PTT_GC_API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class DetailInformationController : ControllerBase
    {
        private readonly DetailInformationInterface _repository;
        private readonly IMapper _mapper;
        public DetailInformationController(DetailInformationInterface repository, IMapper mapper)
        {
            _repository = repository;
            _mapper = mapper;
        }

        [HttpPost("{id}")]
        public async Task<IActionResult> CreateDetailInformation(int id, CreateDetailInformation CreateDetailInformation)
        {
            CreateDetailInformation.InitiativeId = id;
            var DetailInformation = _mapper.Map<DetailInformation>(CreateDetailInformation);
            _repository.Add(DetailInformation);
            await _repository.Save();
            return Ok(DetailInformation);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDetailInformation(int id, CreateDetailInformation UpdateDetailInformation)
        {
            UpdateDetailInformation.InitiativeId = id;
            var DetailInformation = _mapper.Map<DetailInformation>(UpdateDetailInformation);
            _repository.Update(DetailInformation);
            await _repository.Save();
            return Ok(DetailInformation);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDetailInformation(int id)
        {
            var List = await _repository.GetDetailInformation(id);
            var DetailInformation = _mapper.Map<DetailInformation>(List);
            return Ok(DetailInformation);
        }

        [HttpPost("CreateKpi/{id}")]
        public async Task<IActionResult> CreateKpiDetailInformation(int id, CreateKpiDetailInformation CreateKpiDetailInformation)
        {
            await _repository.CreateKpiDetailInformation(id, CreateKpiDetailInformation);
            return StatusCode(201);
        }
    }
}