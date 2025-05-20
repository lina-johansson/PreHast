using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using PreHast.Server.Data;
using PreHast.Server.DTO;
using PreHast.Server.Models;
using PreHastShared.Interfaces;

namespace REASystem.Server.Controllers
{
    [AllowAnonymous]
    [Route("api/[controller]")]
 
    [ApiController]
    public class NewsController(PreHastDbContext context, IUser user) : ControllerBase
    {
        private readonly PreHastDbContext _context = context;
        private readonly IUser user = user;

        // GET: api/News
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CrudNews>>> GetNewses()
        {

            var x = await (from a in _context.Newses

                           select new CrudNews
                           {
                          Details = a.Details,
                          CanAll = a.CanAll,
                          Can=a.Can,
                          Id = a.Id,
                          ApplicationUserId =  a.ApplicationUserId,
                           }
                          ).ToListAsync();
            return x;
          
            
        }

        // GET: api/News/5
        [HttpGet("{id}")]
        public async Task<ActionResult<News>> GetNews(int id)
        { 
            var news = await _context.Newses.FindAsync(id);

            if (news == null)
            {
                return NotFound();
            }

            return news;
        }


        [HttpGet("GetAllNews")]
        public async Task<ActionResult<News>> GetAllNews()
        {
            var x = await (from a in _context.Newses

                           select new News
                           {
                               Details = a.Details,
                               CanAll = a.CanAll,
                               Can = a.Can,
                               Id = a.Id,
                               ApplicationUserId =  (from vard in _context.VardPersonals.Where(i=>i.Id==a.ApplicationUserId)
                                                     join o in _context.Omfatnings on vard.OmfatningId equals o.Id
                                                     select $"{o.Name} / {vard.Name}"
                                                     ).FirstOrDefault()??"",
                           }
                    ).ToListAsync();
            return Ok(x);

        }

       

        // PUT: api/News/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutNews(int id, CrudNews news)
        {

            news.ApplicationUserId = user.GetCurrentUserId().GetAwaiter().GetResult();
            News news1 = new()
            {
                Id = id,
                ApplicationUserId = news.ApplicationUserId,
                Can = news.Can,
                Details = news.Details,
                DateEntry=DateTime.Now,
            };
            if (id != news.Id)
            {
                return BadRequest();
            }

            _context.Entry(news1).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!NewsExists(id))
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

        // POST: api/News
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<News>> PostNews(CrudNews news)
        {

               news.ApplicationUserId =user.GetCurrentUserId().GetAwaiter().GetResult();

            News news1 = new()
            {
                ApplicationUserId = news.ApplicationUserId  /*"00271a83-77b9-46ee-a6d0-27ffe2222be9"*/,
                Can=news.Can,
                Details=news.Details,
                DateEntry=DateTime.Now,
            };
            _context.Newses.Add(news1);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                // Log the exception or handle it in some way
                Console.WriteLine($"Error saving changes: {ex.Message}");
                // Optionally, rethrow the exception if needed
                // throw;
            }


            return CreatedAtAction("GetNews", new { id = news.Id }, news);
        }

        // DELETE: api/News/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNews(int id)
        {
            var news = await _context.Newses.FindAsync(id);
            if (news == null)
            {
                return NotFound();
            }

            _context.Newses.Remove(news);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool NewsExists(int id)
        {
            return _context.Newses.Any(e => e.Id == id);
        }

       


       
    }


   
}
