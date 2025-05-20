using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PreHast.Server.Data;
using PreHast.Server.DTO;
using PreHast.Server.Models;

namespace PreHast.Server.Controllers
{
    [Authorize(Roles ="Admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class FragorsController : ControllerBase
    {
        private readonly PreHastDbContext _context;

        public FragorsController(PreHastDbContext context)
        {
            _context = context;
        }

        // GET: api/Fragors
        [HttpGet]
        public async Task<ActionResult<IEnumerable<FragorDto>>> GetFragors()
        {
            //اول اكشن هذا جلب البيانات من الجدول الاصلي 
            //لازم نخلي البيانات من الجدول الاصلي في متغير ونفتر عليه بلوب علمود نحوله للشكل الي نريده بالعرض
            //الشكل الي نريده بالعرض رح يكون FragorDto

            //1
            var items = await _context.Fragors.ToListAsync();

            //2 نجهز لست من FrgorDto ونحول البيانات الها
            List<FragorDto> itemsDto = [];
            foreach (var item in items)
            {
                List<SvarDto> svarDtos = [];
                svarDtos = await (from s in _context.Svars
                                  where s.FragorId == item.Id
                                  select new SvarDto
                                  {
                                      Id = s.Id,
                                      Name = s.Name,
                                      Description = s.Description,
                                      Degree = s.Degree,
                                      Sort = s.Sort,
                                      FragorId = s.FragorId
                                      
                                  }).OrderBy(i=>i.Sort).ToListAsync();

                itemsDto.Add(new()
                {
                    Id = item.Id,
                    Name = item.Name,
                    Description = item.Description,
                    Sort = item.Sort,
                    HasLeftRight = item.HasLeftRight,
                    SvarsDto = svarDtos//هنا لازم نجهز لست بالاجوبة المرتبطة بهذا السوال بس تكون ع شكل Dto
                });
            }
            //بعد ما يخلص اللوب ونخرج منه نرجع النتيجة النهائية 
            return itemsDto.OrderBy(i => i.Sort).ToList();
        }



        [HttpPut("{id}")]//التعديل
        public async Task<ActionResult<ApiResponse>> PutFragor(int id, FragorCrudDto fragorCrudDto)
        {
            if (id != fragorCrudDto.Id)
            {
                return new ApiResponse()
                {
                    Status = false,
                    Message = "An Error"
                };
            }
            Fragor? fragor=await _context.Fragors.FindAsync(fragorCrudDto.Id);
            if (fragor == null)
            {
                return new ApiResponse()
                {
                    Status = false,
                    Message = "Record Not Found In Database"
                };
            }
            List<Svar> svarsOld=await _context.Svars.Where(i=>i.FragorId==fragorCrudDto.Id).ToListAsync();
            try
            {
                _context.Svars.RemoveRange(svarsOld);
                await _context.SaveChangesAsync();
            
            List<Svar> svarsNew = [];


            foreach (var svarDto in fragorCrudDto.SvarsCrudDto)
            {
                svarsNew.Add(new()
                {
                    Name = svarDto.Name,
                    Description = svarDto.Description,
                    Degree = svarDto.Degree,
                    Sort = svarDto.Sort,
                
                });
            }
            fragor.Name = fragorCrudDto.Name;
            fragor.Description= fragorCrudDto.Description;
            fragor.Sort= fragorCrudDto.Sort;
            fragor.Svars= svarsNew;
            fragor.HasLeftRight = fragorCrudDto.HasLeftRight;

            _context.Entry(fragor).State = EntityState.Modified;

            
                await _context.SaveChangesAsync();
                return new ApiResponse()
                {
                    Status = true,
                    Message = "Done,Updated Data"
                };
            }
            catch 
            {
                return new ApiResponse()
                {
                    Status = false,
                    Message = "An Error Not Updated"
                };
            }
 
        }

        [HttpPost] //الاضافة
        public async Task<ActionResult<ApiResponse>> PostFragor(FragorCrudDto fragorCrudDto)
        {
            List<Svar> svars = [];
           
            
            foreach(var svarDto in fragorCrudDto.SvarsCrudDto)
            {
                svars.Add(new()
                {
                    Name=svarDto.Name,
                    Description=svarDto.Description,
                    Degree=svarDto.Degree,
                    Sort=svarDto.Sort
                 
                });
            }
            Fragor fragor = new()
            {
                Name=fragorCrudDto.Name,
                Description=fragorCrudDto.Description,
                Sort=fragorCrudDto.Sort,
                HasLeftRight=fragorCrudDto.HasLeftRight,
                Svars=svars
            };
            try
            {
                _context.Fragors.Add(fragor);
                await _context.SaveChangesAsync();
                return new ApiResponse()
                {
                    Status =true,
                    Message="Done,Adding New Data"
                };
            }
            catch
            {
                return new ApiResponse()
                {
                    Status = false,
                    Message = "An Error"
                };
            }

         
        }

        // DELETE: api/Fragors/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFragor(int id)
        {
            var fragor = await _context.Fragors.FindAsync(id);
            if (fragor == null)
            {
                return NotFound();
            }

            _context.Fragors.Remove(fragor);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool FragorExists(int id)
        {
            return _context.Fragors.Any(e => e.Id == id);
        }
    }
}
