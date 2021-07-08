using NPOI.Util;
using System.Numerics;
using BigInteger = System.Numerics.BigInteger;

namespace PTT_GC_API.Models.Owner
{
    public class Owner
    {
        public int Id { get; set; }
        public string OwnerName { get; set; }
        public string EmployeeID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Indicator { get; set; }
        public string Telephone { get; set; }
        public string Email { get; set; }

        //2020-06-16 For Org. Chart
        public string Title { get; set; }
        public string BloodGrp { get; set; }
        public string Extension { get; set; }
        public int? CompanyCode { get; set; }
        public string CompanyShortTxt { get; set; }
        public string CompanyName { get; set; }
        public string EmpGroup { get; set; }
        public string EmpGroupTxt { get; set; }
        public int? EmpSubGroup { get; set; }
        public string EmpSubGroupTxt { get; set; }
        public int? EmploymentStatus { get; set; }
        public string EmploymentStatusTxt { get; set; }
        public string AdminGroup { get; set; }
        public long? MainPositionCostCenter { get; set; }
        public int? AssignmentCostCenter { get; set; }
        public string ActionType { get; set; }
        public string ActionText { get; set; }
        public int? OrgID { get; set; }
        public string OrgTextEN { get; set; }
        public string OrgShortTextEN { get; set; }
        public int? OrgLevel { get; set; }
        public int? PositionID { get; set; }
        public string PositionTextEN { get; set; }
        public string PositionShortTextEN { get; set; }
        public int? PositionLevel { get; set; }
        public bool? ManagerialFlag { get; set; }
        public bool? MainPositionFlg { get; set; }
        public int? ParentOrgID { get; set; }
        public int? UnitOrgID { get; set; }
        public string UnitShortTextEN { get; set; }
        public string UnitTextEN { get; set; }
        public int? UnitManagerPositionID { get; set; }
        public int? UnitManagerEmpID { get; set; }
        public int? SupOrgID { get; set; }
        public string SupShortTextEN { get; set; }
        public string SupTextEN { get; set; }
        public int? SupManagerPositionID { get; set; }
        public int? SupManagerEmpID { get; set; }
        public int? ShiftOrgID { get; set; }
        public string ShiftShortTextEN { get; set; }
        public string ShiftTextEN { get; set; }
        public int? ShiftManagerPositionID { get; set; }
        public int? ShiftManagerEmpID { get; set; }
        public int? DivOrgID { get; set; }
        public string DivShortTextEN { get; set; }
        public string DivTextEN { get; set; }
        public int? DivManagerPositionID { get; set; }
        public int? DivManagerEmpID { get; set; }
        public int? DepOrgID { get; set; }
        public string DepShortTextEN { get; set; }
        public string DepTextEN { get; set; }
        public int? DepManagerPositionID { get; set; }
        public int? DepManagerEmpID { get; set; }
        public int? FNOrgID { get; set; }
        public string FNShortTextEN { get; set; }
        public string FNTextEN { get; set; }
        public int? FNManagerPositionID { get; set; }
        public int? FNManagerEmpID { get; set; }
        public int? FNGRPOrgID { get; set; }
        public string FNGRPShortTextEN { get; set; }
        public string FNGRPTextEN { get; set; }
        public int? FNGRPManagerPositionID { get; set; }
        public int? FNGRPManagerEmpID { get; set; }
        public int? PSDOrgID { get; set; }
        public string PSDShortTextEN { get; set; }
        public string PSDTextEN { get; set; }
        public int? PSDManagerPositionID { get; set; }
        public int? PSDManagerEmpID { get; set; }
        public int? CEOOrgID { get; set; }
        public string CEOShortTextEN { get; set; }
        public string CEOTextEN { get; set; }
        public int? CEOManagerPositionID { get; set; }
        public int? CEOManagerEmpID { get; set; }
        public string DataSource { get; set; }
    }
}
