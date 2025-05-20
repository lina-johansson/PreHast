
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PreHast.Server.Data;
using PreHast.Server.DTO;
using PreHast.Server.Models;
using PreHastShared.Interfaces;

namespace PreHast.Server.Controllers
{
    [AllowAnonymous]
    [Route("api/[controller]")]
    [ApiController]
    public class GetspTableController : ControllerBase
    {
        private readonly  PreHastDbContext _context;

        public GetspTableController(PreHastDbContext context)
        {
            _context = context;
        }


         
        [HttpGet("GetAllUnit")]

        public async Task<ActionResult<List<ClsKeyValue>>> GetAllUnit()
        {

                                List<ClsKeyValue> x = await (from u in _context.Departments
                                                               select new ClsKeyValue
                                                               {
                                                                   Key = u.Id,
                                                                   Value = u.Name ?? ""
                                                               }).ToListAsync();
                                return x;



        }
 

   
 


 

          

        

    }
}
