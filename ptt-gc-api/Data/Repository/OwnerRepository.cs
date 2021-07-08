using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PTT_GC_API.Data.Interface;
using PTT_GC_API.Dtos.MaxApprover;
using PTT_GC_API.Helpers;
using PTT_GC_API.Models.Owner;

namespace PTT_GC_API.Data.Repository
{
    public class OwnerRepository : OwnerInterface
    {
        private readonly DataContext _context;
        public OwnerRepository(DataContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<Owner>> GetList([FromQuery]OwnerParams OwnerParams)
        {
            var owners= _context.Owners.AsQueryable();

            if (!string.IsNullOrEmpty(OwnerParams.Text))
            {
                owners = owners.Where(c => c.OwnerName.Contains(OwnerParams.Text));
            }

            owners = owners.OrderBy(c => c.OwnerName).Take(50);

            await owners.ToListAsync();

            return owners;
        }

        public async Task<IEnumerable<Owner>> GetEmailList([FromQuery]OwnerParams OwnerParams)
        {
            var owner = await _context.Owners.Where(o => o.Email == OwnerParams.Text).ToListAsync();
            return owner;
        }

        public async Task<Owner> GetName([FromQuery]OwnerParams OwnerParams)
        {
            var owner = await _context.Owners.Where(o => o.OwnerName == OwnerParams.Text).FirstOrDefaultAsync();
            return owner;
        }

        public async Task<Owner> GetEmail([FromQuery]OwnerParams OwnerParams)
        {
            var owner = await _context.Owners.Where(o => o.Email == OwnerParams.Text).FirstOrDefaultAsync();
            return owner;
        }

        public async Task<Owner> GetUser(string username)
        {
            var owner = await _context.Owners.Where(o => o.Email == username).FirstOrDefaultAsync();
            return owner;
        }

        public async Task<Owner> GetNameMaxApprover(NameMaxApprover NameMaxApprover)
        {
            var owner = await _context.Owners.Where(o => o.Email == NameMaxApprover.Email).FirstOrDefaultAsync();
            return owner;
        }

        public async Task<List<string>> GetOwnerName()
        {
            return  await _context.Owners.Where(o => o.OwnerName != "").OrderBy(o => o.OwnerName).Select(o => o.EmployeeID).ToListAsync();
        }

        public async Task<Owner> GetVP([FromQuery]OwnerParams OwnerParams)
        {
            var owner = await _context.Owners.Where(o => o.OwnerName == OwnerParams.Text).FirstOrDefaultAsync();
            return owner;
        }

    }
}