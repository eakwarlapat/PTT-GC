using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using PTT_GC_API.Data.Interface;
using PTT_GC_API.Dtos.Capexs;
using PTT_GC_API.Dtos.Initiative;
using PTT_GC_API.Models.CapexInformation;
using PTT_GC_API.Models.Initiative;

namespace PTT_GC_API.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class CapexsInformationsController : ControllerBase
    {
        private readonly CapexsInformationsInterface _CapexsInformation;
        private readonly InitiativeInterface _repository;
        private readonly IMapper _mapper;
        public CapexsInformationsController(InitiativeInterface repository, CapexsInformationsInterface CapexsInformation, IMapper mapper)
        {
            _CapexsInformation = CapexsInformation;
            _repository = repository;
            _mapper = mapper;
        }

        [HttpPost("{id}/{idpool}/{AvailableBudgetPool}")]
        public async Task<IActionResult> CreateCapexsInformations(int id, CapexsInformations DetailCapexs, int idpool, decimal AvailableBudgetPool)
        {
            DetailCapexs.InitiativeId = id;

            var CapexInfor = _mapper.Map<CapexInformations>(DetailCapexs);
            _CapexsInformation.Add(CapexInfor);
            await _CapexsInformation.Save();

            if (DetailCapexs.CapexType == "AddmoreCapex" && DetailCapexs.CapexStatus == "Draft")
            {
                UpdateDraft intitaive = new UpdateDraft
                {
                    Stage = null,
                    Status = "add more"
                };
                var initiativeData = await _repository.GetInitiative(id);
                _mapper.Map(intitaive, initiativeData);
                initiativeData.UpdatedDate = DateTime.Now;
                initiativeData.Stage = null;
                initiativeData.Status = "add more";
                await _repository.Save();
                var initiative = _mapper.Map<InitiativeGeneral>(initiativeData);
            }
            else if (DetailCapexs.CapexType == "Addmorepool" && DetailCapexs.CapexStatus == "Draft")
            {
                UpdateDraft intitaive = new UpdateDraft
                {
                    Stage = null,
                    Status = "add more pool"
                };
                var initiativeData = await _repository.GetInitiative(id);
                _mapper.Map(intitaive, initiativeData);
                initiativeData.UpdatedDate = DateTime.Now;
                initiativeData.Stage = null;
                initiativeData.Status = "add more pool";
                await _repository.Save();
                var initiative = _mapper.Map<InitiativeGeneral>(initiativeData);
            }

            if (idpool != 0)
            {
                UpdateCostPool capex = new UpdateCostPool
                {
                    AvailableBudget = AvailableBudgetPool
                };
                var Capexdata = await _CapexsInformation.GetCapexsInformations(idpool, "Requestpool");
                _mapper.Map(capex, Capexdata);

                Capexdata.AvailableBudget = AvailableBudgetPool;
                Capexdata.SpendingActual = Capexdata.SpendingActual + DetailCapexs.ProjectCost;

                await _CapexsInformation.Save();
                var initiative = _mapper.Map<CapexInformations>(Capexdata);
            }

            return Ok(CapexInfor);
        }

        [HttpGet("{id}/{CapexType}")]
        public async Task<IActionResult> GetCapexsInformations(int id, string CapexType)
        {
            var List = await _CapexsInformation.GetCapexsInformations(id, CapexType);
            var CapexsInformation = _mapper.Map<CapexInformations>(List);
            return Ok(CapexsInformation);
        }

        [HttpGet("GetCapexsInformations_one/{id}")]
        public async Task<IActionResult> GetCapexsInformations_one(int id)
        {
            var List = await _CapexsInformation.GetCapexsInformations_one(id);
            var CapexsInformation = _mapper.Map<CapexInformations>(List);
            return Ok(CapexsInformation);
        }

        [HttpPost("CreateAnnualInvestmentPlan/{id}/{capexid}")]
        public async Task<IActionResult> CreateAnnualInvestmentPlan(int id, int capexid, CreateAnnualInvestmentPlanDtos annualInvestmentPlan)
        {
            return Ok(await _CapexsInformation.CreateAnnualInvestmentPlan(id, capexid, annualInvestmentPlan));
        }

        [HttpGet("GetAnnualInvestmentPlan/{id}/{capexid}")]
        public async Task<IActionResult> GetAnnualInvestmentPlan(int id, int capexid)
        {
            return Ok(await _CapexsInformation.GetAnnualInvestmentPlan(id, capexid));
        }

        [HttpPost("CreateMonthlyInvestmentPlan/{id}/{capexid}")]
        public async Task<IActionResult> CreateMonthlyInvestmentPlan(int id, int capexid, CreateMonthlyInvestmentPlanDtos monthlyInvestmentPlan)
        {
            return Ok(await _CapexsInformation.CreateMonthlyInvestmentPlan(id, capexid, monthlyInvestmentPlan));
        }


        [HttpGet("GetMonthlyInvestmentPlan/{id}/{capexid}/{year}")]
        public async Task<IActionResult> GetMonthlyInvestmentPlan(int id, int capexid, string year)
        {
            return Ok(await _CapexsInformation.GetMonthlyInvestmentPlan(id, capexid, year));
        }

        [HttpGet("GetTotalByRevisionAll/{id}")]
        public async Task<IActionResult> GetTotalByRevisionAll(int id)
        {
            return Ok(await _CapexsInformation.GetTotalByRevisionAll(id));
        }

        [HttpGet("GetCapexsInformationBySubmit/{id}")]
        public async Task<IActionResult> GetCapexsInformationBySubmit(int id)
        {
            return Ok(await _CapexsInformation.GetCapexsInformationBySubmit(id));
        }

        [HttpPut("{id}/{capexid}/{idpool}/{AvailableBudgetPool}")]
        public async Task<IActionResult> PutUpdateCapexsinformations(int id, int capexid, CapexsInformations DetailCapexs,int idpool, decimal AvailableBudgetPool)
        {
            DetailCapexs.InitiativeId = id;
            DetailCapexs.CapexInformationId = capexid;
            var UpdateDetailCapexs = _mapper.Map<CapexInformations>(DetailCapexs);
            _CapexsInformation.Update(UpdateDetailCapexs);
            await _CapexsInformation.Save();

            if (DetailCapexs.CapexType == "AddmoreCapex" && DetailCapexs.CapexStatus == "Draft" )
            {
                UpdateDraft intitaive = new UpdateDraft
                {
                    Stage = null,
                    Status = "add more"
                };
                var initiativeData = await _repository.GetInitiative(id);
                _mapper.Map(intitaive, initiativeData);
                initiativeData.UpdatedDate = DateTime.Now;
                initiativeData.Stage = null;
                initiativeData.Status = "add more";
                await _repository.Save();
                var initiative = _mapper.Map<InitiativeGeneral>(initiativeData);
            }

            if (idpool != 0)
            {
                UpdateCostPool capex = new UpdateCostPool
                {
                    AvailableBudget = AvailableBudgetPool
                };
                var Capexdata = await _CapexsInformation.GetCapexsInformations(idpool, "Requestpool");
                _mapper.Map(capex, Capexdata);

                Capexdata.AvailableBudget = AvailableBudgetPool;
                Capexdata.SpendingActual = Capexdata.SpendingActual + DetailCapexs.ProjectCost;

                await _CapexsInformation.Save();
                var initiative = _mapper.Map<CapexInformations>(Capexdata);
            }
            return Ok(UpdateDetailCapexs);
        }

        [HttpGet("GetPoolInnitiative/{pooltype}/{year}")]
        public async Task<IActionResult> GetPoolInnitiative(string pooltype, int year)
        {
            return Ok(await _CapexsInformation.GetPoolInnitiative(pooltype, year));
        }

        [HttpGet("GetPoolInnitiativeByID/{poolid}")]
        public async Task<IActionResult> GetPoolInnitiativeByID(int poolid)
        {
            return Ok(await _CapexsInformation.GetPoolInnitiativeByID(poolid));
        }

        [HttpPost("GetCodeOfCostCenterVP")]
        public async Task<IActionResult> GetCodeOfCostCenterVP(CodeCostCenterDtos data)
        {
            return Ok(await _CapexsInformation.GetCodeOfCostCenterVP(data));
        }

    }
}