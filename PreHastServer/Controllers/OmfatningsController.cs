using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PreHast.Server.Data;
using PreHast.Server.Models;

namespace PreHast.Server.Controllers
{
    [AllowAnonymous]
    [Route("api/[controller]")]
    [ApiController]
    public class OmfatningsController : ControllerBase
    {
        private readonly PreHastDbContext _context;

        public OmfatningsController(PreHastDbContext context)
        {
            _context = context;
        }

        // GET: api/Omfatnings
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Omfatning>>> GetOmfatning()
        {
            return await _context.Omfatnings.ToListAsync();
        }

        // GET: api/Omfatnings/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Omfatning>> GetOmfatning(int id)
        {
            var omfatning = await _context.Omfatnings.FindAsync(id);

            if (omfatning == null)
            {
                return NotFound();
            }

            return omfatning;
        }

        // PUT: api/Omfatnings/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOmfatning(int id, Omfatning omfatning)
        {
            if (id != omfatning.Id)
            {
                return BadRequest();
            }

            _context.Entry(omfatning).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!OmfatningExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Omfatnings
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Omfatning>> PostOmfatning(Omfatning omfatning)
        {
            _context.Omfatnings.Add(omfatning);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetOmfatning", new { id = omfatning.Id }, omfatning);
        }

        // DELETE: api/Omfatnings/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOmfatning(int id)
        {
            var omfatning = await _context.Omfatnings.FindAsync(id);
            if (omfatning == null)
            {
                return NotFound();
            }

            _context.Omfatnings.Remove(omfatning);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool OmfatningExists(int id)
        {
            return _context.Omfatnings.Any(e => e.Id == id);
        }
    }
}
