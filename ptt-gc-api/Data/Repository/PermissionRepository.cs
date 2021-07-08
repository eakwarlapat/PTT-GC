using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using DocumentFormat.OpenXml.Office2013.Drawing.ChartStyle;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Internal;
using PTT_GC_API.Data.Interface;
using PTT_GC_API.Dtos.Permission;
using PTT_GC_API.Models.Permission;

namespace PTT_GC_API.Data.Repository
{
    public class PermissionRepository : PermissionInterface
    {
        private readonly DataContext _context;
        public PermissionRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<bool> CheckOverviewPermission(Overview overview)
        {
            if (await _context.OverviewPermissions.Where(o => o.Email == overview.Email).AnyAsync())
                return true;
            return false;
        }
        public async Task<bool> CheckDashboardPermission(Dashboard dashboard)
        {
            if (await _context.OverviewPermissions.Where(o => o.Email == dashboard.Email).AnyAsync())
                return true;
            return false;
        }

        public async Task<object> GetListPermission(string email, string page, int initiativeId)
        {
            // return await _context.Organizations.OrderBy(o => o.OrganizationTitle).ToListAsync();

            var roleManageJson = new List<NoPermission>();
            var rolebyCreate = new List<NoPermission>();
            var roleManage = new List<RoleManagement>();

            //create ???
            if (page == "create")  // submit : Page Create,
            {
                rolebyCreate.Add(new NoPermission
                {
                    username = email,
                    roleId = "",
                    roleName = "",
                    pageId = "",
                    pageName = "create",
                    sectionId = "S00005",
                    sectionName = "Submit",
                    isVisible = true,
                    isEnable = true
                });
            }
            else
            {
                //my Own ???
                var ownerName = await _context.Owners.Where(o => o.Email.ToLower() == email.ToLower()).Select(o => o.OwnerName).ToArrayAsync();
                var isMyOwn = await (from a in _context.Initiatives where a.Id == initiativeId && ownerName.Contains(a.OwnerName) select a.InitiativeCode).CountAsync();
                if (isMyOwn > 0) // submit : Page Edit,
                {
                    //roleManageJson = await (from a in _context.RoleManagements.Where(o => o.SectionId == "S00005")
                    //                        select new NoPermission
                    //                        {
                    //                            username = email,
                    //                            roleId = a.RoleId,
                    //                            roleName = (from rn in _context.RoleSettings where rn.RoleId == a.RoleId select rn.RoleName).FirstOrDefault(),
                    //                            pageId = a.PageId,
                    //                            pageName = (from pn in _context.PageSettings where pn.PageId == a.PageId select pn.PageName).FirstOrDefault(),
                    //                            sectionId = a.SectionId,
                    //                            sectionName = (from sm in _context.SectionSettings where sm.SectionId == a.SectionId select sm.SectionName).FirstOrDefault(),
                    //                            isVisible = true,
                    //                            isEnable = true
                    //                        }).ToListAsync();
                    rolebyCreate.Add(new NoPermission
                    {
                        username = email,
                        roleId = "",
                        roleName = "",
                        pageId = "",
                        pageName = "create",
                        sectionId = "S00005",
                        sectionName = "Submit",
                        isVisible = true,
                        isEnable = true
                    });
                    rolebyCreate.Add(new NoPermission
                    {
                        username = email,
                        roleId = "",
                        roleName = "",
                        pageId = "",
                        pageName = "createss",
                        sectionId = "S00005ss",
                        sectionName = "Submitss",
                        isVisible = false,
                        isEnable = false
                    });
                }

                //user in permission ???
                var userId = await (from a in _context.UserManagements where a.Email == email select a.Id).FirstOrDefaultAsync();
                if (userId.ToString() != "")
                {
                    //var roleId = (from a in _context.UserRoles.ToList() where a.UserId == userId select a.RoleId).ToArray();
                    var roleId = await _context.UserRoles.Where(o => o.UserId == userId).Select(o => o.RoleId).ToArrayAsync();
                    if (roleId.Count() > 0)
                    {
                        //var roleManage =  (from a in  _context.RoleManagements where roleId.Contains(a.RoleId) select a).ToList();
                        //roleManage = await _context.RoleManagements.Select(o=>o).ToListAsync();
                        roleManageJson = await (from a in _context.RoleManagements
                                                join b in _context.UserRoles.Where(o => o.UserId == userId)
                                                on a.RoleId equals b.RoleId
                                                select new NoPermission
                                                {
                                                    username = email,
                                                    roleId = a.RoleId,
                                                    roleName = (from rn in _context.RoleSettings where rn.RoleId == a.RoleId select rn.RoleName).FirstOrDefault(),
                                                    pageId = a.PageId,
                                                    pageName = (from pn in _context.PageSettings where pn.PageId == a.PageId select pn.PageName).FirstOrDefault(),
                                                    sectionId = a.SectionId,
                                                    sectionName = (from sm in _context.SectionSettings where sm.SectionId == a.SectionId select sm.SectionName).FirstOrDefault(),
                                                    isVisible = a.IsVisible,
                                                    isEnable = a.IsEnable
                                                }).ToListAsync();
                    }
                }
            }

            
            //roleManage = await _context.RoleManagements.Select(o => o).ToListAsync();
            // var aaa = await _context.OverviewPermissions.Where(o => o.Email == email).Select(o=>o.Id).ToListAsync();
            //return roleManage;
            return  rolebyCreate.Union(roleManageJson);
            //return await rolebyCreate;
        }

        public class NoPermission
        {
            public string username { get; set; }
            public string roleId { get; set; }
            public string roleName { get; set; }
            public string pageId { get; set; }
            public string pageName { get; set; }
            public string sectionId { get; set; }
            public string sectionName { get; set; }
            public bool? isVisible { get; set; }
            public bool? isEnable { get; set; }
        }
    }
}