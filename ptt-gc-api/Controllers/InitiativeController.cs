using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using PTT_GC_API.Data.Interface;
using PTT_GC_API.Dtos.Initiative;
using PTT_GC_API.Models.Initiative;
using System;
using System.Linq;
using AutoMapper;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using System.IO;
using Microsoft.Azure.Storage;
using Microsoft.Azure.Storage.Blob;
using Microsoft.Extensions.Options;
using PTT_GC_API.API.Helpers;

namespace PTT_GC_API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class InitiativeController : ControllerBase
    {
        private readonly InitiativeInterface _repository;
        private readonly IFInterface _repositoryIF;
        private readonly IMapper _mapper;
        private readonly IOptions<BlobConfig> _blobConfig;
        public InitiativeController(InitiativeInterface repository, IMapper mapper, IOptions<BlobConfig> blobConfig, IFInterface repositoryIF)
        {
            _mapper = mapper;
            _repository = repository;
            _blobConfig = blobConfig;
            _repositoryIF = repositoryIF;
        }

        [HttpGet]
        public async Task<IActionResult> GetInitiatives([FromQuery]InitiativeParams InitiativeParams)
        {
            var initiativesData = await _repository.GetInitiatives(InitiativeParams);
            var initiatives = _mapper.Map<IEnumerable<InitiativeList>>(initiativesData);
            Response.AddPagination(initiativesData.CurrentPage, initiativesData.PageSize, initiativesData.TotalCount, initiativesData.TotalPages);
            return Ok(initiatives);
        }

        [HttpGet("InitiativeCode/{id}")]
        public async Task<IActionResult> GetInitiativeCode(int id)
        {
            var initiative = await _repository.GetInitiative(id);
            if (initiative == null)
            {
                return null;
            }
            return Ok(new { Code = initiative.InitiativeCode });
        }

        private async Task<string> InitiativeCode()
        {
            DateTime now = DateTime.Now;
            var Year = now.Year;
            string code;
            if (await _repository.Any())
            {
                var last = await _repository.LastInitiative();
                string[] words = last.InitiativeCode.Split('-');

                if (words.Count() == 1)
                {
                    code = Year.ToString() + "-000001";
                }
                else
                {
                    int lastCode = Int32.Parse(words[1]);
                    int InitiativeId = ++lastCode;
                    code = Year.ToString() + "-" + InitiativeId.ToString("D6");
                }
            }
            else
            {
                code = Year.ToString() + "-000001";
            }
            return code;
        }

        [HttpPost("Draft")]
        public async Task<IActionResult> CreateDraftInitiative(InitiativeCreate initiativeCreate)
        {
            initiativeCreate.InitiativeCode = await InitiativeCode();
            initiativeCreate.Status = "draft";
            initiativeCreate.UpdatedBy = initiativeCreate.CreatedBy;
            var initiative = _mapper.Map<Initiative>(initiativeCreate);
            _repository.Add(initiative);
            await _repository.Save();
            return Ok(initiative);
        }

        [HttpPost("Submit")]
        public async Task<IActionResult> CreateSubmitInitiative(InitiativeCreate initiativeCreate)
        {
            initiativeCreate.InitiativeCode = await InitiativeCode();
            initiativeCreate.UpdatedBy = initiativeCreate.CreatedBy;
            if (initiativeCreate.Cim == true || initiativeCreate.Strategy == true || initiativeCreate.Max == true || initiativeCreate.DirectCapex == true)
            {
                initiativeCreate.Status = "draft";
                initiativeCreate.Stage = null;
            }
            else
            {
                initiativeCreate.Status = "admin check";
                initiativeCreate.Stage = "waiting";
            }
            var initiative = _mapper.Map<Initiative>(initiativeCreate);
            _repository.Add(initiative);
            await _repository.Save();
            await _repository.SetActionBy(initiative.Id, initiativeCreate.CreatedBy, initiativeCreate.Status, initiativeCreate.Stage);
            return Ok(initiative);
        }

        [HttpPut("Draft/{id}")]
        public async Task<IActionResult> UpdateDraftInitiative(int id, InitiativeUpdate initiativeUpdate)
        {
            var initiativeData = await _repository.GetInitiative(id);
            _mapper.Map(initiativeUpdate, initiativeData);
            initiativeData.UpdatedDate = DateTime.Now;
            await _repository.Save();
            var initiative = _mapper.Map<InitiativeGeneral>(initiativeData);
            return Ok(initiative);
        }

        [HttpPut("Addmore/{id}")]
        public async Task<IActionResult> UpdateDraftAddMoreInitiative(int id, InitiativeAddmore InitiativeAddmore)
        {
            var initiativeData = await _repository.GetInitiative(id);
            _mapper.Map(InitiativeAddmore, initiativeData);
            initiativeData.UpdatedDate = DateTime.Now;
            await _repository.Save();
            var initiative = _mapper.Map<InitiativeGeneral>(initiativeData);
            return Ok(initiative);
        }

        [HttpPut("Submit/{id}")]
        public async Task<IActionResult> UpdateSubmitInitiative(int id, InitiativeUpdate initiativeUpdate)
        {
            var initiativeData = await _repository.GetInitiative(id);
            _mapper.Map(initiativeUpdate, initiativeData);
            initiativeData.UpdatedDate = DateTime.Now;
            await _repository.Save();
            //await _repository.SetActionBy(initiativeData.Id, initiativeData.CreatedBy, initiativeData.Status, initiativeData.Stage);
            var initiative = _mapper.Map<InitiativeGeneral>(initiativeData);
            return Ok(initiative);
        }

        [HttpPut("RequestOpex/{id}")]
        public async Task<IActionResult> UpdateRequestOpex(int id, InitiativeRequestOpex InitiativeOpex)
        {
            var initiativeData = await _repository.GetInitiative(id);
            if (InitiativeOpex.RequestOpex == "true")
            {
                InitiativeOpex.RequestOpex = "trueOpex";
                InitiativeOpex.CostEstOpex = InitiativeOpex.CostEstOpex;
            }
            else
            {
                InitiativeOpex.RequestOpex = "falseOpex";
            }
            _mapper.Map(InitiativeOpex, initiativeData);
            await _repository.Save();
            return NoContent();
        }

        [HttpPut("BenefitAmount/{id}")]
        public async Task<IActionResult> UpdateBenefitAmount(int id, InitiativeBenefitAmount InitiativeBenefitAmount)
        {
            var initiativeData = await _repository.GetInitiative(id);
            _mapper.Map(InitiativeBenefitAmount, initiativeData);
            await _repository.Save();
            return NoContent();
        }

        [HttpPost("Action/Submit/{id}")]
        public async Task<IActionResult> InitiativeActionSubmit(int id, InitiativeSubmit initiativeSubmit)
        {
            //On All Approved



            var initiative = await _repository.GetInitiative(id);
            var initiativeType = (initiative.InitiativeType == null ? "max" : initiative.InitiativeType);
            string[] initiativeTypeDIM = { "IT", "Digital" };

            //if (initiativeType == "directCapex")
            //{
            //    //await _repository.CallMicrosoftFlow_OnApproved(id, initiativeSubmit.Status, "MSFLOW_ONALLAPPROVED");
            //}


            string tmpinitiativeSubmitStatus = initiativeSubmit.Status;
            string tmpinitiativeSubmitStage = initiative.Stage;
            await _repository.InsertStagesHistory(initiative, initiativeSubmit);
            if (initiativeSubmit.Status == "approve")
            {
                if (await _repository.CountInitiativeAction(id) > 1 && initiative.Stage != "waiting")  //stage waiting (admin check) ให้ approve คนเดียวผ่านได้เลย
                {
                    if (initiativeType.Contains("max"))
                    { // approve  1 คน ให้ลบคนที่เหลือออกทั้งหมด
                        if (await _repository.isMatchedApproverType(id, initiativeSubmit.Username, "TO Finance"))
                        {
                            await _repository.RemoveActionBy_ByApproverType(id, "TO Finance", initiativeSubmit.Username);
                        }
                        if (await _repository.isMatchedApproverType(id, initiativeSubmit.Username, "CTO"))
                        {
                            await _repository.RemoveActionBy_ByApproverType(id, "CTO", initiativeSubmit.Username);
                        }
                        if (await _repository.isMatchedApproverType(id, initiativeSubmit.Username, "TOTeam"))
                        {
                            await _repository.RemoveActionBy_ByApproverType(id, "TOTeam", initiativeSubmit.Username);
                        }
                    }

                    await _repository.RemoveInitiativeActions(id, initiativeSubmit.Username);
                    await _repository.UpdateStagesTracking_OnApprove(initiative, initiativeSubmit);

                    if (await _repository.CountInitiativeAction(id) == 0) goto next_stage; //if no more actionby then go to next stage

                    return NoContent();
                }
            }

        next_stage:


            if (initiative.InitiativeType.ToLower() == "cim")
            {
                switch (initiative.Stage)
                {
                    case "Admin Check":
                        if (initiativeSubmit.Status == "approve")
                        {
                            initiativeSubmit.Status = "wait for approval";
                            initiativeSubmit.Stage = "First Review";
                        }
                        else if (initiativeSubmit.Status == "revise")
                        {
                            initiativeSubmit.Status = "revised";
                            initiativeSubmit.Stage = initiative.Stage;
                        }
                        else if (initiativeSubmit.Status == "reject")
                        {
                            initiativeSubmit.Status = "reject";
                            initiativeSubmit.Stage = "cancelled";
                        }
                        break;

                    case "First Review":
                        if (initiativeSubmit.Status == "approve")
                        {
                            initiativeSubmit.Status = "";
                            initiativeSubmit.Stage = "Initiative";
                        }
                        else if (initiativeSubmit.Status == "revise")
                        {
                            initiativeSubmit.Status = "revised";
                            initiativeSubmit.Stage = initiative.Stage;
                        }
                        else if (initiativeSubmit.Status == "reject")
                        {
                            initiativeSubmit.Status = "reject";
                            initiativeSubmit.Stage = "cancelled";
                        }
                        break;

                    case "Initiative":
                        if (initiativeSubmit.Status == "approve")
                        {
                            initiativeSubmit.Status = "";
                            initiativeSubmit.Stage = "Detail F/S";
                        }
                        else if (initiativeSubmit.Status == "revise")
                        {
                            initiativeSubmit.Status = "revised";
                            initiativeSubmit.Stage = initiative.Stage;
                        }
                        else if (initiativeSubmit.Status == "reject")
                        {
                            initiativeSubmit.Status = "reject";
                            initiativeSubmit.Stage = "cancelled";
                        }
                        break;

                    case "Detail F/S":
                        if (initiativeSubmit.Status == "approve")
                        {
                            initiativeSubmit.Status = "";
                            initiativeSubmit.Stage = "BEP";
                        }
                        else if (initiativeSubmit.Status == "revise")
                        {
                            initiativeSubmit.Status = "revised";
                            initiativeSubmit.Stage = initiative.Stage;
                        }
                        else if (initiativeSubmit.Status == "reject")
                        {
                            initiativeSubmit.Status = "reject";
                            initiativeSubmit.Stage = "cancelled";
                        }
                        break;

                    case "BEP":
                        if (initiativeSubmit.Status == "approve")
                        {
                            initiativeSubmit.Status = "";
                            initiativeSubmit.Stage = "Execution";
                        }
                        else if (initiativeSubmit.Status == "revise")
                        {
                            initiativeSubmit.Status = "revised";
                            initiativeSubmit.Stage = initiative.Stage;
                        }
                        else if (initiativeSubmit.Status == "reject")
                        {
                            initiativeSubmit.Status = "reject";
                            initiativeSubmit.Stage = "cancelled";
                        }
                        break;
                }
            }
            else
            {
                switch (initiative.Stage)
                {
                    case "DM":
                        if (initiativeTypeDIM.Contains(initiativeType))
                        {
                            if (initiativeSubmit.Status == "approve")
                            {
                                initiativeSubmit.Status = "wait for approval";
                                initiativeSubmit.Stage = "VP";
                            }
                            else if (initiativeSubmit.Status == "revise")
                            {
                                initiativeSubmit.Status = "revised";
                                initiativeSubmit.Stage = "draft";
                            }
                            else if (initiativeSubmit.Status == "reject")
                            {
                                initiativeSubmit.Status = "reject";
                                initiativeSubmit.Stage = "cancelled";
                            }
                        }
                        else
                        {
                            if (initiativeSubmit.Status == "approve")
                            {
                                initiativeSubmit.Status = "wait for approval";
                                initiativeSubmit.Stage = "VP";
                            }
                            else if (initiativeSubmit.Status == "revise")
                            {
                                initiativeSubmit.Status = "revised";
                                initiativeSubmit.Stage = "DM";
                            }
                            else if (initiativeSubmit.Status == "reject")
                            {
                                initiativeSubmit.Status = "reject";
                                initiativeSubmit.Stage = "cancelled";
                            }

                        }
                        break;

                    case "VP":
                        if (initiativeTypeDIM.Contains(initiativeType))
                        {
                            if (initiativeSubmit.Status == "approve")
                            {
                                initiativeSubmit.Status = "wait for approval";
                                initiativeSubmit.Stage = "admin";
                            }
                            else if (initiativeSubmit.Status == "revise")
                            {
                                initiativeSubmit.Status = "revised";
                                initiativeSubmit.Stage = "draft";
                            }
                            else if (initiativeSubmit.Status == "reject")
                            {
                                initiativeSubmit.Status = "reject";
                                initiativeSubmit.Stage = "cancelled";
                            }
                        }
                        else
                        {
                            if (initiativeSubmit.Status == "approve")
                            {
                                initiativeSubmit.Status = "wait for approval";
                                initiativeSubmit.Stage = "EVP/MD/SEVP/COE/PSD/CEO";
                            }
                            else if (initiativeSubmit.Status == "revise")
                            {
                                initiativeSubmit.Status = "revised";
                                initiativeSubmit.Stage = "VP";
                            }
                            else if (initiativeSubmit.Status == "reject")
                            {
                                initiativeSubmit.Status = "reject";
                                initiativeSubmit.Stage = "cancelled";
                            }
                        }
                        break;

                    case "admin":
                        if (initiativeSubmit.Status == "approve")
                        {
                            initiativeSubmit.Status = "principle approved";
                            initiativeSubmit.Stage = "complete";
                        }
                        else if (initiativeSubmit.Status == "revise")
                        {
                            initiativeSubmit.Status = "revised";
                            initiativeSubmit.Stage = "draft";
                        }
                        else if (initiativeSubmit.Status == "reject")
                        {
                            initiativeSubmit.Status = "reject";
                            initiativeSubmit.Stage = "cancelled";
                        }
                        break;

                    case "EVP/MD/SEVP/COE/PSD/CEO":
                        if (initiativeSubmit.Status == "approve")
                        {
                            initiativeSubmit.Status = "wait for review";
                            initiativeSubmit.Stage = "Budget Team";
                        }
                        else if (initiativeSubmit.Status == "revise")
                        {
                            initiativeSubmit.Status = "revised";
                            initiativeSubmit.Stage = "EVP/MD/SEVP/COE/PSD/CEO";
                        }
                        else if (initiativeSubmit.Status == "reject")
                        {
                            initiativeSubmit.Status = "reject";
                            initiativeSubmit.Stage = "cancelled";
                        }
                        break;

                    case "Budget Team":
                        if (initiativeSubmit.Status == "approve")
                        {
                            initiativeSubmit.Status = "wait for approval";
                            initiativeSubmit.Stage = "BOD";
                        }
                        else if (initiativeSubmit.Status == "revise")
                        {
                            initiativeSubmit.Status = "revised";
                            initiativeSubmit.Stage = "Budget Team";
                        }
                        else if (initiativeSubmit.Status == "reject")
                        {
                            initiativeSubmit.Status = "reject";
                            initiativeSubmit.Stage = "cancelled";
                        }
                        break;

                    case "BOD":
                        if (initiativeSubmit.Status == "approve")
                        {
                            initiativeSubmit.Status = "wait for create App.";
                            initiativeSubmit.Stage = "App. Request";
                        }
                        else if (initiativeSubmit.Status == "revise")
                        {
                            initiativeSubmit.Status = "revised";
                            initiativeSubmit.Stage = "BOD";
                        }
                        else if (initiativeSubmit.Status == "reject")
                        {
                            initiativeSubmit.Status = "reject";
                            initiativeSubmit.Stage = "cancelled";
                        }
                        break;

                    case "App. Request":
                        if (initiativeSubmit.Status == "approve")
                        {
                            initiativeSubmit.Status = "wait for create WBS";
                            initiativeSubmit.Stage = "WBS Request";
                        }
                        else if (initiativeSubmit.Status == "revise")
                        {
                            initiativeSubmit.Status = "revised";
                            initiativeSubmit.Stage = "App. Request";
                        }
                        else if (initiativeSubmit.Status == "reject")
                        {
                            initiativeSubmit.Status = "reject";
                            initiativeSubmit.Stage = "cancelled";
                        }
                        break;

                    case "WBS Request":
                        if (initiativeSubmit.Status == "approve")
                        {
                            initiativeSubmit.Status = "wait for approval";
                            initiativeSubmit.Stage = "Budget Distribute";
                        }
                        else if (initiativeSubmit.Status == "revise")
                        {
                            initiativeSubmit.Status = "revised";
                            initiativeSubmit.Stage = "WBS Request";
                        }
                        else if (initiativeSubmit.Status == "reject")
                        {
                            initiativeSubmit.Status = "reject";
                            initiativeSubmit.Stage = "cancelled";
                        }
                        break;

                    case "Budget Distribute":
                        if (initiativeSubmit.Status == "approve")
                        {
                            initiativeSubmit.Status = "finish";
                            initiativeSubmit.Stage = "Budget Distribute";
                        }
                        else if (initiativeSubmit.Status == "revise")
                        {
                            initiativeSubmit.Status = "revised";
                            initiativeSubmit.Stage = "Budget Distribute";
                        }
                        else if (initiativeSubmit.Status == "reject")
                        {
                            initiativeSubmit.Status = "reject";
                            initiativeSubmit.Stage = "cancelled";
                        }
                        break;

                    case "waiting":
                        if (initiativeSubmit.Status == "approve")
                        {
                            initiativeSubmit.Status = "wait for submission";
                            initiativeSubmit.Stage = "IL0";
                        }
                        else if (initiativeSubmit.Status == "revise")
                        {
                            initiativeSubmit.Status = "revised";
                            initiativeSubmit.Stage = "draft";
                        }
                        else if (initiativeSubmit.Status == "reject")
                        {
                            initiativeSubmit.Status = "reject";
                            initiativeSubmit.Stage = "cancelled";
                        }
                        break;

                    case "SIL1":
                        if (initiativeSubmit.Status == "approve")
                        {
                            initiativeSubmit.Status = "approved";
                            initiativeSubmit.Stage = "IL1";
                        }
                        else if (initiativeSubmit.Status == "revise")
                        {
                            initiativeSubmit.Status = "revised";
                            initiativeSubmit.Stage = "IL0";
                        }
                        else if (initiativeSubmit.Status == "reject")
                        {
                            initiativeSubmit.Status = "reject";
                            initiativeSubmit.Stage = "cancelled";
                        }
                        else if (initiativeSubmit.Status == "approve cancellation")
                        {
                            initiativeSubmit.Status = "cancelled";
                            initiativeSubmit.Stage = "cancelled";
                        }
                        else if (initiativeSubmit.Status == "reject cancellation")
                        {
                            initiativeSubmit.Status = "draft";
                            initiativeSubmit.Stage = "IL0";
                        }
                        break;
                    case "SIL2":
                        if (initiativeSubmit.Status == "approve")
                        {
                            initiativeSubmit.Status = "approved";
                            initiativeSubmit.Stage = "IL2";
                        }
                        else if (initiativeSubmit.Status == "revise")
                        {
                            initiativeSubmit.Status = "revised";
                            initiativeSubmit.Stage = "IL1";
                        }
                        else if (initiativeSubmit.Status == "reject")
                        {
                            initiativeSubmit.Status = "reject";
                            initiativeSubmit.Stage = "cancelled";
                        }
                        else if (initiativeSubmit.Status == "approve cancellation")
                        {
                            initiativeSubmit.Status = "cancelled";
                            initiativeSubmit.Stage = "cancelled";
                        }
                        else if (initiativeSubmit.Status == "reject cancellation")
                        {
                            initiativeSubmit.Status = "draft";
                            initiativeSubmit.Stage = "IL1";
                        }
                        break;
                    case "SIL3":
                        if (initiativeSubmit.Status == "approve")
                        {
                            initiativeSubmit.Status = "approved";
                            initiativeSubmit.Stage = "IL3";
                        }
                        else if (initiativeSubmit.Status == "revise")
                        {
                            initiativeSubmit.Status = "revised";
                            initiativeSubmit.Stage = "IL2";
                        }
                        else if (initiativeSubmit.Status == "reject")
                        {
                            initiativeSubmit.Status = "reject";
                            initiativeSubmit.Stage = "cancelled";
                        }
                        else if (initiativeSubmit.Status == "approve cancellation")
                        {
                            initiativeSubmit.Status = "cancelled";
                            initiativeSubmit.Stage = "cancelled";
                        }
                        else if (initiativeSubmit.Status == "reject cancellation")
                        {
                            initiativeSubmit.Status = "draft";
                            initiativeSubmit.Stage = "IL2";
                        }
                        break;
                    case "SIL4":
                        if (initiativeSubmit.Status == "approve")
                        {
                            initiativeSubmit.Status = "approved";
                            initiativeSubmit.Stage = "IL4";
                        }
                        else if (initiativeSubmit.Status == "revise")
                        {
                            initiativeSubmit.Status = "revised";
                            initiativeSubmit.Stage = "IL3";
                        }
                        else if (initiativeSubmit.Status == "reject")
                        {
                            initiativeSubmit.Status = "reject";
                            initiativeSubmit.Stage = "cancelled";
                        }
                        else if (initiativeSubmit.Status == "approve cancellation")
                        {
                            initiativeSubmit.Status = "cancelled";
                            initiativeSubmit.Stage = "cancelled";
                        }
                        else if (initiativeSubmit.Status == "reject cancellation")
                        {
                            initiativeSubmit.Status = "draft";
                            initiativeSubmit.Stage = "IL3";
                        }
                        break;
                    case "SIL5":
                        if (initiativeSubmit.Status == "approve")
                        {
                            initiativeSubmit.Status = "approved";
                            initiativeSubmit.Stage = "IL5";
                        }
                        else if (initiativeSubmit.Status == "revise")
                        {
                            initiativeSubmit.Status = "revised";
                            initiativeSubmit.Stage = "IL4";
                        }
                        else if (initiativeSubmit.Status == "reject")
                        {
                            initiativeSubmit.Status = "reject";
                            initiativeSubmit.Stage = "cancelled";
                        }
                        else if (initiativeSubmit.Status == "approve cancellation")
                        {
                            initiativeSubmit.Status = "cancelled";
                            initiativeSubmit.Stage = "cancelled";
                        }
                        else if (initiativeSubmit.Status == "reject cancellation")
                        {
                            initiativeSubmit.Status = "draft";
                            initiativeSubmit.Stage = "IL4";
                        }
                        break;
                    case "IL0":
                        if (initiativeSubmit.Status == "approve cancellation")
                        {
                            initiativeSubmit.Status = "cancelled";
                            initiativeSubmit.Stage = "cancelled";
                        }
                        else if (initiativeSubmit.Status == "reject cancellation")
                        {
                            initiativeSubmit.Status = "draft";
                            initiativeSubmit.Stage = "IL0";
                        }
                        break;
                    case "IL1":
                        if (initiativeSubmit.Status == "approve cancellation")
                        {
                            initiativeSubmit.Status = "cancelled";
                            initiativeSubmit.Stage = "cancelled";
                        }
                        else if (initiativeSubmit.Status == "reject cancellation")
                        {
                            initiativeSubmit.Status = "draft";
                            initiativeSubmit.Stage = "IL1";
                        }
                        break;
                    case "IL2":
                        if (initiativeSubmit.Status == "approve cancellation")
                        {
                            initiativeSubmit.Status = "cancelled";
                            initiativeSubmit.Stage = "cancelled";
                        }
                        else if (initiativeSubmit.Status == "reject cancellation")
                        {
                            initiativeSubmit.Status = "draft";
                            initiativeSubmit.Stage = "IL2";
                        }
                        break;
                    case "IL3":
                        if (initiativeSubmit.Status == "approve cancellation")
                        {
                            initiativeSubmit.Status = "cancelled";
                            initiativeSubmit.Stage = "cancelled";
                        }
                        else if (initiativeSubmit.Status == "reject cancellation")
                        {
                            initiativeSubmit.Status = "draft";
                            initiativeSubmit.Stage = "IL3";
                        }
                        break;
                    case "IL4":
                        if (initiativeSubmit.Status == "approve cancellation")
                        {
                            initiativeSubmit.Status = "cancelled";
                            initiativeSubmit.Stage = "cancelled";
                        }
                        else if (initiativeSubmit.Status == "reject cancellation")
                        {
                            initiativeSubmit.Status = "draft";
                            initiativeSubmit.Stage = "IL4";
                        }
                        break;
                }
            }


            if (!tmpinitiativeSubmitStatus.Contains("cancellation"))
            {
                await _repository.UpdateStagesTracking_OnApprove(initiative, initiativeSubmit);
            }

            _mapper.Map(initiativeSubmit, initiative);
            await _repository.Save();
            await _repository.SetActionBy(initiative.Id, initiativeSubmit.Username, initiativeSubmit.Status, initiativeSubmit.Stage);
            await _repository.ChangeApproverStatusTrackingFromSetActionBy(initiative);


            if (tmpinitiativeSubmitStatus == "revise" || tmpinitiativeSubmitStatus == "reject")
                await _repository.CallMicrosoftFlow_SendMail(id, tmpinitiativeSubmitStatus);  // case 2 case 3  revise, reject  -  send mail to owner / creator

            if (tmpinitiativeSubmitStatus == "approve")
            {
                if (new string[] { "SIL4", "SIL5" }.Contains(tmpinitiativeSubmitStage)) //Date @ change stage to IL4 , IL5 (FROM SIL4 , SIL5)
                {
                    await _repository.UpdateLastestApproved(id, tmpinitiativeSubmitStage); //SIL4 , SIL5 only
                }
                await _repository.CallMicrosoftFlow_SendMail(id, "owner");  // case 4  send mail to owner / creator after approved all
            }


            //Interface CAPEX!!!   IF001
            if (initiativeSubmit.Status == "wait for create App." && initiativeSubmit.Stage == "App. Request")
            {
                var nowDateTime = DateTime.Now;
                await _repositoryIF.CAPEX_IF_001_SAPIM_CP(id, nowDateTime);
                await _repositoryIF.CAPEX_IF_001_SAPIM_General(id, nowDateTime);
                await _repositoryIF.CAPEX_IF_001_SAPIM_Monthly(id, nowDateTime);
                await _repositoryIF.CAPEX_IF_001_SAPIM_Yearly(id, nowDateTime);
            }

            return NoContent();

        }

        [HttpPost("SubmitStageStatus/{id}")]
        public async Task<IActionResult> InitiativeSubmitStageStatus(int id, InitiativeSubmitStageStatus initiativeSubmitStageStatus)
        {
            //call microsoft flow  to set initiative action , Stage Trackings
            //await _repository.CallMicrosoftFlow_OnSubmit(id, initiativeSubmitStageStatus.Status, "MSFLOW_ONSUBMIT");

            var initiative = await _repository.GetInitiative(id);
            string statusDirection = initiativeSubmitStageStatus.Status;
            string[] InitiativeTypeCapex = { "directCapex", "Digital Survey", "Request Pool" };
            string[] initiativeTypeDIM = { "IT", "Digital" };

            //if (InitiativeType.Contains("directCapex"))
            //{
            //    await _repository.CallMicrosoftFlow_OnSubmit(id, initiativeSubmitStageStatus.Status, "MSFLOW_ONSUBMIT");
            //}

            if (initiative.InitiativeType.ToLower() == "cim")
            {
                switch (initiative.Stage)
                {
                    case "draft":
                        if (initiativeSubmitStageStatus.Status == "forward")
                        {
                            initiativeSubmitStageStatus.Status = "wait for approval";
                            initiativeSubmitStageStatus.Stage = "Admin Check";
                        }
                        else if (initiativeSubmitStageStatus.Status == "cancelled")
                        {
                            initiativeSubmitStageStatus.Status = "cancelled";
                            initiativeSubmitStageStatus.Stage = "cancelled";
                        }
                        break;

                    case "Initiative":
                        if (initiativeSubmitStageStatus.Status == "forward")
                        {
                            initiativeSubmitStageStatus.Status = "wait for approval";
                            initiativeSubmitStageStatus.Stage = initiative.Stage;
                        }
                        else if (initiativeSubmitStageStatus.Status == "backward")
                        {
                            initiativeSubmitStageStatus.Status = "draft";
                            initiativeSubmitStageStatus.Stage = initiative.Stage;
                        }
                        else if (initiativeSubmitStageStatus.Status == "cancelled")
                        {
                            initiativeSubmitStageStatus.Status = "cancelled";
                            initiativeSubmitStageStatus.Stage = "cancelled";
                        }
                        break;

                    case "Detail F/S":
                        if (initiativeSubmitStageStatus.Status == "forward")
                        {
                            initiativeSubmitStageStatus.Status = "wait for approval";
                            initiativeSubmitStageStatus.Stage = initiative.Stage;
                        }
                        else if (initiativeSubmitStageStatus.Status == "backward")
                        {
                            initiativeSubmitStageStatus.Status = "draft";
                            initiativeSubmitStageStatus.Stage = initiative.Stage;
                        }
                        else if (initiativeSubmitStageStatus.Status == "cancelled")
                        {
                            initiativeSubmitStageStatus.Status = "cancelled";
                            initiativeSubmitStageStatus.Stage = "cancelled";
                        }
                        break;

                    case "BEP":
                        if (initiativeSubmitStageStatus.Status == "forward")
                        {
                            initiativeSubmitStageStatus.Status = "wait for approval";
                            initiativeSubmitStageStatus.Stage = initiative.Stage;
                        }
                        else if (initiativeSubmitStageStatus.Status == "backward")
                        {
                            initiativeSubmitStageStatus.Status = "draft";
                            initiativeSubmitStageStatus.Stage = initiative.Stage;
                        }
                        else if (initiativeSubmitStageStatus.Status == "cancelled")
                        {
                            initiativeSubmitStageStatus.Status = "cancelled";
                            initiativeSubmitStageStatus.Stage = "cancelled";
                        }
                        break;

                    default:
                        initiativeSubmitStageStatus.Status = "wait for approval";
                        initiativeSubmitStageStatus.Stage = "Admin Check";

                        await _repository.CreateStagesTracking(initiative);

                        break;
                }
            }
            else
            {
                switch (initiative.Stage)
                {
                    case "draft":
                        if (InitiativeTypeCapex.Contains(initiative.InitiativeType))
                        {
                            if (initiativeSubmitStageStatus.Status == "forward")
                            {
                                initiativeSubmitStageStatus.Status = "wait for approval";
                                initiativeSubmitStageStatus.Stage = "DM";
                            }
                            else if (initiativeSubmitStageStatus.Status == "cancelled")
                            {
                                initiativeSubmitStageStatus.Status = "cancelled";
                                initiativeSubmitStageStatus.Stage = "cancelled";
                            }
                            break;
                        }
                        if (initiativeTypeDIM.Contains(initiative.InitiativeType))  //DIM
                        {
                            if (initiativeSubmitStageStatus.Status == "forward")
                            {
                                initiativeSubmitStageStatus.Status = "wait for approval";
                                initiativeSubmitStageStatus.Stage = "DM";
                            }
                            else if (initiativeSubmitStageStatus.Status == "cancelled")
                            {
                                initiativeSubmitStageStatus.Status = "cancelled";
                                initiativeSubmitStageStatus.Stage = "cancelled";
                            }
                            break;
                        }
                        else
                        {
                            if (initiativeSubmitStageStatus.Status == "forward")
                            {
                                initiativeSubmitStageStatus.Status = "admin check";
                                initiativeSubmitStageStatus.Stage = "waiting";
                            }
                            else if (initiativeSubmitStageStatus.Status == "cancelled")
                            {
                                initiativeSubmitStageStatus.Status = "cancelled";
                                initiativeSubmitStageStatus.Stage = "cancelled";
                            }
                        }

                        break;

                    case "DM":
                        if (initiativeSubmitStageStatus.Status == "forward")
                        {
                            initiativeSubmitStageStatus.Status = "wait for approval";
                            initiativeSubmitStageStatus.Stage = "DM";
                        }
                        else if (initiativeSubmitStageStatus.Status == "backward")
                        {
                            initiativeSubmitStageStatus.Status = "draft";
                            initiativeSubmitStageStatus.Stage = "DM";
                        }
                        else if (initiativeSubmitStageStatus.Status == "cancelled")
                        {
                            initiativeSubmitStageStatus.Status = "cancelled";
                            initiativeSubmitStageStatus.Stage = "cancelled";
                        }
                        break;

                    case "VP":
                        if (initiativeSubmitStageStatus.Status == "forward")
                        {
                            initiativeSubmitStageStatus.Status = "wait for approval";
                            initiativeSubmitStageStatus.Stage = "VP";
                        }
                        else if (initiativeSubmitStageStatus.Status == "backward")
                        {
                            initiativeSubmitStageStatus.Status = "draft";
                            initiativeSubmitStageStatus.Stage = "DM";
                        }
                        else if (initiativeSubmitStageStatus.Status == "cancelled")
                        {
                            initiativeSubmitStageStatus.Status = "cancelled";
                            initiativeSubmitStageStatus.Stage = "cancelled";
                        }
                        break;

                    case "EVP/MD/SEVP/COE/PSD/CEO":
                        if (initiativeSubmitStageStatus.Status == "forward")
                        {
                            initiativeSubmitStageStatus.Status = "wait for approval";
                            initiativeSubmitStageStatus.Stage = "EVP/MD/SEVP/COE/PSD/CEO";
                        }
                        else if (initiativeSubmitStageStatus.Status == "backward")
                        {
                            initiativeSubmitStageStatus.Status = "draft";
                            initiativeSubmitStageStatus.Stage = "VP";
                        }
                        else if (initiativeSubmitStageStatus.Status == "cancelled")
                        {
                            initiativeSubmitStageStatus.Status = "cancelled";
                            initiativeSubmitStageStatus.Stage = "cancelled";
                        }
                        break;

                    case "Budget Team":
                        if (initiativeSubmitStageStatus.Status == "forward")
                        {
                            initiativeSubmitStageStatus.Status = "wait for review";
                            initiativeSubmitStageStatus.Stage = "Budget Team";
                        }
                        else if (initiativeSubmitStageStatus.Status == "backward")
                        {
                            initiativeSubmitStageStatus.Status = "draft";
                            initiativeSubmitStageStatus.Stage = "EVP/MD/SEVP/COE/PSD/CEO";
                        }
                        else if (initiativeSubmitStageStatus.Status == "cancelled")
                        {
                            initiativeSubmitStageStatus.Status = "cancelled";
                            initiativeSubmitStageStatus.Stage = "cancelled";
                        }
                        break;

                    case "BOD":
                        if (initiativeSubmitStageStatus.Status == "forward")
                        {
                            initiativeSubmitStageStatus.Status = "wait for approval";
                            initiativeSubmitStageStatus.Stage = "BOD";
                        }
                        else if (initiativeSubmitStageStatus.Status == "backward")
                        {
                            initiativeSubmitStageStatus.Status = "draft";
                            initiativeSubmitStageStatus.Stage = "Budget Team";
                        }
                        else if (initiativeSubmitStageStatus.Status == "cancelled")
                        {
                            initiativeSubmitStageStatus.Status = "cancelled";
                            initiativeSubmitStageStatus.Stage = "cancelled";
                        }
                        break;

                    case "App. Request":
                        if (initiativeSubmitStageStatus.Status == "forward")
                        {
                            initiativeSubmitStageStatus.Status = "wait for create App.";
                            initiativeSubmitStageStatus.Stage = "App. Request";
                        }
                        else if (initiativeSubmitStageStatus.Status == "backward")
                        {
                            initiativeSubmitStageStatus.Status = "draft";
                            initiativeSubmitStageStatus.Stage = "BOD";
                        }
                        else if (initiativeSubmitStageStatus.Status == "cancelled")
                        {
                            initiativeSubmitStageStatus.Status = "cancelled";
                            initiativeSubmitStageStatus.Stage = "cancelled";
                        }
                        break;

                    case "WBS Request":
                        if (initiativeSubmitStageStatus.Status == "forward")
                        {
                            initiativeSubmitStageStatus.Status = "wait for create WBS";
                            initiativeSubmitStageStatus.Stage = "WBS Request";
                        }
                        else if (initiativeSubmitStageStatus.Status == "backward")
                        {
                            initiativeSubmitStageStatus.Status = "draft";
                            initiativeSubmitStageStatus.Stage = "App. Request";
                        }
                        else if (initiativeSubmitStageStatus.Status == "cancelled")
                        {
                            initiativeSubmitStageStatus.Status = "cancelled";
                            initiativeSubmitStageStatus.Stage = "cancelled";
                        }
                        break;

                    case "Budget Distribute":
                        if (initiativeSubmitStageStatus.Status == "forward")
                        {
                            initiativeSubmitStageStatus.Status = "wait for approval";
                            initiativeSubmitStageStatus.Stage = "Budget Distribute";
                        }
                        else if (initiativeSubmitStageStatus.Status == "backward")
                        {
                            initiativeSubmitStageStatus.Status = "draft";
                            initiativeSubmitStageStatus.Stage = "Budget Distribute";
                        }
                        else if (initiativeSubmitStageStatus.Status == "cancelled")
                        {
                            initiativeSubmitStageStatus.Status = "cancelled";
                            initiativeSubmitStageStatus.Stage = "cancelled";
                        }
                        break;


                    case "IL0":
                        if (initiativeSubmitStageStatus.Status == "forward")
                        {
                            initiativeSubmitStageStatus.Status = "wait for approval";
                            initiativeSubmitStageStatus.Stage = "SIL1";
                        }
                        else if (initiativeSubmitStageStatus.Status == "backward")
                        {
                            initiativeSubmitStageStatus.Status = "draft";
                            initiativeSubmitStageStatus.Stage = "draft";
                        }
                        else if (initiativeSubmitStageStatus.Status == "cancelled")
                        {
                            initiativeSubmitStageStatus.Status = "wait for cancellation";
                            initiativeSubmitStageStatus.Stage = initiative.Stage;
                        }
                        break;

                    case "SIL1":
                        if (initiativeSubmitStageStatus.Status == "backward")
                        {
                            initiativeSubmitStageStatus.Status = "draft";
                            initiativeSubmitStageStatus.Stage = "IL0";
                        }
                        else if (initiativeSubmitStageStatus.Status == "cancelled")
                        {
                            initiativeSubmitStageStatus.Status = "wait for cancellation";
                            initiativeSubmitStageStatus.Stage = initiative.Stage;
                        }
                        break;
                    case "IL1":
                        if (initiativeSubmitStageStatus.Status == "forward")
                        {
                            initiativeSubmitStageStatus.Status = "wait for approval";
                            initiativeSubmitStageStatus.Stage = "SIL2";
                        }
                        else if (initiativeSubmitStageStatus.Status == "backward")
                        {
                            initiativeSubmitStageStatus.Status = "draft";
                            initiativeSubmitStageStatus.Stage = "IL0";
                        }
                        else if (initiativeSubmitStageStatus.Status == "cancelled")
                        {
                            initiativeSubmitStageStatus.Status = "wait for cancellation";
                            initiativeSubmitStageStatus.Stage = initiative.Stage;
                        }
                        break;

                    case "SIL2":
                        if (initiativeSubmitStageStatus.Status == "backward")
                        {
                            initiativeSubmitStageStatus.Status = "draft";
                            initiativeSubmitStageStatus.Stage = "IL1";
                        }
                        else if (initiativeSubmitStageStatus.Status == "cancelled")
                        {
                            initiativeSubmitStageStatus.Status = "wait for cancellation";
                            initiativeSubmitStageStatus.Stage = initiative.Stage;
                        }
                        break;
                    case "IL2":
                        if (initiativeSubmitStageStatus.Status == "forward")
                        {
                            initiativeSubmitStageStatus.Status = "wait for approval";
                            initiativeSubmitStageStatus.Stage = "SIL3";
                        }
                        else if (initiativeSubmitStageStatus.Status == "backward")
                        {
                            initiativeSubmitStageStatus.Status = "draft";
                            initiativeSubmitStageStatus.Stage = "IL1";
                        }
                        else if (initiativeSubmitStageStatus.Status == "cancelled")
                        {
                            initiativeSubmitStageStatus.Status = "wait for cancellation";
                            initiativeSubmitStageStatus.Stage = initiative.Stage;
                        }
                        break;

                    case "SIL3":
                        if (initiativeSubmitStageStatus.Status == "backward")
                        {
                            initiativeSubmitStageStatus.Status = "draft";
                            initiativeSubmitStageStatus.Stage = "IL2";
                        }
                        else if (initiativeSubmitStageStatus.Status == "cancelled")
                        {
                            initiativeSubmitStageStatus.Status = "wait for cancellation";
                            initiativeSubmitStageStatus.Stage = initiative.Stage;
                        }
                        break;
                    case "IL3":
                        if (initiativeSubmitStageStatus.Status == "forward")
                        {
                            initiativeSubmitStageStatus.Status = "wait for approval";
                            initiativeSubmitStageStatus.Stage = "SIL4";
                        }
                        else if (initiativeSubmitStageStatus.Status == "backward")
                        {
                            initiativeSubmitStageStatus.Status = "draft";
                            initiativeSubmitStageStatus.Stage = "IL2";
                        }
                        else if (initiativeSubmitStageStatus.Status == "cancelled")
                        {
                            initiativeSubmitStageStatus.Status = "wait for cancellation";
                            initiativeSubmitStageStatus.Stage = initiative.Stage;
                        }
                        break;

                    case "SIL4":
                        if (initiativeSubmitStageStatus.Status == "backward")
                        {
                            initiativeSubmitStageStatus.Status = "draft";
                            initiativeSubmitStageStatus.Stage = "IL3";
                        }
                        else if (initiativeSubmitStageStatus.Status == "cancelled")
                        {
                            initiativeSubmitStageStatus.Status = "wait for cancellation";
                            initiativeSubmitStageStatus.Stage = initiative.Stage;
                        }
                        break;

                    case "IL4":
                        if (initiativeSubmitStageStatus.Status == "forward")
                        {
                            initiativeSubmitStageStatus.Status = "wait for approval";
                            initiativeSubmitStageStatus.Stage = "SIL5";
                        }
                        else if (initiativeSubmitStageStatus.Status == "backward")
                        {
                            initiativeSubmitStageStatus.Status = "draft";
                            initiativeSubmitStageStatus.Stage = "IL3";
                        }
                        else if (initiativeSubmitStageStatus.Status == "cancelled")
                        {
                            initiativeSubmitStageStatus.Status = "wait for cancellation";
                            initiativeSubmitStageStatus.Stage = initiative.Stage;
                        }
                        break;

                    case "SIL5":
                        if (initiativeSubmitStageStatus.Status == "backward")
                        {
                            initiativeSubmitStageStatus.Status = "draft";
                            initiativeSubmitStageStatus.Stage = "IL4";
                        }
                        else if (initiativeSubmitStageStatus.Status == "cancelled")
                        {
                            initiativeSubmitStageStatus.Status = "wait for cancellation";
                            initiativeSubmitStageStatus.Stage = initiative.Stage;
                        }
                        break;
                    case "IL5":
                        if (initiativeSubmitStageStatus.Status == "backward")
                        {
                            initiativeSubmitStageStatus.Status = "draft";
                            initiativeSubmitStageStatus.Stage = "IL4";
                        }
                        else if (initiativeSubmitStageStatus.Status == "cancelled")
                        {
                            initiativeSubmitStageStatus.Status = "wait for cancellation";
                            initiativeSubmitStageStatus.Stage = initiative.Stage;
                        }
                        break;
                    default:
                        if (InitiativeTypeCapex.Contains(initiative.InitiativeType))
                        {
                            initiativeSubmitStageStatus.Status = "wait for approval";
                            initiativeSubmitStageStatus.Stage = "DM";
                        }
                        else if (initiativeTypeDIM.Contains(initiative.InitiativeType))
                        {
                            initiativeSubmitStageStatus.Status = "wait for approval";
                            initiativeSubmitStageStatus.Stage = "DM";
                        }
                        else
                        {
                            initiativeSubmitStageStatus.Status = "admin check";
                            initiativeSubmitStageStatus.Stage = "waiting";
                        }

                        await _repository.CreateStagesTracking(initiative);

                        //initiativeSubmitStageStatus.Status = "admin check";
                        //initiativeSubmitStageStatus.Stage = "waiting";
                        break;
                }
            }


            //create All Stage Statuses
            if (initiativeSubmitStageStatus.Stage != null || initiativeSubmitStageStatus.Status == "cancelled" || initiativeSubmitStageStatus.Status == "wait for cancellation")
            {

                await _repository.UpdateStagesTracking_OnSubmit(initiative, initiativeSubmitStageStatus, statusDirection);

                var SubmitStageStatus = _mapper.Map(initiativeSubmitStageStatus, initiative);
                DateTime dateTime = DateTime.Now;

                if (new string[] { "SIL4", "SIL5" }.Contains(initiativeSubmitStageStatus.Stage))
                { //Date @ change stage to IL4 , IL5
                    await _repository.UpdateLastestSubmittedSIL(id, initiativeSubmitStageStatus.Stage, dateTime);
                }
                SubmitStageStatus.LastSubmittedDate = dateTime;
                // _repository.Update(SubmitStageStatus);
                await _repository.Save();
                await _repository.SetActionBy(initiative.Id, initiativeSubmitStageStatus.Username, initiativeSubmitStageStatus.Status, initiativeSubmitStageStatus.Stage);
                await _repository.ChangeApproverStatusTrackingFromSetActionBy(initiative);

                string[] allStatusesForApproval = { "wait for review", "wait for create App.", "wait for create WBS", "wait for approval", "admin check" };
                if (allStatusesForApproval.Contains(initiativeSubmitStageStatus.Status))
                {
                    // send to microsoft flow if stage need approve
                    await _repository.CallMicrosoftFlow_SendMail(id, "approve");  // case 1 - send mail to approvers
                }
                else if (initiativeSubmitStageStatus.Status == "wait for cancellation")
                {
                    await _repository.CallMicrosoftFlow_SendMail(id, "wait for cancellation"); // case 7 - send mail to to team
                }


            }

            return NoContent();
        }

        [HttpPost("CheckApprove/{id}")]
        public async Task<IActionResult> CheckApprove(int id, CheckApprove CheckApprove)
        {
            var approve = await _repository.CheckApprove(id, CheckApprove.ActionBy);
            return Ok(approve);
        }

        [HttpPost("CheckSubmitTo")]
        public bool CheckSubmitTo(CheckSubmitTo CheckSubmitTo)
        {
            string[] status = { "wait for submission", "revised", "draft", "approved", "wait for review", "wait for create App.", "wait for create WBS" };
            string[] stage = { "IL0", "IL1", "IL2", "IL3", "IL4", "IL5", "DM", "VP", "EVP/MD/SEVP/COE/PSD/CEO", "Budget Team", "BOD", "App. Request", "WBS Request" };
            if (status.Contains(CheckSubmitTo.Status) && stage.Contains(CheckSubmitTo.Stage)) return true;
            return false;
        }

        [HttpPost("CheckSubmitToInformation")]
        public bool CheckSubmitToInformation(CheckSubmitTo CheckSubmitTo)
        {
            string[] status = { "wait for approval", "wait for review", "wait for create App.", "wait for create WBS" };
            if (status.Contains(CheckSubmitTo.Status)) return true;
            return false;
        }

        [HttpPost("CheckApproveInformation")]
        public bool CheckApproveInformation(CheckSubmitTo CheckSubmitTo)
        {
            string[] status = { "wait for approval", "revised", "draft", "wait for submission", "approved", "wait for review", "wait for create App.", "wait for create WBS", "wait for cancellation" };
            string[] stage  = { "SIL1", "SIL2", "SIL3", "SIL4", "SIL5", "IL0", "IL1", "IL2", "IL3", "IL4", "IL5", "DM", "VP", "EVP/MD/SEVP/COE/PSD/CEO", "Budget Team", "BOD", "App. Request", "WBS Request" };
            if (status.Contains(CheckSubmitTo.Status) && stage.Contains(CheckSubmitTo.Stage)) return true;
            return false;
        }

        [HttpPost("CheckInitiativeDetail")]
        public bool CheckInitiativeDetail(CheckSubmitTo CheckSubmitTo)
        {
            string[] status = { "draft", "wait for submission", "revised", "rejected", "wait for approval", "approved", "cancelled", "reject", "wait for review", "wait for create App.", "wait for create WBS", "wait for cancellation" };
            string[] stage = { "draft", "reject", "cancelled", "IL0", "IL1", "IL2", "IL3", "IL4", "IL5", "SIL1", "SIL2", "SIL3", "SIL4", "SIL5", "DM", "VP", "EVP/MD/SEVP/COE/PSD/CEO", "Budget Team", "BOD", "App. Request", "WBS Request" };
            if (status.Contains(CheckSubmitTo.Status) && stage.Contains(CheckSubmitTo.Stage)) return true;
            return false;
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetInitiative(int id)
        {
            var initiativesData = await _repository.GetInitiative(id);
            var initiative = _mapper.Map<InitiativeGeneral>(initiativesData);
            return Ok(initiative);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteInitiative(int id)
        {
            var initiative = await _repository.GetInitiative(id);
            initiative.Status = "cancelled";
            initiative.Stage = "cancelled";
            _repository.Update(initiative);
            await _repository.Save();
            return NoContent();
        }

        [HttpGet("getUserCompany/{email}")]
        public async Task<IActionResult> GetUserCompany(string email)
        {
            var getUserCompany = await _repository.GetUserCompany(email);
            return Ok(new { company = getUserCompany });
        }

        [HttpGet("last")]
        public async Task<IActionResult> GetLastInitiative()
        {
            int id = await _repository.LastIdInitiative();
            return Ok(id);
        }

        [HttpGet("SuggestStatus/{id}")]
        public async Task<IActionResult> InitiativeSuggestStatus(int id)
        {
            var initiativesData = await _repository.GetInitiative(id);
            var initiative = _mapper.Map<InitiativeSuggestStatus>(initiativesData);
            return Ok(initiative);
        }

        [HttpGet("Information/{id}")]
        public async Task<IActionResult> InitiativeInformation(int id)
        {
            var initiativesData = await _repository.GetInitiative(id);
            var initiative = _mapper.Map<InitiativeInformation>(initiativesData);
            return Ok(initiative);
        }

        [HttpGet("Detail/{id}")]
        public async Task<IActionResult> GetInitiativeDetail(int id)
        {
            var initiativesData = await _repository.GetInitiative(id);
            var initiative = _mapper.Map<InitiativeProgress>(initiativesData);
            return Ok(initiative);
        }

        [HttpPost("MyTask/InProgress")]
        public async Task<IActionResult> MyTaskInProgress(MyInitiative MyInitiative)
        {
            return Ok(await _repository.MyTaskInProgress(MyInitiative));
        }

        [HttpPost("MyTask/NotStarted")]
        public async Task<IActionResult> MyTaskNotStarted(MyInitiative MyInitiative)
        {
            return Ok(await _repository.MyTaskNotStarted(MyInitiative));
        }

        [HttpPost("MyInitiative/Draft")]
        public async Task<IActionResult> MyInitiativeDraft(MyInitiative MyInitiative)
        {
           return Ok(await _repository.MyInitiativeDraft(MyInitiative));
        }

        [HttpPost("MyInitiative/InProgress")]
        public async Task<IActionResult> MyInitiativeInProgress(MyInitiative MyInitiative)
        {
            return Ok(await _repository.MyInitiativeInProgress(MyInitiative));
        }

        [HttpPost("MyInitiative/Completed")]
        public async Task<IActionResult> MyInitiativeCompleted(MyInitiative MyInitiative)
        {
            return Ok(await _repository.MyInitiativeCompleted(MyInitiative));
        }

        [HttpPost("MyInitiative/Canceled")]
        public async Task<IActionResult> MyInitiativeCanceled(MyInitiative MyInitiative)
        {
            return Ok(await _repository.MyInitiativeCanceled(MyInitiative));
        }

        [HttpPost("Detail/{id}")]
        public async Task<IActionResult> CreateInitiativeDetail(int id, InitiativeCreateDetail initiativeCreateDetail)
        {
            // await _repository.InitiativeDetailDelete(id);
            initiativeCreateDetail.InitiativeId = id;
            var CreateDetail = _mapper.Map<InitiativeDetail>(initiativeCreateDetail);
            _repository.Add(CreateDetail);
            await _repository.Save();
            return Ok(CreateDetail);
        }

        [HttpPut("Detail/{id}")]
        public async Task<IActionResult> UpdateInitiativeDetail(int id, InitiativeCreateDetail initiativeUpdateDetail)
        {
            initiativeUpdateDetail.InitiativeId = id;
            var UpdateDetail = _mapper.Map<InitiativeDetail>(initiativeUpdateDetail);
            _repository.Update(UpdateDetail);
            await _repository.Save();
            return Ok(UpdateDetail);
        }

        [HttpPost("CoDeveloper/{id}")]
        public async Task<ActionResult<Initiative>> CreateInitiativeCoDeveloper(int id, [FromBody]string[] coDevelopers)
        {
            var coDeveloper = await _repository.InitiativeCoDeveloperCreate(id, coDevelopers);
            return Ok(coDevelopers);
        }

        [HttpPut("CoDeveloper/{id}")]
        public async Task<ActionResult<Initiative>> UpdateInitiativeCoDeveloper(int id, [FromBody]string[] coDevelopers)
        {
            await _repository.InitiativeCoDeveloperDelete(id);
            await _repository.InitiativeCoDeveloperCreate(id, coDevelopers);
            return NoContent();
        }

        [HttpDelete("CoDeveloper/{id}")]
        public async Task<ActionResult<Initiative>> DeleteInitiativeCoDeveloper(int id)
        {
            await _repository.InitiativeCoDeveloperDelete(id);
            return NoContent();
        }

        [HttpGet("Attachment/{id}")]
        public async Task<IActionResult> GetInitiativeAttachment(int id)
        {
            var initiativesData = await _repository.GetInitiative(id);
            var initiative = _mapper.Map<InitiativeAttachment>(initiativesData);
            return Ok(initiative);
        }

        [HttpPost("Attachment/{id}")]
        public async Task<ActionResult> CreateAttachment(int id, [FromForm]InitiativeCreateAttachment initiative)
        {
            var initiativesData = await _repository.GetInitiative(id);
            var containerCode = _mapper.Map<InitiativeGeneral>(initiativesData).InitiativeCode.ToString();
            // containerCode = containerCode.Substring(0, 6) + "-" + containerCode.Substring(7, 4);
            if (containerCode.Substring(6, 1) == "/")
            {
                containerCode = containerCode.Substring(0, 6) + "-" + containerCode.Substring(7, 4);
            }
            if (initiative.File.Length > 0)
            {
                var attachment = await _repository.InitiativeAttachmentCreate(id, initiative);
                var getAttachment = await _repository.GetAttachment(id);
                await UploadToBlob(_blobConfig.Value.PrefixContainer + containerCode, attachment.FileName, null, initiative.File.OpenReadStream());  //upload to Blob
                return Ok(attachment);
            }
            return NoContent();
        }

        [HttpDelete("Attachment/{id}")]
        public async Task<ActionResult> DeleteAttachment(int id)
        {
            var attachment = await _repository.GetAttachment(id);
            _repository.Delete(attachment);
            await _repository.Save();
            var initiativesData = await _repository.GetInitiative(attachment.InitiativeId);
            var containerCode = _mapper.Map<InitiativeGeneral>(initiativesData).InitiativeCode.ToString();
            if (containerCode.Substring(6, 1) == "/")
            {
                containerCode = containerCode.Substring(0, 6) + "-" + containerCode.Substring(7, 4);
            }
            try
            {
                if (CloudStorageAccount.TryParse(_blobConfig.Value.StorageConnection, out CloudStorageAccount storageAccount))
                {
                    CloudBlobClient BlobClient = storageAccount.CreateCloudBlobClient();
                    CloudBlobContainer container = BlobClient.GetContainerReference(_blobConfig.Value.PrefixContainer + containerCode);
                    if (await container.ExistsAsync())
                    {
                        CloudBlob file = container.GetBlobReference(attachment.FileName);  //File Name

                        if (await file.ExistsAsync())
                        {
                            await file.DeleteAsync();
                        }
                    }
                }
            }
            catch { }
            return Ok();
        }

        [HttpPost("Product/{id}")]
        public async Task<ActionResult> CreateInitiativeProduct(int id, InitiativeCreateProduct initiativeCreateProduct)
        {
            var ProductsData = await _repository.CreateInitiativeProduct(id, initiativeCreateProduct);
            return StatusCode(201);
        }

        [HttpPost("Milestone/{id}")]
        public async Task<ActionResult> CreateInitiativeMilestone(int id, InitiativeCreateMilestone initiativeCreateMilestone)
        {
            var Milestones = await _repository.CreateInitiativeMilestone(id, initiativeCreateMilestone);
            return Ok(Milestones);
        }

        [HttpPost("FinancialIndicator/{id}")]
        public async Task<ActionResult> CreateFinancialIndicator(int id, InitiativeCreateFinancialIndicator initiativeFinancialIndicator)
        {
            var FinancialIndicator = await _repository.CreateFinancialIndicator(id, initiativeFinancialIndicator);
            return Ok(FinancialIndicator);
        }

        [HttpPost("Financial/{id}")]
        public async Task<ActionResult> CreateFinancial(int id, InitiativeCreateFinancial initiativeCreateFinancial)
        {
            await _repository.InitiativeFinancialDelete(id);
            initiativeCreateFinancial.InitiativeId = id;
            var CreateFinancial = _mapper.Map<Financial>(initiativeCreateFinancial);
            _repository.Add(CreateFinancial);
            await _repository.Save();
            return Ok(CreateFinancial);
        }

        [HttpGet("KpiDetail/{id}")]
        public async Task<IActionResult> GetKpiDetail(int id)
        {
            var initiativesData = await _repository.GetInitiative(id);
            var initiative = _mapper.Map<InitiativeKpi>(initiativesData);
            return Ok(initiative);
        }

        [HttpGet("ShareBenefitWorkstream/{id}")]
        public async Task<IActionResult> GetShareBenefitWorkstream(int id)
        {
            var initiativesData = await _repository.GetInitiative(id);
            var initiative = _mapper.Map<InitiativeShareBenefitWorkstream>(initiativesData);
            return Ok(initiative);
        }

        [HttpGet("DetailMaxInformation/{id}")]
        public async Task<IActionResult> DetailMaxInformation(int id)
        {
            var initiativesData = await _repository.GetInitiative(id);
            var initiative = _mapper.Map<InitiativeDetailMax>(initiativesData);
            return Ok(initiative);
        }

        [HttpGet("ProgressAndMilestone/{id}")]
        public async Task<IActionResult> ProgressAndMilestone(int id)
        {
            var initiativesData = await _repository.GetInitiative(id);
            var initiative = _mapper.Map<InitiativeProgressAndMilestone>(initiativesData);
            return Ok(initiative);
        }

        [HttpPost("ImpactExcel")]
        public async Task<ActionResult> ImpactExcel([FromForm]ImpactExcel impact)
        {
            await UploadToBlob("00-impacts-to-update", "impactExcel.xlsx");
            await UploadToBlob("00-impacts-to-update", "impactExcel.xlsx", null, impact.File.OpenReadStream());
            return Ok(impact);
        }

        [HttpGet("DownloadImpactExcel")]
        public async Task<IActionResult> DownloadFromBlob()
        {
            MemoryStream ms = new MemoryStream();
            if (CloudStorageAccount.TryParse(_blobConfig.Value.StorageConnection, out CloudStorageAccount storageAccount))
            {
                CloudBlobClient BlobClient = storageAccount.CreateCloudBlobClient();
                CloudBlobContainer container = BlobClient.GetContainerReference("00-impacts-to-update");

                if (await container.ExistsAsync())
                {
                    CloudBlob file = container.GetBlobReference("impactExcel.xlsx");
                    if (await file.ExistsAsync())
                    {
                        await file.DownloadToStreamAsync(ms);
                        Stream blobStream = file.OpenReadAsync().Result;
                        return File(blobStream, file.Properties.ContentType, file.Name);
                    }
                    else
                    {
                        return Content("File does not exist");
                    }
                }
                else
                {
                    return Content("Container does not exist");
                }
            }
            else
            {
                return Content("Error opening storage");
            }
        }

        [HttpGet("DownloadBlob/{id}/{fileName}")]
        public async Task<IActionResult> DownloadFromBlob(int id, string fileName)
        {
            var initiativesData = await _repository.GetInitiative(id);
            var containerCode = _mapper.Map<InitiativeGeneral>(initiativesData).InitiativeCode.ToString();
            // containerCode = containerCode.Substring(0, 6) + "-" + containerCode.Substring(7, 4);
            if (containerCode.Substring(6, 1) == "/")
            {
                containerCode = containerCode.Substring(0, 6) + "-" + containerCode.Substring(7, 4);
            }
            MemoryStream ms = new MemoryStream();
            if (CloudStorageAccount.TryParse(_blobConfig.Value.StorageConnection, out CloudStorageAccount storageAccount))
            {
                CloudBlobClient BlobClient = storageAccount.CreateCloudBlobClient();
                CloudBlobContainer container = BlobClient.GetContainerReference(_blobConfig.Value.PrefixContainer + containerCode);

                if (await container.ExistsAsync())
                {
                    CloudBlob file = container.GetBlobReference(fileName);
                    if (await file.ExistsAsync())
                    {
                        await file.DownloadToStreamAsync(ms);
                        Stream blobStream = file.OpenReadAsync().Result;
                        return File(blobStream, file.Properties.ContentType, file.Name);
                    }
                    else
                    {
                        return Content("File does not exist");
                    }
                }
                else
                {
                    return Content("Container does not exist");
                }
            }
            else
            {
                return Content("Error opening storage");
            }
        }
        private async Task<(bool, string)> UploadToBlob(string container, string filename, byte[] imageBuffer = null, Stream stream = null)
        {
            CloudStorageAccount storageAccount = null;
            CloudBlobContainer cloudBlobContainer = null;
            if (CloudStorageAccount.TryParse(_blobConfig.Value.StorageConnection, out storageAccount))
            {
                try
                {
                    CloudBlobClient cloudBlobClient = storageAccount.CreateCloudBlobClient();
                    cloudBlobContainer = cloudBlobClient.GetContainerReference(container);
                    await cloudBlobContainer.CreateIfNotExistsAsync();
                    BlobContainerPermissions permissions = new BlobContainerPermissions
                    {
                        PublicAccess = BlobContainerPublicAccessType.Blob
                    };
                    await cloudBlobContainer.SetPermissionsAsync(permissions);

                    CloudBlockBlob cloudBlockBlob = cloudBlobContainer.GetBlockBlobReference(filename);

                    if (imageBuffer != null)
                    {
                        await cloudBlockBlob.UploadFromByteArrayAsync(imageBuffer, 0, imageBuffer.Length);
                    }
                    else if (stream != null)
                    {
                        await cloudBlockBlob.UploadFromStreamAsync(stream);
                    }
                    else
                    {
                        return (false, null);
                    }

                    return (true, cloudBlockBlob.SnapshotQualifiedStorageUri.PrimaryUri.ToString());
                }
                catch (StorageException)
                {
                    return (false, null);
                }
                finally
                {
                    // OPTIONAL: Clean up resources, e.g. blob container
                    //if (cloudBlobContainer != null)
                    //{
                    //    await cloudBlobContainer.DeleteIfExistsAsync();
                    //}
                }
            }
            else
            {
                return (false, null);
            }

        }

        [HttpGet("getLastestUpdate/{id}")]
        public async Task<IActionResult> GetLastestUpdate(int id)
        {
            var initiativesData = await _repository.GetLastestUpdate(id);
            return Ok(initiativesData);
        }



    }
}