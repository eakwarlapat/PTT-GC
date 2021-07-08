using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PTT_GC_API.Data.Interface;
using PTT_GC_API.Dtos.Initiative;
using PTT_GC_API.Models.Initiative;
using PTT_GC_API.Models.User;
using System;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using PTT_GC_API.API.Helpers;
using PTT_GC_API.Helpers;
using NPOI.SS.Formula.Functions;
using System.Net.Http;
using Newtonsoft.Json;
using System.Text;
using DocumentFormat.OpenXml.Office2010.Excel;
using System.Collections.Immutable;

namespace PTT_GC_API.Data.Repository
{
    public class InitiativeRepository : InitiativeInterface
    {
        private readonly DataContext _context;
        private readonly IHttpClientFactory _clientFactory;
        //dev
        // string Admin_01 = "z0007142@vpttgcgroup.corp";
        // string Approver_01 = "z0007155@vpttgcgroup.corp";
        // string Approver_02 = "z0007141@vpttgcgroup.corp";
        // string Approver_03 = "z0007142@vpttgcgroup.corp";
        // string Approver_04 = "z0007193@vpttgcgroup.corp";

        //qa
        //string Admin_01 = "Pongchayont.s@pttgcgroup.com";
        //string Approver_01 = "Pongchayont.s@pttgcgroup.com";
        //string Approver_02 = "Kewalin.k@pttgcgroup.com";
        //string Approver_03 = "Chakrid.N@pttgcgroup.com";
        //string Approver_04 = "Sawarin.P@pttgcgroup.com";

        public InitiativeRepository(DataContext context, IHttpClientFactory clientFactory)
        {
            _context = context;
            _clientFactory = clientFactory;
        }

        public async void Add<T>(T entity) where T : class
        {
            await _context.AddAsync(entity);
        }

        public void Update<T>(T entity) where T : class
        {
            _context.Update(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }

        public async Task<bool> Save()
        {
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> Any()
        {
            return await _context.Initiatives.AnyAsync();
        }

        public async Task<Initiative> GetInitiative(int id)
        {
            var initiative = await _context.Initiatives.FirstOrDefaultAsync(i => i.Id == id);
            return initiative;
        }

        public async Task<int> LastIdInitiative()
        {
            int id;
            if (_context.Initiatives.Any())
            {
                var max = await _context.Initiatives.OrderByDescending(p => p.Id).FirstOrDefaultAsync();
                id = max.Id;
            }
            else
            {
                id = 0;
            }
            return id;
        }

        public async Task<Initiative> LastInitiative()
        {
            var initiative = await _context.Initiatives.OrderByDescending(p => p.Id).FirstOrDefaultAsync();
            return initiative;
        }


        public async Task<PagedList<Initiative>> GetInitiatives(InitiativeParams initiativeParams)
        {
            var initiatives = _context.Initiatives.AsQueryable();

            switch (initiativeParams.Page)
            {
                case "myTask":
                    initiatives = initiatives.Where(i => i.InitiativeActions.Any(i => i.ActionBy == initiativeParams.Username.Trim().ToLower()));
                    initiatives = initiatives.OrderByDescending(i => i.UpdatedDate);
                    break;
                case "myOwn":
                    initiatives = initiatives.Where(i => i.CreatedBy == initiativeParams.Username.Trim() || i.OwnerName == initiativeParams.MyOwner)
                    .OrderByDescending(i => i.CreatedDate);
                    //---------- max - TO for Temporary -------------------------------------------------------------------------------
                    var userId = (from a in _context.UserManagements.AsQueryable()
                                  where a.Email == initiativeParams.Username
                                  select a.Id).FirstOrDefault();
                    var userRole = (from a in _context.UserRoles.AsQueryable()
                                    where a.UserId == userId
                                    select a.RoleId).ToList();
                    // Get Role MAX
                    var roleMAX = (from a in _context.RoleManagements.AsQueryable()
                                where userRole.Contains(a.RoleId) && a.SectionId == "S00001"
                                select a.SectionId).Count();

                    if (roleMAX > 0)
                    {
                        //initiatives = initiatives.Union(_context.Initiatives.AsQueryable().Where(i =>
                        //(i.Stage == "IL0" || i.Stage == "IL1" || i.Stage == "IL2" || i.Stage == "IL3" || i.Stage == "IL4" || i.Stage == "IL5")
                        //)).OrderByDescending(i => i.CreatedDate);
                    }
                    //--------------------------------------------------------------------------------------------------------
                    if (userId > 0)
                    {
                        // Get User-Workstream
                        var userWorkstream = (from a in _context.UserWorkstreams.AsQueryable()
                                              where a.UserId == userId
                                              select a.WorkstreamTitle).ToList();

                        if (userWorkstream.Count() > 0)
                        {
                            // Get Workstream from Table:DetailInformation
                            var detailWorkstream = (from a in _context.DetailInformations.AsQueryable()
                                                    where userWorkstream.Contains(a.Workstream)
                                                    select a.InitiativeId).ToList();

                            if (detailWorkstream.Count() > 0)
                            {
                                if (roleMAX > 0)
                                {
                                    // Get Max only and in Workstream from Detail !!!
                                    initiatives = initiatives.Union(_context.Initiatives.AsQueryable().Where(i =>
                                    (i.Stage == "IL0" || i.Stage == "IL1" || i.Stage == "IL2"
                                    || i.Stage == "IL3" || i.Stage == "IL4" || i.Stage == "IL5")
                                    && detailWorkstream.Contains(i.Id)
                                    )).OrderByDescending(i => i.CreatedDate);

                                    // initiatives = initiatives.Where(i => !detailWorkstream.Contains(i.Id))
                                    //.Union(_context.Initiatives.AsQueryable().Where(i => detailWorkstream.Contains(i.Id)).OrderByDescending(i => i.CreatedDate)).OrderByDescending(i => i.CreatedDate);
                                }
                                else
                                {
                                    // initiatives = initiatives.Union(_context.Initiatives.AsQueryable().Where(i => detailWorkstream.Contains(i.Id))).OrderByDescending(i => i.CreatedDate);
                                }
                            }
                        }
                    }
                    //------------------------------------------------------------------------------------------------------------------

                    break;
                case "overview":
                    initiatives = initiatives.OrderByDescending(i => i.Id);
                    break;
                default:
                    initiatives = initiatives.OrderByDescending(i => i.CreatedDate);
                    break;
            }

            if (!string.IsNullOrEmpty(initiativeParams.Text))
            {
                initiatives = initiatives.Where(i =>
                    i.InitiativeCode.Contains(initiativeParams.Text.Trim()) ||
                    i.Name.Contains(initiativeParams.Text.Trim()) ||
                    i.OwnerName.Contains(initiativeParams.Text.Trim()) ||
                    i.RegisteringDate.ToString().Contains(initiativeParams.Text.Trim()) ||
                    i.Organization.Contains(initiativeParams.Text.Trim()) ||
                    i.Status.Contains(initiativeParams.Text.Trim()) ||
                    i.InitiativeType.Contains(initiativeParams.Text.Trim().ToLower())
                );
            }

            if (!string.IsNullOrEmpty(initiativeParams.Id))
            {
                initiatives = initiatives.Where(i => i.InitiativeCode.Contains(initiativeParams.Id.Trim()));
            }

            if (!string.IsNullOrEmpty(initiativeParams.Name))
            {
                initiatives = initiatives.Where(i => i.Name.Contains(initiativeParams.Name.Trim()));
            }

            if (!string.IsNullOrEmpty(initiativeParams.Status))
            {
                initiatives = initiatives.Where(i => i.Status == initiativeParams.Status);
            }

            if (!string.IsNullOrEmpty(initiativeParams.Type))
            {
                switch (initiativeParams.Type)
                {
                    case "cim":
                        initiatives = initiatives.Where(i => i.Cim == true);
                        break;
                    case "pim":
                        initiatives = initiatives.Where(i => i.Pim == true);
                        break;
                    case "dim":
                        initiatives = initiatives.Where(i => i.Dim == true);
                        break;
                    case "cpi":
                        initiatives = initiatives.Where(i => i.Cpi == true);
                        break;
                    case "directCapex":
                        initiatives = initiatives.Where(i => i.DirectCapex == true);
                        break;
                    case "strategy":
                        initiatives = initiatives.Where(i => i.Strategy == true);
                        break;
                    case "randD":
                        initiatives = initiatives.Where(i => i.RandD == true);
                        break;
                    case "max":
                        initiatives = initiatives.Where(i => i.Max == true);
                        break;
                    case "other":
                        initiatives = initiatives.Where(i => i.Other == true);
                        break;
                }
            }

            if (!string.IsNullOrEmpty(initiativeParams.OwnerName))
            {
                initiatives = initiatives.Where(i => i.OwnerName == initiativeParams.OwnerName);
            }

            if (!string.IsNullOrEmpty(initiativeParams.Organization))
            {
                initiatives = initiatives.Where(i => i.Organization == initiativeParams.Organization);
            }

            if (!string.IsNullOrEmpty(initiativeParams.TypeOfInvestment))
            {
                initiatives = initiatives.Where(i => i.TypeOfInvestment == initiativeParams.TypeOfInvestment);
            }

            if (!string.IsNullOrEmpty(initiativeParams.Plant))
            {
                initiatives = initiatives.Where(i => i.Plant == initiativeParams.Plant);
            }

            if (initiativeParams.RegisterDateSince.HasValue)
            {
                initiatives = initiatives.Where(i => i.RegisteringDate.Value.Date >= initiativeParams.RegisterDateSince);
            }

            if (initiativeParams.RegisterDateTo.HasValue)
            {
                initiatives = initiatives.Where(i => i.RegisteringDate.Value.Date <= initiativeParams.RegisterDateTo);
            }

            if (initiativeParams.RegisterDateSince.HasValue && initiativeParams.RegisterDateTo.HasValue)
            {
                initiatives = initiatives.Where(i => i.RegisteringDate.Value.Date >= initiativeParams.RegisterDateSince && i.RegisteringDate.Value.Date <= initiativeParams.RegisterDateTo);
            }

            if (initiativeParams.Progress == false && initiativeParams.Complete == false && initiativeParams.Cancel == false)
            {
                initiatives = initiatives.Where(i =>
                    i.Status != "draft" &&
                    i.Status != "admin check" &&
                    i.Status != "wait for submission" &&
                    i.Status != "revise" &&
                    i.Status != "reject" &&
                    i.Status != "wait for approval" &&
                    i.Status != "wait for cancellation" &&
                    i.Status != "approved" &&
                    i.Status != "finish" &&
                    i.Status != "revised" &&
                    i.Status != "rejected" &&
                    i.Status != "cancelled" &&
                    i.Status != "wait for review" &&
                    i.Status != "wait for create App." &&
                    i.Status != "wait for create WBS" &&
                    i.Status != "wait for cancelled" &&
                    i.Status != "add more" &&
                    i.Status != "add more pool" &&
                    i.Status != "principle approved" &&
                    i.Status != "" 
                );
            }
            else if (initiativeParams.Progress == true && initiativeParams.Complete == true && initiativeParams.Cancel == true)
            {
                initiatives = initiatives.Where(i =>
                    i.Status == "draft" ||
                    i.Status == "admin check" ||
                    i.Status == "wait for submission" ||
                    i.Status == "wait for cancellation" ||
                    i.Status == "revise" ||
                    i.Status == "reject" ||
                    i.Status == "wait for approval" ||
                    i.Status == "approved" ||
                    i.Status == "finish" ||
                    i.Status == "revised" ||
                    i.Status == "rejected" ||
                    i.Status == "cancelled" ||
                    i.Status == "wait for review" ||
                    i.Status == "wait for create App." ||
                    i.Status == "wait for create WBS" ||
                    i.Status == "add more" ||
                    i.Status == "add more pool" ||
                    i.Status == "principle approved" ||
                    i.Status == ""
                );
            }
            else if (initiativeParams.Progress == true && initiativeParams.Complete == true)
            {
                initiatives = initiatives.Where(i =>
                    i.Status == "draft" ||
                    i.Status == "admin check" ||
                    i.Status == "wait for submission" ||
                    i.Status == "wait for cancellation" ||
                    i.Status == "revise" ||
                    i.Status == "wait for approval" ||
                    i.Status == "revised" ||
                    i.Status == "approved" ||
                    i.Status == "finish" ||
                    i.Status == "wait for review" ||
                    i.Status == "wait for create App." ||
                    i.Status == "wait for create WBS" ||
                    i.Status == "add more" ||
                    i.Status == "add more pool" ||
                    i.Status == "principle approved" ||
                    i.Status == ""
                );
            }
            else if (initiativeParams.Progress == true && initiativeParams.Cancel == true)
            {
                initiatives = initiatives.Where(i =>
                    i.Status == "draft" ||
                    i.Status == "admin check" ||
                    i.Status == "wait for submission" ||
                    i.Status == "wait for cancellation" ||
                    i.Status == "revise" ||
                    i.Status == "wait for approval" ||
                    i.Status == "reject" ||
                    i.Status == "rejected" ||
                    i.Status == "cancelled" ||
                    i.Status == "add more" ||
                    i.Status == "add more pool" ||
                    i.Status == "principle approved" ||
                    i.Status == ""
                );
            }
            else if (initiativeParams.Complete == true && initiativeParams.Cancel == true)
            {
                initiatives = initiatives.Where(i =>
                    i.Status == "approved" ||
                    i.Status == "finish" ||
                    i.Status == "reject" ||
                    i.Status == "rejected" ||
                    i.Status == "cancelled" ||
                    i.Status == "principle approved"
                );
            }
            else if (initiativeParams.Progress == true)
            {
                initiatives = initiatives.Where(i =>
                    i.Status == "draft" ||
                    i.Status == "admin check" ||
                    i.Status == "wait for submission" ||
                    i.Status == "wait for cancellation" ||
                    i.Status == "revise" ||
                    i.Status == "wait for approval" ||
                    i.Status == "revised" ||
                    i.Status == "add more" ||
                    i.Status == "add more pool" ||
                    i.Status == ""
                );
            }
            else if (initiativeParams.Complete == true)
            {
                initiatives = initiatives.Where(i =>
                    i.Status == "approved" ||
                    i.Status == "finish" ||
                    i.Status == "principle approved"
                );
            }
            else if (initiativeParams.Cancel == true)
            {
                initiatives = initiatives.Where(i =>
                    i.Status == "reject" ||
                    i.Status == "rejected" ||
                    i.Status == "cancelled"
                );
            }

            switch (initiativeParams.Column)
            {
                case "id":
                    if (initiativeParams.OrderBy == "asc")
                    {
                        initiatives = initiatives.OrderBy(i => i.InitiativeCode);
                    }
                    else
                    {
                        initiatives = initiatives.OrderByDescending(i => i.InitiativeCode);
                    }
                    break;
                case "name":
                    if (initiativeParams.OrderBy == "asc")
                    {
                        initiatives = initiatives.OrderBy(i => i.Name);
                    }
                    else
                    {
                        initiatives = initiatives.OrderByDescending(i => i.Name);
                    }
                    break;
                case "owner":
                    if (initiativeParams.OrderBy == "asc")
                    {
                        initiatives = initiatives.OrderBy(i => i.OwnerName);
                    }
                    else
                    {
                        initiatives = initiatives.OrderByDescending(i => i.OwnerName);
                    }
                    break;
                case "assign":
                    if (initiativeParams.OrderBy == "asc")
                    {

                    }
                    else
                    {

                    }
                    break;
                case "register":
                    if (initiativeParams.OrderBy == "asc")
                    {
                        initiatives = initiatives.OrderBy(i => i.RegisteringDate);
                    }
                    else
                    {
                        initiatives = initiatives.OrderByDescending(i => i.RegisteringDate);
                    }
                    break;
                case "organization":
                    if (initiativeParams.OrderBy == "asc")
                    {
                        initiatives = initiatives.OrderBy(i => i.Organization);
                    }
                    else
                    {
                        initiatives = initiatives.OrderByDescending(i => i.Organization);
                    }
                    break;
                case "type":
                    if (initiativeParams.OrderBy == "asc")
                    {
                        initiatives = initiatives.OrderBy(i => i.InitiativeType);
                    }
                    else
                    {
                        initiatives = initiatives.OrderByDescending(i => i.InitiativeType);
                    }
                    break;
                case "status":
                    if (initiativeParams.OrderBy == "asc")
                    {
                        initiatives = initiatives.OrderBy(i => i.Status);
                    }
                    else
                    {
                        initiatives = initiatives.OrderByDescending(i => i.Status);
                    }
                    break;
            }

            return await PagedList<Initiative>.CreateAsync(initiatives, initiativeParams.PageNumber, initiativeParams.PageSize);
        }

        public async Task<string[]> InitiativeCoDeveloperCreate(int id, string[] coDevelopers)
        {
            foreach (string item in coDevelopers)
            {
                var CoDeveloperList = new InitiativeCoDeveloper { CoDeveloperName = item, InitiativeId = id };
                await _context.InitiativeCoDevelopers.AddAsync(CoDeveloperList);
                await _context.SaveChangesAsync();
            }
            return coDevelopers;
        }

        public async Task<bool> InitiativeCoDeveloperDelete(int id)
        {
            var CoDevelopersList = await _context.InitiativeCoDevelopers.Where(i => i.InitiativeId == id).ToListAsync();
            foreach (var entity in CoDevelopersList)
                _context.InitiativeCoDevelopers.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<Attachment> InitiativeAttachmentCreate(int id, [FromForm] InitiativeCreateAttachment initiative)
        {
            DateTime now = DateTime.Now;
            var Day = now.Day;
            var Month = now.Month;
            var Year = now.Year;
            var Hour = now.Hour;
            var Minute = now.Minute;
            var Second = now.Second;
            string extension = Path.GetExtension(initiative.File.FileName);
            string result = Path.GetFileNameWithoutExtension(initiative.File.FileName);
            string NewFileName =
                result + "_" + Day.ToString() +
                Month.ToString() + Year.ToString() +
                Hour.ToString() + Minute.ToString() +
                Second.ToString() + extension.ToString();
            string FileName = result + extension.ToString();
            string contentType = initiative.File.ContentType;
            var attachment = new Attachment { Name = FileName, ContentType = contentType, InitiativeId = id, FileName = NewFileName, Extension = extension };
            using (var memoryStream = new MemoryStream())
            {
                initiative.File.CopyTo(memoryStream);
                attachment.File = memoryStream.ToArray();
            }
            await _context.Attachments.AddAsync(attachment);
            await _context.SaveChangesAsync();
            return attachment;
        }

        public async Task<Attachment> GetAttachment(int id)
        {
            var attachment = await _context.Attachments.FirstOrDefaultAsync(i => i.Id == id);
            return attachment;
        }

        public async Task<InitiativeCreateProduct> CreateInitiativeProduct(int id, InitiativeCreateProduct initiativeCreateProduct)
        {
            if (_context.Products.Any())
            {
                var ProductList = await _context.Products.Where(i => i.InitiativeId == id).ToListAsync();
                foreach (var entity in ProductList)
                    _context.Products.Remove(entity);
                await _context.SaveChangesAsync();
            }

            foreach (var item in initiativeCreateProduct.Products)
            {
                await _context.Products.AddAsync(item);
                await _context.SaveChangesAsync();
            }
            return initiativeCreateProduct;
        }

        public async Task<InitiativeCreateMilestone> CreateInitiativeMilestone(int id, InitiativeCreateMilestone initiativeCreateMilestone)
        {
            if (_context.Milestones.Any())
            {
                var MilestoneList = await _context.Milestones.Where(i => i.InitiativeId == id).ToListAsync();
                foreach (var entity in MilestoneList)
                    _context.Milestones.Remove(entity);
                await _context.SaveChangesAsync();
            }

            foreach (var item in initiativeCreateMilestone.Milestones)
            {
                await _context.Milestones.AddAsync(item);
                await _context.SaveChangesAsync();
            }
            return initiativeCreateMilestone;
        }

        public async Task<InitiativeCreateFinancialIndicator> CreateFinancialIndicator(int id, InitiativeCreateFinancialIndicator initiativeFinancialIndicator)
        {
            if (_context.FinancialIndicators.Any())
            {
                var FinancialList = await _context.FinancialIndicators.Where(i => i.InitiativeId == id).ToListAsync();
                foreach (var entity in FinancialList)
                    _context.FinancialIndicators.Remove(entity);
                await _context.SaveChangesAsync();
            }

            foreach (var item in initiativeFinancialIndicator.Financials)
            {
                await _context.FinancialIndicators.AddAsync(item);
                await _context.SaveChangesAsync();
            }
            return initiativeFinancialIndicator;
        }

        public async Task<bool> InitiativeFinancialDelete(int id)
        {
            if (_context.Financials.Any())
            {
                var FinancialsList = await _context.Financials.Where(i => i.InitiativeId == id).ToListAsync();
                foreach (var entity in FinancialsList)
                    _context.Financials.Remove(entity);
                await _context.SaveChangesAsync();
                return true;
            }
            return true;
        }

        public async Task<bool> InitiativeDetailDelete(int id)
        {
            var DetailsList = await _context.InitiativeDetails.Where(i => i.InitiativeId == id).ToListAsync();
            foreach (var entity in DetailsList)
                _context.InitiativeDetails.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<User> GetUserInitiative(string username)
        {
            var user = await _context.Users.FirstOrDefaultAsync(i => i.Username == username);
            return user;
        }

        public async Task<bool> CheckApprove(int id, string actionBy)
        {
            if (await _context.InitiativeActions.Where(a => a.ActionBy == actionBy && a.Action == "approve" && a.InitiativeId == id).AnyAsync())
                return true;
            return false;
        }

        public async Task<bool> CheckApproved(int id)
        {
            if (await _context.InitiativeActions.Where(a => a.InitiativeId == id && a.Status == "approved").AnyAsync())
                return true;
            return false;
        }

        public async Task<Initiative> SetActionBy(int id, string username, string status, string stage)
        {

            var initiative = await _context.Initiatives.FirstOrDefaultAsync(i => i.Id == id);
            var initiativeType = initiative.InitiativeType == null ? "max" : initiative.InitiativeType;  //if null force to MAX
            var ownerEmail = await GetEmailOwnerByInitiativeID(id);
            var approver = await _context.TypeStageApprover.Where(i => i.Stage == stage && i.Type == initiativeType).ToListAsync();

            string[] Capexstages = { "DM", "VP", "EVP/MD/SEVP/COE/PSD/CEO", "Budget Team", "BOD", "App. Request", "WBS Request" };
            string[] CimStages = { "Admin Check", "First Review", "Initiative", "Detail F/S", "BEP" };

            if ((status == "" || status == "draft") && CimStages.Contains(stage))
            {
                await RemoveInitiativeActions(id);
                await AddInitiativeActions(ownerEmail, "draft", "owner", status, stage, id);
                await AddInitiativeActions(initiative.CreatedBy, "draft", "owner", status, stage, id);
            }

            if (status == "draft" && stage == "draft")
            {
                await RemoveInitiativeActions(id);
                await AddInitiativeActions(ownerEmail, "draft", "owner", status, stage, id);
                await AddInitiativeActions(initiative.CreatedBy, "draft", "owner", status, stage, id);
            }

            if (status == "admin check" && stage == "waiting")
            {
                await RemoveInitiativeActions(id);
                if (approver.Any())
                    foreach (var entity in approver)
                    {
                        await AddInitiativeActions(entity.Approver, "approve", "admin", status, stage, id);
                    }
            }

            //----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

            //Approved
            if (status == "wait for submission" && stage == "IL0")
            {
                await RemoveInitiativeActions(id);
                await AddInitiativeActions(ownerEmail, "draft", "owner", status, stage, id);
                await AddInitiativeActions(initiative.CreatedBy, "draft", "owner", status, stage, id);
            }
            if (status == "approved" && stage == "IL1")
            {

                await RemoveInitiativeActions(id);
                await AddInitiativeActions(ownerEmail, "add detail", "owner", status, stage, id);
                await AddInitiativeActions(initiative.CreatedBy, "add detail", "owner", status, stage, id);
            }
            if (status == "approved" && stage == "IL2")
            {

                await RemoveInitiativeActions(id);
                await AddInitiativeActions(ownerEmail, "add detail", "owner", status, stage, id);
                await AddInitiativeActions(initiative.CreatedBy, "add detail", "owner", status, stage, id);
            }
            if (status == "approved" && stage == "IL3")
            {

                await RemoveInitiativeActions(id);
                await AddInitiativeActions(ownerEmail, "add detail", "owner", status, stage, id);
                await AddInitiativeActions(initiative.CreatedBy, "add detail", "owner", status, stage, id);
            }
            if (status == "approved" && stage == "IL4")
            {

                await RemoveInitiativeActions(id);
                await AddInitiativeActions(ownerEmail, "add detail", "owner", status, stage, id);
                await AddInitiativeActions(initiative.CreatedBy, "add detail", "owner", status, stage, id);
            }
            if (status == "approved" && stage == "IL5")
            {

                await RemoveInitiativeActions(id);
                await AddInitiativeActions(ownerEmail, "add detail", "owner", status, stage, id);
                await AddInitiativeActions(initiative.CreatedBy, "add detail", "owner", status, stage, id);
            }

            //CAPEX
            //if (status == "approved" && Capexstages.Contains(stage))
            //{
            //    await RemoveInitiativeActions(id);

            //    if (approver.Any())
            //        foreach (var entity in approver)
            //        {
            //            await AddInitiativeActions(entity.Approver, "approve", "approver", status, stage, id);
            //        }
            //}
            //----------------------------------------------------------------------------------------------------------------------------------------------------------------------------


            //Revised cim 
            if (status == "revised" && CimStages.Contains(stage))
            {
                await RemoveInitiativeActions(id);
                await AddInitiativeActions(ownerEmail, "add detail", "owner", status, stage, id);
                await AddInitiativeActions(initiative.CreatedBy, "add detail", "owner", status, stage, id);
            }

            //Revised Budget 
            if (status == "revised" && Capexstages.Contains(stage))
            {
                await RemoveInitiativeActions(id);
                await AddInitiativeActions(ownerEmail, "add detail", "owner", status, stage, id);
                await AddInitiativeActions(initiative.CreatedBy, "add detail", "owner", status, stage, id);
            }

            //Revised MAX
            if (status == "revised" && stage == "draft")
            {
                await RemoveInitiativeActions(id);
                await AddInitiativeActions(ownerEmail, "add detail", "owner", status, stage, id);
                await AddInitiativeActions(initiative.CreatedBy, "add detail", "owner", status, stage, id);
            }
            if (status == "revised" && stage == "IL0")
            {
                await RemoveInitiativeActions(id);
                await AddInitiativeActions(ownerEmail, "add detail", "owner", status, stage, id);
                await AddInitiativeActions(initiative.CreatedBy, "add detail", "owner", status, stage, id);
            }
            if (status == "revised" && stage == "IL1")
            {
                await RemoveInitiativeActions(id);
                await AddInitiativeActions(ownerEmail, "add detail", "owner", status, stage, id);
                await AddInitiativeActions(initiative.CreatedBy, "add detail", "owner", status, stage, id);
            }
            if (status == "revised" && stage == "IL2")
            {
                await RemoveInitiativeActions(id);
                await AddInitiativeActions(ownerEmail, "add detail", "owner", status, stage, id);
                await AddInitiativeActions(initiative.CreatedBy, "add detail", "owner", status, stage, id);
            }
            if (status == "revised" && stage == "IL3")
            {
                await RemoveInitiativeActions(id);
                await AddInitiativeActions(ownerEmail, "add detail", "owner", status, stage, id);
                await AddInitiativeActions(initiative.CreatedBy, "add detail", "owner", status, stage, id);
            }
            if (status == "revised" && stage == "IL4")
            {
                await RemoveInitiativeActions(id);
                await AddInitiativeActions(ownerEmail, "add detail", "owner", status, stage, id);
                await AddInitiativeActions(initiative.CreatedBy, "add detail", "owner", status, stage, id);
            }



            //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

            string[] stagesForMaxApprovers = { "SIL1", "SIL2", "SIL3", "SIL4", "SIL5" };
            string[] Capexstatuses = { "wait for review", "wait for create App.", "wait for create WBS", "wait for approval" };
            if (Capexstatuses.Contains(status) || status == "wait for approval")
            {
                await RemoveInitiativeActions(id); // clear old approver

                if (stagesForMaxApprovers.Contains(stage))
                {// max approvers
                    string[] approverTypesUsage = { };
                    switch (initiative.Stage)
                    {
                        //TF-BT-TO
                        //TO Finance
                        //CFO
                        //CTO
                        //Sponsor
                        //WorkstreamLead
                        case "SIL1":
                            //TO Team , WorkstreamLead
                            approverTypesUsage = new string[] { "TOTeam", "WorkstreamLead" };
                            break;
                        case "SIL2":
                            //TF-BT-TO , WorkstreamLead , To Finance
                            approverTypesUsage = new string[] { "TF-BT-TO", "WorkstreamLead", "TO Finance" };
                            break;
                        case "SIL3":
                            //CTO, Sponsor, To Finance   ++ additionnal  waraporn.pu@pttgcgroup.com
                            approverTypesUsage = new string[] { "CTO", "Sponsor", "TO Finance", "AdditionalApprover" };
                            break;
                        case "SIL4":
                            //CTO, Sponsor, CFO   ++ additionnal  waraporn.pu@pttgcgroup.com
                            approverTypesUsage = new string[] { "CTO", "Sponsor", "CFO", "AdditionalApprover" };
                            break;
                        case "SIL5":
                            //CTO, Sponsor, CFO   ++ additionnal  waraporn.pu@pttgcgroup.com
                            approverTypesUsage = new string[] { "CTO", "Sponsor", "CFO", "AdditionalApprover" };
                            break;
                    }


                    //set new approver by Stage

                    var MaxApproversByStage = await _context.MaxApprovers.Where(i => i.InitiativeId == initiative.Id
                                                                            && approverTypesUsage.Contains(i.ApproverType)
                                                                            ).OrderBy(i => i.Order).ToListAsync();

                    if (MaxApproversByStage.Any())
                    {
                        foreach (var entity in MaxApproversByStage)
                        {
                            await AddInitiativeActions(entity.ApproverEmail, "approve", "approver", status, stage, id);
                        } // remove old approvers
                    }
                }
                else
                {
                    if (approver.Any())
                        foreach (var entity in approver)
                        {
                            await AddInitiativeActions(entity.Approver, "approve", "approver", status, stage, id);
                        }
                }



            }
            if (status == "wait for cancellation")
            {
                var TOFinanceApprovers = await _context.MaxApprovers.Where(i => i.InitiativeId == initiative.Id
                                                                            && i.ApproverType == "TOTeam"
                                                                            ).OrderBy(i => i.Order).ToListAsync();

                if (TOFinanceApprovers.Any())
                {
                    await RemoveInitiativeActions(id);
                    foreach (var entity in TOFinanceApprovers)
                    {
                        await AddInitiativeActions(entity.ApproverEmail, "approve", "approver", status, stage, id);
                    } // remove old approvers
                }
                else
                {  // �������� TO Finance ���  ������� admin ���繤� cancel
                    var cancellator = await _context.TypeStageApprover.Where(i => i.Stage == "waiting" && i.Type == initiativeType).ToListAsync();

                    await RemoveInitiativeActions(id);
                    if (cancellator.Any())
                        foreach (var entity in cancellator)
                        {
                            await AddInitiativeActions(entity.Approver, "approve", "approver", status, stage, id);
                        }
                }
            }
            ////wait for approval Budget
            //if (status == "wait for approval" && stage == "DM Approve")
            //{
            //    await RemoveInitiativeActions(id);
            //    await AddInitiativeActions(Approver_04, "approve", "approver", status, stage, id);

            //}

            ////wait for approval MAX
            //if (status == "wait for approval" && stage == "SIL1")
            //{
            //    await RemoveInitiativeActions(id);
            //    await AddInitiativeActions(Approver_01, "approve", "approver", status, stage, id);
            //    await AddInitiativeActions(Approver_02, "approve", "approver", status, stage, id);
            //}
            //if (status == "wait for approval" && stage == "SIL2")
            //{
            //    await RemoveInitiativeActions(id);
            //    await AddInitiativeActions(Approver_01, "approve", "approver", status, stage, id);
            //    await AddInitiativeActions(Approver_02, "approve", "approver", status, stage, id);
            //    await AddInitiativeActions(Approver_03, "approve", "approver", status, stage, id);
            //}
            //if (status == "wait for approval" && stage == "SIL3")
            //{
            //    await RemoveInitiativeActions(id);
            //    await AddInitiativeActions(Approver_01, "approve", "approver", status, stage, id);
            //    await AddInitiativeActions(Approver_02, "approve", "approver", status, stage, id);
            //    await AddInitiativeActions(Approver_03, "approve", "approver", status, stage, id);
            //}
            //if (status == "wait for approval" && stage == "SIL4")
            //{
            //    await RemoveInitiativeActions(id);
            //    await AddInitiativeActions(Approver_01, "approve", "approver", status, stage, id);
            //    await AddInitiativeActions(Approver_02, "approve", "approver", status, stage, id);
            //    await AddInitiativeActions(Approver_03, "approve", "approver", status, stage, id);
            //}
            //if (status == "wait for approval" && stage == "SIL5")
            //{
            //    await RemoveInitiativeActions(id);
            //    await AddInitiativeActions(Approver_01, "approve", "approver", status, stage, id);
            //    await AddInitiativeActions(Approver_02, "approve", "approver", status, stage, id);
            //    await AddInitiativeActions(Approver_03, "approve", "approver", status, stage, id);
            //}

            //---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

            //Reject
            if (status == "reject" && stage == "cancelled")
            {
                await RemoveInitiativeActions(id);
            }

            //cancelled
            if (status == "cancelled" && stage == "cancelled")
            {

                await RemoveInitiativeActions(id);
            }

            //------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

            //Revised Budget
            if (status == "draft" && Capexstages.Contains(stage))
            {
                await RemoveInitiativeActions(id);
                await AddInitiativeActions(ownerEmail, "add detail", "owner", status, stage, id);
                await AddInitiativeActions(initiative.CreatedBy, "add detail", "owner", status, stage, id);
            }

            //Backward
            if (status == "draft" && stage == "IL0")
            {
                await RemoveInitiativeActions(id);
                await AddInitiativeActions(ownerEmail, "add detail", "owner", status, stage, id);
                await AddInitiativeActions(initiative.CreatedBy, "add detail", "owner", status, stage, id);
            }
            if (status == "draft" && stage == "IL1")
            {
                await RemoveInitiativeActions(id);
                await AddInitiativeActions(ownerEmail, "add detail", "owner", status, stage, id);
                await AddInitiativeActions(initiative.CreatedBy, "add detail", "owner", status, stage, id);
            }
            if (status == "draft" && stage == "IL2")
            {
                await RemoveInitiativeActions(id);
                await AddInitiativeActions(ownerEmail, "add detail", "owner", status, stage, id);
                await AddInitiativeActions(initiative.CreatedBy, "add detail", "owner", status, stage, id);
            }
            if (status == "draft" && stage == "IL3")
            {
                await RemoveInitiativeActions(id);
                await AddInitiativeActions(ownerEmail, "add detail", "owner", status, stage, id);
                await AddInitiativeActions(initiative.CreatedBy, "add detail", "owner", status, stage, id);
            }

            if (status == "draft" && stage == "IL4")
            {
                await RemoveInitiativeActions(id);
                await AddInitiativeActions(ownerEmail, "add detail", "owner", status, stage, id);
                await AddInitiativeActions(initiative.CreatedBy, "add detail", "owner", status, stage, id);
            }

            if (status == "finish")
            {
                await RemoveInitiativeActions(id);
            }

            return initiative;
        }

        public async Task<string> GetEmailOwnerByInitiativeID(int initiativeId)
        {
            var initiativeOwner = await _context.Initiatives.Where(i => i.Id == initiativeId).FirstOrDefaultAsync();
            var owner = await _context.Owners.Where(i => i.OwnerName == initiativeOwner.OwnerName).FirstOrDefaultAsync();
            return owner.Email;
        }

        public async Task<int> RemoveInitiativeActions(int initiativeId, string actionBy)
        {
            var InitiativeActionDelete = await _context.InitiativeActions.Where(i => i.InitiativeId == initiativeId && i.ActionBy.Trim().ToLower() == actionBy.Trim().ToLower()).ToListAsync();
            foreach (var entity in InitiativeActionDelete)
                _context.InitiativeActions.Remove(entity);
            return await _context.SaveChangesAsync();
        }

        public async Task<int> CountInitiativeAction(int initiativeId)
        {
            var InitiativeActionList = await _context.InitiativeActions.Where(i => i.InitiativeId == initiativeId).ToListAsync();
            return InitiativeActionList.Count;
        }

        public async Task<int> RemoveInitiativeActions(int initiativeId)
        {
            var InitiativeActionDelete = await _context.InitiativeActions.Where(i => i.InitiativeId == initiativeId).ToListAsync();

            if (InitiativeActionDelete.Any())
            {
                foreach (var entity in InitiativeActionDelete)
                    _context.InitiativeActions.Remove(entity);
                return await _context.SaveChangesAsync();
            }
            else
            {
                return 0;
            }
        }


        public async Task<int> AddInitiativeActions(string actionBy, string action, string position, string status, string stage, int initiativeId)
        {
            var owner = await _context.Owners.Where(o => o.Email == actionBy).FirstOrDefaultAsync();
            var InitiativeAction = new InitiativeAction()
            {
                ActionBy = actionBy,
                ActionByName = owner.OwnerName,
                Action = action,
                Position = position,
                Status = status,
                Stage = stage,
                InitiativeId = initiativeId
            };
            await _context.InitiativeActions.AddAsync(InitiativeAction);
            return await _context.SaveChangesAsync();
        }

        public async Task<int> LastHistoryId(int id)
        {
            if (_context.InitiativeStatusTrackings.Where(i => i.InitiativeId == id).Any())
            {
                var initiativeStatusTracking = await _context.InitiativeStatusTrackings.Where(i => i.InitiativeId == id).OrderByDescending(p => p.HistoryId).FirstOrDefaultAsync();
                return initiativeStatusTracking.HistoryId + 1;
            }

            return 0;

        }

        public async Task<int> CreateStagesTracking(Initiative initiative)
        {
            var initiativeType = initiative.InitiativeType == null ? "max" : initiative.InitiativeType;  //if null force to MAX
            var _stages = await _context.TypeStage.Where(i => i.Type == initiativeType).ToListAsync();
            var _statusTrackings = await _context.InitiativeStatusTrackings.Where(i => i.InitiativeId == initiative.Id).ToListAsync();

            //delete all first
            if (_statusTrackings.Any())
            {
                foreach (var entity in _statusTrackings)
                    _context.InitiativeStatusTrackings.Remove(entity);
            }

            // insert stages if exist
            if (_stages.Any())
            {
                var _lastHistoryId = await LastHistoryId(initiative.Id);
                int iCounter = 1;
                foreach (var entity in _stages) //loop stages
                {
                    var _approver = await _context.TypeStageApprover.Where(i => i.Type == initiativeType && i.Stage == entity.Stage).ToListAsync();
                    if (_approver != null && _approver.Count != 0)
                    {
                        foreach (var entityApprover in _approver) //loop insert approver
                        {
                            var approverName = await _context.Owners.Where(i => i.Email == entityApprover.Approver).FirstOrDefaultAsync();
                            if (initiativeType.Contains("max") || initiativeType == "max")
                            {
                                _context.InitiativeStatusTrackings.Add(new InitiativeStatusTracking()
                                {
                                    Sequence = iCounter,
                                    HistoryId = _lastHistoryId,
                                    InitiativeId = initiative.Id,
                                    Stage = entity.Stage,
                                    Status = "Not Start",
                                    ProcessType = initiativeType,
                                    ApprovedBy = null, // case max  approvers change dynamically
                                });
                            }
                            else
                            {
                                _context.InitiativeStatusTrackings.Add(new InitiativeStatusTracking()
                                {
                                    Sequence = iCounter,
                                    HistoryId = _lastHistoryId,
                                    InitiativeId = initiative.Id,
                                    Stage = entity.Stage,
                                    Status = "Not Start",
                                    ProcessType = initiativeType,
                                    ApprovedBy = (approverName != null ? approverName.OwnerName : entityApprover.Approver),
                                });
                            }

                            iCounter++;
                        }
                    }
                    else
                    {
                        _context.InitiativeStatusTrackings.Add(new InitiativeStatusTracking()
                        {
                            Sequence = iCounter,
                            HistoryId = _lastHistoryId,
                            InitiativeId = initiative.Id,
                            Stage = entity.Stage,
                            Status = "Not Start",
                            ProcessType = initiativeType,
                        });

                        iCounter++;
                    }

                }

                return await _context.SaveChangesAsync();
            }
            else
            {
                return 0;
            }
        }

        public async Task<int> UpdateStagesTracking_OnApprove(Initiative initiative, InitiativeSubmit initiativeSubmit)
        {
            if (initiativeSubmit.Status.Contains("cancellation")) return 0;

            string approveDate = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss", new System.Globalization.CultureInfo("en-US"));

            string[] initiativeTypeDIM = { "IT", "Digital" };

            var _lastHistoryId = await LastHistoryId(initiative.Id);
            var initiativeType = initiative.InitiativeType == null ? "max" : initiative.InitiativeType;  //if null force to MAX
            var _nowStage = await _context.TypeStage.Where(i => i.Type == initiativeType && i.Stage == initiative.Stage).FirstOrDefaultAsync();
            var _nowStageRevised = await _context.TypeStage.Where(i => i.Type == initiativeType && i.Stage == initiativeSubmit.Stage).FirstOrDefaultAsync();
            var _beginStageOfIT_Digital = await _context.TypeStage.Where(i => i.Type == initiativeType && i.Order == 1).FirstOrDefaultAsync();


            var firstStageOfMax = await _context.TypeStage.Where(i => i.Order == 1).FirstOrDefaultAsync();
            if (initiativeSubmit.Stage == firstStageOfMax.Stage && initiativeSubmit.Status == "wait for submission" && initiativeType.Contains("max"))
            {
                var idToSetApprovedTime = await _context.InitiativeStatusTrackings.Where(i => i.InitiativeId == initiative.Id && i.Stage == firstStageOfMax.Stage && i.ProcessType == initiative.InitiativeType).FirstOrDefaultAsync();

                if (idToSetApprovedTime != null)
                {
                    idToSetApprovedTime.ApprovedDate = approveDate;
                }


                return await _context.SaveChangesAsync();
            }



            if (initiativeTypeDIM.Contains(initiativeType))
            {
                _nowStageRevised = await _context.TypeStage.Where(i => i.Type == initiativeType && i.Stage == _beginStageOfIT_Digital.Stage).FirstOrDefaultAsync();
            }



            if (_nowStageRevised == null && initiativeSubmit.Status == "revised")
                return 0;

            if (_nowStage == null)
                return 0;

            var _stageToClear = await _context.TypeStage.Where(i => i.Type == initiativeType && i.Order > _nowStage.Order).ToListAsync();

            if (initiativeSubmit.Status == "revised")
            { //clear now stage
                _stageToClear = await _context.TypeStage.Where(i => i.Type == initiativeType && i.Order >= _nowStage.Order).ToListAsync();
            }


            var _allStatusTrackings = await _context.InitiativeStatusTrackings.Where(i => i.InitiativeId == initiative.Id).ToListAsync();
            var _statusTrackings = await _context.InitiativeStatusTrackings.Where(i => i.InitiativeId == initiative.Id && i.Stage == initiative.Stage).ToListAsync();

            if (_stageToClear.Any()) //remove all forward stage
            {
                if (_allStatusTrackings.Any())
                    foreach (var entity in _stageToClear)
                    {
                        var lst_ClearStatus = _allStatusTrackings.Where(i => i.Stage == entity.Stage).ToList();
                        foreach (var entityClear in lst_ClearStatus)
                        {
                            entityClear.Status = "Not Start";
                            entityClear.ApprovedDate = null;
                            //entityClear.HistoryId = _lastHistoryId;
                        }
                    }
            }


            if (initiativeSubmit.Status != "revised")
            { //update status tracking if not revise
                var approverName = await _context.Owners.Where(i => i.Email == initiativeSubmit.Username).FirstOrDefaultAsync();
                var _updateApprover = await _context.InitiativeStatusTrackings.Where(i => i.InitiativeId == initiative.Id
                && i.Stage == initiative.Stage
                && i.ApprovedBy == (approverName == null ? initiativeSubmit.Username : approverName.OwnerName)
                ).OrderBy(i => i.Sequence).FirstOrDefaultAsync();


                if (initiativeSubmit.Status == "reject")
                {
                    _updateApprover.Status = "Rejected";
                }
                else
                {
                    _updateApprover.Status = "Complete";
                }

                _updateApprover.ApprovedDate = approveDate;
                await _context.SaveChangesAsync();
                //_updateApprover.HistoryId = _lastHistoryId;
            }

            var _stageNext = await _context.TypeStage.Where(i => i.Type == initiativeType && i.Order == _nowStage.Order + 1).FirstOrDefaultAsync();

            //update next Stage Forward In Progress  -- clear all status forward
            var _stageNextForward = await _context.TypeStage.Where(i => i.Type == initiativeType && i.Order == _nowStage.Order + 2).FirstOrDefaultAsync();
            var _updateNextForwardStatusTracking = await _context.InitiativeStatusTrackings.Where(i => i.InitiativeId == initiative.Id && i.Stage == (_stageNext == null ? null : _stageNext.Stage)).ToListAsync();
            foreach (var entity in _updateNextForwardStatusTracking)
            {
                entity.Status = "Not Start";
                entity.ApprovedDate = null;
            }

            var _updateNextStatusTracking = await _context.InitiativeStatusTrackings.Where(i => i.InitiativeId == initiative.Id && i.Stage == "").ToListAsync(); //mock variable to use in switch
            switch (initiativeSubmit.Status)
            {
                case "approved":
                    if (await CountInitiativeAction(initiative.Id) <= 1)  //update next Stage In Progress
                    {
                        _updateNextStatusTracking = await _context.InitiativeStatusTrackings.Where(i => i.InitiativeId == initiative.Id && i.Stage == _stageNext.Stage).ToListAsync();
                        foreach (var entity in _updateNextStatusTracking)
                        {
                            entity.Status = "In Progress";
                            entity.ApprovedDate = approveDate;
                        }
                    }
                    break;

                case "wait for approval":
                    if (await CountInitiativeAction(initiative.Id) <= 1 ) //update next Stage In Progress
                    {
                        _updateNextStatusTracking = await _context.InitiativeStatusTrackings.Where(i => i.InitiativeId == initiative.Id && i.Stage == _stageNext.Stage).ToListAsync();
                        foreach (var entity in _updateNextStatusTracking)
                        {
                            entity.Status = "In Progress";
                            entity.ApprovedDate = null;
                        }
                    }
                    break;

                case "wait for create App.":
                    if (await CountInitiativeAction(initiative.Id) <= 1)  //update next Stage In Progress
                    {
                        _updateNextStatusTracking = await _context.InitiativeStatusTrackings.Where(i => i.InitiativeId == initiative.Id && i.Stage == _stageNext.Stage).ToListAsync();
                        foreach (var entity in _updateNextStatusTracking)
                        {
                            entity.Status = "In Progress";
                            entity.ApprovedDate = null;
                        }
                    }
                    break;

                case "wait for create WBS":
                    if (await CountInitiativeAction(initiative.Id) <= 1)  //update next Stage In Progress
                    {
                        _updateNextStatusTracking = await _context.InitiativeStatusTrackings.Where(i => i.InitiativeId == initiative.Id && i.Stage == _stageNext.Stage).ToListAsync();
                        foreach (var entity in _updateNextStatusTracking)
                        {
                            entity.Status = "In Progress";
                            entity.ApprovedDate = null;
                        }
                    }
                    break;

                case "wait for review":
                    if (await CountInitiativeAction(initiative.Id) <= 1)  //update next Stage In Progress
                    {
                        _updateNextStatusTracking = await _context.InitiativeStatusTrackings.Where(i => i.InitiativeId == initiative.Id && i.Stage == _stageNext.Stage).ToListAsync();
                        foreach (var entity in _updateNextStatusTracking)
                        {
                            entity.Status = "In Progress";
                            entity.ApprovedDate = null;
                        }
                    }
                    break;

                case "reject":
                    //set everything in progress to not start
                    _updateNextStatusTracking = await _context.InitiativeStatusTrackings.Where(i => i.InitiativeId == initiative.Id && i.Status == "In Progress" && i.ApprovedDate == null).ToListAsync();
                    foreach (var entity in _updateNextStatusTracking)
                    {
                        entity.Status = "Not Start";
                        entity.ApprovedDate = null;
                    }
                    break;

                case "revised":  //means cancelled
                                 //revert stage back  //like backward    //waiting fix 

                    ////clear stage from stage order -1
                    if (initiativeTypeDIM.Contains(initiativeType))
                    {  // Dim Revise Clear All Stage!
                        _updateNextForwardStatusTracking = await _context.InitiativeStatusTrackings.Where(i => i.InitiativeId == initiative.Id).ToListAsync();
                    }

                    foreach (var entity in _updateNextForwardStatusTracking)
                    {
                        entity.Status = "Not Start";
                        entity.ApprovedDate = null;
                    }

                    var updateNowStatusTracking = await _context.InitiativeStatusTrackings.Where(i => i.InitiativeId == initiative.Id && i.Stage == _nowStageRevised.Stage).ToListAsync();
                    foreach (var entity in updateNowStatusTracking)
                    {
                        entity.Status = "In Progress";

                        if (entity.Stage != firstStageOfMax.Stage)  //stage IL0  not clear approved Date when revise or backward
                            entity.ApprovedDate = null;
                    }
                    break;
                default:
                    if (initiativeType == "directCapex" && await CountInitiativeAction(initiative.Id) <= 1 && _stageNext != null)  //update next Stage In Progress  for capex
                    {
                        _updateNextStatusTracking = await _context.InitiativeStatusTrackings.Where(i => i.InitiativeId == initiative.Id && i.Stage == _stageNext.Stage).ToListAsync();
                        foreach (var entity in _updateNextStatusTracking)
                        {
                            entity.Status = "In Progress";
                            entity.ApprovedDate = null;
                        }
                    }
                    break;
            }


            return await _context.SaveChangesAsync();
        }

        //public async Task<int> UpdateStagesTracking_NextStatus(Initiative initiative, InitiativeSubmitStageStatus initiativeSubmitStageStatus)
        //{
        //    var initiativeType = initiative.InitiativeType == null ? "max" : initiative.InitiativeType;  //if null force to MAX
        //    var _orderStagesForward = _context.TypeStage.Where(i => i.Type == initiativeType && i.Stage == initiative.Stage).FirstOrDefault();

        //    if (_orderStagesForward == null)
        //        return 0;

        //    var _stageNext = await _context.TypeStage.Where(i => i.Type == initiativeType && i.Order == _orderStagesForward.Order + 1).FirstOrDefaultAsync();
        //    var _updateNextStatusTracking = await _context.InitiativeStatusTrackings.Where(i => i.InitiativeId == initiative.Id && i.Stage == _stageNext.Stage).ToListAsync();

        //    foreach (var entity in _updateNextStatusTracking)
        //    {
        //        entity.Status = "In Progress";
        //    }

        //    return await _context.SaveChangesAsync();
        //}

        public async Task<int> UpdateStagesTracking_OnSubmit(Initiative initiative, InitiativeSubmitStageStatus initiativeSubmitStageStatus, string statusDirection)
        {
            var _lastHistoryId = await LastHistoryId(initiative.Id);
            var initiativeType = initiative.InitiativeType == null ? "max" : initiative.InitiativeType;  //if null force to MAX

            var _nowStage = await _context.TypeStage.Where(i => i.Order == -1).FirstOrDefaultAsync();
            var _prevStage = await _context.TypeStage.Where(i => i.Order == -1).FirstOrDefaultAsync();
            switch (statusDirection)
            {
                case "backward":
                    _nowStage = await _context.TypeStage.Where(i => i.Type == initiativeType && i.Stage == initiativeSubmitStageStatus.Stage).FirstOrDefaultAsync();
                    break;
                default:
                    _nowStage = await _context.TypeStage.Where(i => i.Type == initiativeType && i.Stage == initiative.Stage).FirstOrDefaultAsync();
                    break;
            }
            //_nowStage = await _context.TypeStage.Where(i => i.Type == initiativeType && i.Stage == initiative.Stage).FirstOrDefaultAsync();

            var _stageToClear = await _context.TypeStage.Where(i => i.Id == -1).ToListAsync(); //mock variable
            if (_nowStage == null)
            { //if stage == null then clear all approver date
                _stageToClear = await _context.TypeStage.Where(i => i.Type == initiativeType).ToListAsync();
            }
            else
            {
                _stageToClear = await _context.TypeStage.Where(i => i.Type == initiativeType && i.Order > _nowStage.Order).ToListAsync();
                _prevStage = await _context.TypeStage.Where(i => i.Type == initiativeType && i.Order == _nowStage.Order - 1).FirstOrDefaultAsync();
            }


            var _allStatusTrackings = await _context.InitiativeStatusTrackings.Where(i => i.InitiativeId == initiative.Id).ToListAsync();
            var _nextStatusTracking = await _context.InitiativeStatusTrackings.Where(i => i.InitiativeId == initiative.Id && i.Stage == initiativeSubmitStageStatus.Stage).ToListAsync();
            var _nowStatusTrackingQueryable = _context.InitiativeStatusTrackings.AsQueryable();
            _nowStatusTrackingQueryable = _nowStatusTrackingQueryable.Where(i => i.InitiativeId == initiative.Id && i.Stage == (_nowStage == null ? "" : _nowStage.Stage));

            if (statusDirection == "cancelled")
            {
                _nowStatusTrackingQueryable = _nowStatusTrackingQueryable.Where(i => i.Status == "In Progress");
            }

            var _nowStatusTracking = await _nowStatusTrackingQueryable.ToListAsync();

            if (_nowStatusTracking.Any())
            {
                var _maxDateApprover = await _context.InitiativeStatusTrackings.Where(i => i.InitiativeId == initiative.Id && i.Stage == (_prevStage == null ? "" : _prevStage.Stage) && i.ApprovedBy != null).OrderByDescending(i => i.ApprovedDate).FirstOrDefaultAsync();

                foreach (var entity in _nowStatusTracking)
                {
                    if (statusDirection == "cancelled")
                    {
                        entity.Status = "Cancelled (By Owner)";
                    }
                    else
                    {
                        entity.Status = "Complete";
                    }

                    if (_maxDateApprover != null)
                        entity.ApprovedDate = _maxDateApprover.ApprovedDate;
                }

            }

            if (_stageToClear.Any()) //remove all forward stage
            {
                if (_allStatusTrackings.Any())
                    foreach (var entity in _stageToClear)
                    {
                        var lst_ClearStatus = _allStatusTrackings.Where(i => i.Stage == entity.Stage).ToList();
                        foreach (var entityClear in lst_ClearStatus)
                        {
                            entityClear.Status = "Not Start";
                            entityClear.ApprovedDate = null;
                            //entityClear.HistoryId = _lastHistoryId;
                        }
                    }
            }


            if (statusDirection != "cancelled")
                if (_nextStatusTracking.Any())
                { //next stage In Progress

                    var firstStageOfMax = await _context.TypeStage.Where(i => i.Order == 1 && i.Type == "max").FirstOrDefaultAsync();
                    foreach (var entity in _nextStatusTracking)
                    {
                        entity.Status = "In Progress";
                        if (initiativeType.Contains("max"))
                        {
                            if (entity.Stage != firstStageOfMax.Stage)  //stage IL0  not clear approved Date when revise or backward
                                entity.ApprovedDate = null;
                        }
                        else
                        {
                            entity.ApprovedDate = null;
                        }
                    }
                }
                else
                { // first stage In Progress
                    var _stageNext = await _context.TypeStage.Where(i => i.Type == initiativeType && i.Order == (_nowStage == null ? 1 : _nowStage.Order + 1)).FirstOrDefaultAsync();
                    var _updateNextStatusTracking = await _context.InitiativeStatusTrackings.Where(i => i.InitiativeId == initiative.Id && i.Stage == _stageNext.Stage).ToListAsync();
                    var firstStageOfMax = await _context.TypeStage.Where(i => i.Order == 1 && i.Type == "max").FirstOrDefaultAsync();

                    foreach (var entity in _updateNextStatusTracking)
                    {
                        entity.Status = "In Progress";

                        if (initiativeType.Contains("max"))
                        {
                            if (entity.Stage != firstStageOfMax.Stage)  //stage IL0  not clear approved Date when revise or backward
                                entity.ApprovedDate = null;
                        }
                        else
                        {
                            entity.ApprovedDate = null;
                        }

                    }
                }
            return await _context.SaveChangesAsync();
        }

        public async Task<int> InsertStagesHistory(Initiative initiative, InitiativeSubmit initiativeSubmit)
        {
            var approverName = await _context.Owners.Where(i => i.Email == initiativeSubmit.Username).FirstOrDefaultAsync();

            _context.InitiativeStatusHistory.Add(new InitiativeStatusHistory
            {
                InitiativeId = initiative.Id,
                Stage = initiative.Stage,
                Status = initiativeSubmit.Status,
                ActionBy = approverName == null ? initiativeSubmit.Username : approverName.OwnerName,
                ActionDate = initiativeSubmit.ApprovedDate?.ToString("yyyy-MM-dd HH:mm:ss", new System.Globalization.CultureInfo("en-US")),
                Comment = initiativeSubmit.Remark,
                LastSubmittedDate = initiative.LastSubmittedDate
            });

            return await _context.SaveChangesAsync();
        }

        public async Task CallMicrosoftFlow_SendMail(int id, string action)
        {
            string urlFlow = "";
            var iniType = await _context.Initiatives.Where(i => i.Id == id).FirstOrDefaultAsync();
            var context_url = await _context.URLTables.Where(i => i.URLType == "MSFLOW").ToListAsync();
            if (context_url.Any()) urlFlow = context_url.FirstOrDefault().URL;

            if (urlFlow != "")
            {

                var stringContent = new StringContent("[" + JsonConvert.SerializeObject(
                  new
                  {
                      INIID = id.ToString(),
                      ACTION = action,
                      INITYPE = iniType.InitiativeType,
                  }
              ) + "]", Encoding.UTF8, "application/json");

                var client = _clientFactory.CreateClient();

                var response = await client.PostAsync(urlFlow, stringContent);

            }
        }

        public async Task<int> ChangeApproverStatusTrackingFromSetActionBy(Initiative initiative)
        {
            if (initiative.Stage == null) return 0;
            if (!initiative.Stage.Contains("SIL")) return 0;

            var initiativeType = initiative.InitiativeType == null ? "max" : initiative.InitiativeType;  //if null force to MAX
            var _lastHistoryId = await LastHistoryId(initiative.Id);
            var nowApproverOnStatusTracking = await _context.InitiativeStatusTrackings.Where(i => i.InitiativeId == initiative.Id && i.Stage == initiative.Stage).OrderByDescending(i => i.Sequence).ToListAsync();
            int newSequence = 0;

            foreach (var entity in nowApproverOnStatusTracking)
            {
                newSequence = entity.Sequence; //get smallest sequence for add in new approver sequence
                _context.InitiativeStatusTrackings.Remove(entity);
            } // remove old approvers

            var statusTrackingForSetNewSequence = await _context.InitiativeStatusTrackings.Where(i => i.InitiativeId == initiative.Id && i.Sequence >= newSequence).OrderBy(i => i.Sequence).ToListAsync();

            var setActionByApprovers = await _context.InitiativeActions.Where(i => i.InitiativeId == initiative.Id && i.Action == "approve").ToListAsync();

            foreach (var entity in setActionByApprovers)
            {
                var approverName = await _context.Owners.Where(i => i.Email == entity.ActionBy).FirstOrDefaultAsync();

                _context.InitiativeStatusTrackings.Add(new InitiativeStatusTracking()
                {
                    Sequence = newSequence,
                    HistoryId = _lastHistoryId,
                    InitiativeId = initiative.Id,
                    Stage = entity.Stage,
                    Status = "In Progress",
                    ProcessType = initiativeType,
                    ApprovedBy = (approverName == null ? entity.ActionBy : approverName.OwnerName)
                });

                newSequence++;
            }

            foreach (var entity in statusTrackingForSetNewSequence)
            {
                entity.Sequence = newSequence;
                newSequence++;
            }

            return await _context.SaveChangesAsync();
        }

        public async Task<bool> isRemainsActionBy(int initiativeId, string approverType)
        {
            var remainsActionBy = await _context.InitiativeActions.Where(i => i.InitiativeId == initiativeId).ToListAsync();

            foreach (var entity in remainsActionBy)
            {
                var checkApproverType = await _context.MaxApproverSettings.Where(i => i.ApproverEmail == entity.ActionBy && i.Indicator == approverType).FirstOrDefaultAsync();
                if (checkApproverType != null) return true;
            }

            return false;
        }

        public async Task<bool> isMatchedApproverType(int initiativeId, string approverEmail, string approverType)
        {
            var detailinformations = await _context.DetailInformations.Where(i => i.InitiativeId == initiativeId).FirstOrDefaultAsync();
            var checkMatched = await _context.MaxApproverSettings.Where(i => i.ApproverEmail == approverEmail && i.Indicator == approverType && i.WorkstreamValue == detailinformations.SubWorkstream2).FirstOrDefaultAsync();
            if (checkMatched != null)
            {
                return true;
            }

            return false;
        }

        public async Task<int> RemoveActionBy_ByApproverType(int initiativeId, string approverType, string approverEmail)
        {
            var detailinformations = await _context.DetailInformations.Where(i => i.InitiativeId == initiativeId).FirstOrDefaultAsync();
            var actionBys = await _context.InitiativeActions.Where(i => i.InitiativeId == initiativeId && i.Action == "approve" && i.ActionBy != approverEmail).ToListAsync();

            foreach (var entity in actionBys)
            {
                var checkApproverType = await _context.MaxApproverSettings.Where(i => i.ApproverEmail == entity.ActionBy && i.Indicator == approverType && i.WorkstreamValue == detailinformations.SubWorkstream2).FirstOrDefaultAsync();
                if (checkApproverType != null)
                {
                    await RemoveInitiativeActions(initiativeId, entity.ActionBy);

                    var approverName = await _context.Owners.Where(i => i.Email == entity.ActionBy).FirstOrDefaultAsync();
                    var nowApproverOnStatusTracking = await _context.InitiativeStatusTrackings.Where(i => i.InitiativeId == initiativeId && i.Status == "In Progress"
                                                                                                    && (i.ApprovedBy == (approverName == null ? "" : approverName.OwnerName) || i.ApprovedBy == entity.ActionBy)
                                                                                                    ).OrderByDescending(i => i.Sequence).ToListAsync();

                    foreach (var entityStatusTracking in nowApproverOnStatusTracking)
                    {
                        _context.InitiativeStatusTrackings.Remove(entityStatusTracking);
                    }  // remove in statustracking
                }
            }




            return await _context.SaveChangesAsync();
        }

        public async Task<int> UpdateLastestApproved(int initiativeId, string stage)
        {
            var impactRecord = await _context.ImpactTrackings.Where(i => i.InitiativeId == initiativeId).FirstOrDefaultAsync();

            switch (stage)
            {
                case "SIL4":
                    DateTime dateTime = DateTime.Now;
                    if (impactRecord.FirstApprovedIL4Date == null) impactRecord.FirstApprovedIL4Date = dateTime;
                    impactRecord.LastApprovedIL4Date = dateTime;
                    break;

                case "SIL5":
                    impactRecord.LastApprovedIL5Date = DateTime.Now;
                    break;
            }

            _context.ImpactTrackings.Update(impactRecord);

            return await _context.SaveChangesAsync();
        }

        public async Task<int> UpdateLastestSubmittedSIL(int initiativeId, string stage, DateTime? dateTime)
        {
            var impactRecord = await _context.ImpactTrackings.Where(i => i.InitiativeId == initiativeId).FirstOrDefaultAsync();

            switch (stage)
            {
                case "SIL4":
                    impactRecord.LastSubmittedSIL4Date = dateTime;
                    break;

                case "SIL5":
                    impactRecord.LastSubmittedSIL5Date = dateTime;
                    break;
            }

            _context.ImpactTrackings.Update(impactRecord);

            return await _context.SaveChangesAsync();
        }

        public async Task CallMicrosoftFlow_OnSubmit(int initiativeId, string direction, string urlType)
        {
            string urlFlow = "";
            //var iniType = await _context.Initiatives.Where(i => i.Id == initiativeId).FirstOrDefaultAsync();
            var context_url = await _context.URLTables.Where(i => i.URLType == urlType).ToListAsync();
            if (context_url.Any()) urlFlow = context_url.FirstOrDefault().URL;

            if (urlFlow != "")
            {

                var stringContent = new StringContent("[" + JsonConvert.SerializeObject(
                      new
                      {
                          INIID = initiativeId.ToString(),
                          DIRECTION = direction,
                      }
                  ) + "]", Encoding.UTF8, "application/json");

                var client = _clientFactory.CreateClient();

                var response = await client.PostAsync(urlFlow, stringContent);

            }
        }

        public async Task CallMicrosoftFlow_OnApproved(int initiativeId, string actionType, string urlType)
        {
            string urlFlow = "";
            //var iniType = await _context.Initiatives.Where(i => i.Id == initiativeId).FirstOrDefaultAsync();
            var context_url = await _context.URLTables.Where(i => i.URLType == urlType).ToListAsync();
            if (context_url.Any()) urlFlow = context_url.FirstOrDefault().URL;

            if (urlFlow != "")
            {

                var stringContent = new StringContent("[" + JsonConvert.SerializeObject(
                      new
                      {
                          INIID = initiativeId.ToString(),
                          ACTIONTYPE = actionType,
                      }
                  ) + "]", Encoding.UTF8, "application/json"); ;

                var client = _clientFactory.CreateClient();

                var response = await client.PostAsync(urlFlow, stringContent);

            }
        }

        public async Task<DateTime> GetLastestUpdate(int id)
        {
            DateTime? lastestUpdate = await _context.Initiatives.Where(i => i.Id == id).Select(i=>i.UpdatedDate).FirstOrDefaultAsync();
            DateTime getUpdateTime = (DateTime)lastestUpdate;
            return getUpdateTime;
        }

        // ----------------------- DashBoard Count ----------------------- //
        public async Task<int> MyTaskInProgress(MyInitiative MyInitiative)
        {
            var Initiative = await _context.InitiativeActions.Where(
                i => i.Status == "draft" && i.ActionBy == MyInitiative.Username
            ).ToListAsync();
            return Initiative.Count;
        }

        public async Task<int> MyTaskNotStarted(MyInitiative MyInitiative)
        {
            var Initiative = await _context.InitiativeActions.Where(i => i.ActionBy == MyInitiative.Username).Where(i =>
                i.Status == "admin check"       ||
                i.Status == "wait for approval" ||
                i.Status == "wait for cancellation"
            ).ToListAsync();
            return Initiative.Count;
        }

        public async Task<int> MyInitiativeDraft(MyInitiative MyInitiative)
        {
            var Initiative = await _context.Initiatives.Where(i => i.CreatedBy == MyInitiative.Username.Trim() || i.OwnerName == MyInitiative.Username).Where(i =>
                i.Status == "draft" || i.Status == ""
            ).ToListAsync();
            return Initiative.Count;
        }

        public async Task<int> MyInitiativeInProgress(MyInitiative MyInitiative)
        {
            var Initiative = await _context.Initiatives.Where(i => i.CreatedBy == MyInitiative.Username.Trim() || i.OwnerName == MyInitiative.Username).Where(i =>
                i.Status == "admin check" ||
                i.Status == "wait for submission" ||
                i.Status == "wait for cancellation" ||
                i.Status == "revise" ||
                i.Status == "wait for approval" ||
                i.Status == "revised" ||
                i.Status == "add more" ||
                i.Status == "add more pool"
            ).ToListAsync();
            return Initiative.Count;
        }

        public async Task<int> MyInitiativeCompleted(MyInitiative MyInitiative)
        {
            var Initiative = await _context.Initiatives.Where(i => i.CreatedBy == MyInitiative.Username.Trim() || i.OwnerName == MyInitiative.Username).Where(i =>
                i.Status == "approved" ||
                i.Status == "finish" ||
                i.Status == "principle approved"
            ).ToListAsync();
            return Initiative.Count;
        }

        public async Task<int> MyInitiativeCanceled(MyInitiative MyInitiative)
        {
            var Initiative = await _context.Initiatives.Where(i => i.CreatedBy == MyInitiative.Username.Trim() || i.OwnerName == MyInitiative.Username).Where(i =>
                i.Status == "reject" ||
                i.Status == "rejected" ||
                i.Status == "cancelled"
            ).ToListAsync();
            return Initiative.Count;
        }

        public async Task<string> GetUserCompany(string email)
        {
            var getCompany = await _context.Owners.Where(i => i.Email.ToLower() == email.ToLower()).Select(i => i.CompanyShortTxt).FirstOrDefaultAsync();

            return getCompany;
        }
    }
}
