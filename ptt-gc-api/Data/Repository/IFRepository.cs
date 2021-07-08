using Microsoft.EntityFrameworkCore;
using NPOI.SS.Formula.Functions;
using PTT_GC_API.Data.Interface;
using PTT_GC_API.Models;
using PTT_GC_API.Models.IF;
using PTT_GC_API.Models.Initiative;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PTT_GC_API.Data.Repository
{
    public class IFRepository : IFInterface
    {
        private readonly DataContext _context;
        private readonly StoreProcedureInterface _storeProcedure;
        public IFRepository(DataContext context, StoreProcedureInterface storeProcedure)
        {
            _context = context;
            _storeProcedure = storeProcedure;
        }
        public async Task<bool> CAPEX_IF_001_SAPIM_CP(int initiativeId, DateTime nowDateTIme)
        {
            await InsertInitiativeIdToTempTable(initiativeId, "IF001");

            //startDateTime input only date  no need time !!!   eg.  '2020-06-29'
            DataTable datatable = await _storeProcedure.ExecuteReturnDatatable($"sp_CAPEX_IF_001_SAPIM_CP '{nowDateTIme.ToString("yyyy-MM-dd")}'");

            if (datatable.Rows.Count == 0) return false;

            string fileName = "IM-CPO-CP-1-" + nowDateTIme.Year.ToString() + "_" + nowDateTIme.ToString("ddMMyyyy") + ".txt";

            string myTableAsString = String.Join("\t", datatable.Columns.Cast<DataColumn>().
                                        Select(r => r.ColumnName).ToArray());

            myTableAsString += "\n";

            myTableAsString +=
                                    String.Join(Environment.NewLine, datatable.Rows.Cast<DataRow>().
                                        Select(r => r.ItemArray).ToArray().
                                        Select(x => String.Join("\t", x)));



            byte[] bytes = null;
            using (var ms = new MemoryStream())
            {
                TextWriter tw = new StreamWriter(ms, Encoding.UTF8);

                await tw.WriteAsync(myTableAsString);

                await tw.FlushAsync();
                ms.Position = 0;
                bytes = ms.ToArray();
                await ms.FlushAsync();

            }

            var _entityDelete = await _context.OutgoingFile.Where(i => i.FileName == fileName).ToListAsync();

            foreach (var entity in _entityDelete)
            {
                _context.OutgoingFile.Remove(entity);
            }

            _context.OutgoingFile.Add(new OutgoingFile
            {
                FileName = fileName,
                DirectoryPath = "OBJECTIVE",
                Data = bytes,
                CreateDate = nowDateTIme,
                CreateUser = "FRONTIS",
                UpdateDate = nowDateTIme,
                UpdateUser = "FRONTIS"

            });

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> CAPEX_IF_001_SAPIM_General(int initiativeId, DateTime nowDateTIme)
        {
            await InsertInitiativeIdToTempTable(initiativeId, "IF001");

            //startDateTime input only date  no need time !!!   eg.  '2020-06-29'
            DataTable datatable = await _storeProcedure.ExecuteReturnDatatable($"sp_CAPEX_IF_001_SAPIM_Genaral '{nowDateTIme:yyyy-MM-dd}'");

            if (datatable.Rows.Count == 0) return false;

            string fileName = "IM-CPO-File1-GeneralData-" + nowDateTIme.ToString("ddMMyyyy") + ".txt";

            string myTableAsString = String.Join("\t", datatable.Columns.Cast<DataColumn>().
                                        Select(r => r.ColumnName).ToArray());

            myTableAsString += "\n";

            myTableAsString +=
                                    String.Join(Environment.NewLine, datatable.Rows.Cast<DataRow>().
                                        Select(r => r.ItemArray).ToArray().
                                        Select(x => String.Join("\t", x)));



            byte[] bytes = null;
            using (var ms = new MemoryStream())
            {
                TextWriter tw = new StreamWriter(ms, Encoding.UTF8);

                await tw.WriteAsync(myTableAsString);

                await tw.FlushAsync();
                ms.Position = 0;
                bytes = ms.ToArray();
                await ms.FlushAsync();

            }

            var _entityDelete = await _context.OutgoingFile.Where(i => i.FileName == fileName).ToListAsync();

            foreach (var entity in _entityDelete)
            {
                _context.OutgoingFile.Remove(entity);
            }

            _context.OutgoingFile.Add(new OutgoingFile
            {
                FileName = fileName,
                DirectoryPath = "GENERALDATA",
                Data = bytes,
                CreateDate = nowDateTIme,
                CreateUser = "FRONTIS",
                UpdateDate = nowDateTIme,
                UpdateUser = "FRONTIS"

            });

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> CAPEX_IF_001_SAPIM_Monthly(int initiativeId, DateTime nowDateTIme)
        {
            await InsertInitiativeIdToTempTable(initiativeId, "IF001");

            //startDateTime input only date  no need time !!!   eg.  '2020-06-29'
            DataTable datatable = await _storeProcedure.ExecuteReturnDatatable($"sp_CAPEX_IF_001_SAPIM_Monthly '{nowDateTIme:yyyy-MM-dd}'");

            if (datatable.Rows.Count == 0) return false;

            string fileName = "IM-CPO-File3-MonthlyPlan-" + nowDateTIme.ToString("ddMMyyyy") + ".txt";

            string myTableAsString = String.Join("\t", datatable.Columns.Cast<DataColumn>().
                                        Select(r => r.ColumnName).ToArray());

            myTableAsString += "\n";

            myTableAsString +=
                                    String.Join(Environment.NewLine, datatable.Rows.Cast<DataRow>().
                                        Select(r => r.ItemArray).ToArray().
                                        Select(x => String.Join("\t", x)));



            byte[] bytes = null;
            using (var ms = new MemoryStream())
            {
                TextWriter tw = new StreamWriter(ms, Encoding.UTF8);

                await tw.WriteAsync(myTableAsString);

                await tw.FlushAsync();
                ms.Position = 0;
                bytes = ms.ToArray();
                await ms.FlushAsync();

            }

            var _entityDelete = await _context.OutgoingFile.Where(i => i.FileName == fileName).ToListAsync();

            foreach (var entity in _entityDelete)
            {
                _context.OutgoingFile.Remove(entity);
            }

            _context.OutgoingFile.Add(new OutgoingFile
            {
                FileName = fileName,
                DirectoryPath = "MONTHLYPLAN",
                Data = bytes,
                CreateDate = nowDateTIme,
                CreateUser = "FRONTIS",
                UpdateDate = nowDateTIme,
                UpdateUser = "FRONTIS"

            });

            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> CAPEX_IF_001_SAPIM_Yearly(int initiativeId, DateTime nowDateTIme)
        {
            await InsertInitiativeIdToTempTable(initiativeId, "IF001");
            //startDateTime input only date  no need time !!!   eg.  '2020-06-29'
            DataTable datatable = await _storeProcedure.ExecuteReturnDatatable($"sp_CAPEX_IF_001_SAPIM_Yearly '{nowDateTIme:yyyy-MM-dd}'");

            if (datatable.Rows.Count == 0) return false;

            string fileName = "IM-CPO-File2-YearlyPlan-" + nowDateTIme.ToString("ddMMyyyy") + ".txt";

            string myTableAsString = String.Join("\t", datatable.Columns.Cast<DataColumn>().
                                        Select(r => r.ColumnName).ToArray());

            myTableAsString += "\n";

            myTableAsString +=
                                    String.Join(Environment.NewLine, datatable.Rows.Cast<DataRow>().
                                        Select(r => r.ItemArray).ToArray().
                                        Select(x => String.Join("\t", x)));



            byte[] bytes = null;
            using (var ms = new MemoryStream())
            {
                TextWriter tw = new StreamWriter(ms, Encoding.UTF8);

                await tw.WriteAsync(myTableAsString);

                await tw.FlushAsync();
                ms.Position = 0;
                bytes = ms.ToArray();
                await ms.FlushAsync();

            }

            var _entityDelete = await _context.OutgoingFile.Where(i => i.FileName == fileName).ToListAsync();

            foreach (var entity in _entityDelete)
            {
                _context.OutgoingFile.Remove(entity);
            }

            _context.OutgoingFile.Add(new OutgoingFile
            {
                FileName = fileName,
                DirectoryPath = "YEARLYPLAN",
                Data = bytes,
                CreateDate = nowDateTIme,
                CreateUser = "FRONTIS",
                UpdateDate = nowDateTIme,
                UpdateUser = "FRONTIS"

            });
                        
            return await _context.SaveChangesAsync() > 0;
        }

        public async Task<bool> InsertInitiativeIdToTempTable(int InitiativeId, string IFtype)
        {
            var entityToDelete = await _context.TmpInitiativeIdIFs.Where(i => i.CreatedDate < DateTime.Now.Date).ToListAsync();

            foreach (var entity in entityToDelete)
            {
                _context.TmpInitiativeIdIFs.Remove(entity);
            }

            var checkDuplicate = await _context.TmpInitiativeIdIFs.Where(i => i.InitiativeId == InitiativeId && i.IFType == IFtype).ToListAsync();


            if (!checkDuplicate.Any())
            {
                await _context.TmpInitiativeIdIFs.AddAsync(
                new TmpInitiativeCodeIF
                {
                    InitiativeId = InitiativeId,
                    IFType = IFtype,
                    CreatedDate = DateTime.Now
                });
            }
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
