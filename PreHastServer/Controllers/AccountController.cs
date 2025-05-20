
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PreHast.Server.Data;
using PreHast.Server.DTO;
using PreHast.Server.Models;
using PreHastShared.Interfaces;
 

namespace PreHast.Server.Controllers
{
    [Authorize(Roles = "Admin,Manager")]
    [Route("api/[controller]")]
    [ApiController]

    public class AccountController(IUser user, SignInManager<VardPersonal> signInManager, UserManager<VardPersonal> userManager, PreHastDbContext context ) : ControllerBase
    {
        private readonly IUser _User = user;
        private readonly SignInManager<VardPersonal> _signInManager = signInManager;
        private readonly UserManager<VardPersonal> _userManager = userManager;
        private readonly PreHastDbContext _context = context;





        [AllowAnonymous]
        [HttpPut("{id}")]
        public async  Task<bool> PutUser( string id,CrudVardPersonal dto)
        {
          
            return await _User.UpdateUserAsync(id, dto);
        }

        [AllowAnonymous]
        [HttpPost("LockInOut/{id}")]
        public async Task<bool> LockInOut(string? id)
        {
            if(!string.IsNullOrEmpty(id))
            return await _User.LockInOutAsync(id);
            return false;
        }


        [AllowAnonymous]
        [HttpPost("ResetPassword/{id}")]
        public async Task<bool> ResetPassword(string? id)
        {
            if (!string.IsNullOrEmpty(id))
                return await _User.SetPasswordAsync(id);
            return false;
        }
        [AllowAnonymous]
        [HttpPost("PasswordNew")]
        public async Task<string> PasswordNew(resetPass resPass )
        {

            return await _User.SetPasswordNewAsync(resPass );
             
        }
        // DELETE: api/accunt/5
        [AllowAnonymous]
        [HttpDelete("{id}")]
        public async Task<ActionResult<bool>> DeleteUsers(string id)
        {
            var users = await _context.VardPersonals.FindAsync(id);
            if (users == null)
            {
                return false;
            }

            _context.VardPersonals.Remove(users);
            await _context.SaveChangesAsync();

            return true;
        }

      

    
        [HttpGet("GetAllUser")]
         
        public async Task<List<ListVardPersonal>> GetAllUser()
        {
            var x =   await(  from a in _context.VardPersonals 
                         
                            select new  ListVardPersonal
                           {
                              Id= a.Id, 
                              OmfatningName = _context.Omfatnings.Where(i => i.Id == a.OmfatningId).Select(i => i.Name).FirstOrDefault() ?? "",
                              PersonNo = a.PersonNo,
                              OmfatningId = a.OmfatningId,
                              DepartmentName = _context.Departments.Where(i => i.Id == a.DepartmentId).Select(i => i.Name).FirstOrDefault() ?? "",
                              DepartmentId = a.DepartmentId,
                              Name = a.Name,
                              Email = a.Email??"",
                              PersonPosition = a.PersonPosition,
                              PhoneNumber = a.PhoneNumber,
                              Created_date=a.Created_date,
                              Created_by= _context.VardPersonals.Where(i => i.Id == a.Created_by!).Select(i => i.Name).FirstOrDefault() ?? "",
                              Updated_by= _context.VardPersonals.Where(i=> i.Id == a.Updated_by!).Select(i=>i.Name).FirstOrDefault()??"",
                              Updated_date=a.Updated_date,
                              LastLogin=a.LastLogin,
                              LockoutEnabled=a.LockoutEnabled,
                              LockoutEnabledDate=a.LockoutEnd,
                             
                           }).ToListAsync();
                           
            return x;
        }

        [AllowAnonymous]
        [HttpGet("GetAllRole")]
        public async Task<List<RoleWithUserDto>> GetAllRole(string? userId)
        {
            
          

            List<RoleWithUserDto> x = [];
            if (string.IsNullOrEmpty(userId))
            {
                  x = await ( from a in _context.ApplicationRoles
                                            select new RoleWithUserDto
                                            {
                                                RoleId = a.Id,
                                                RoleName =a.Name??"",
                                                RoleNameSW =a.RoleNameSW,
                                                IsSelected = false
                                            }).ToListAsync();
                 

            }

            else
            {
                IEnumerable<string> Roles = [];
                var user = await _context.VardPersonals.FindAsync(userId);
                if (user is not null)
                {
                    Roles = await _userManager.GetRolesAsync(user);
                    x = await (from a in _context.ApplicationRoles
                               select new RoleWithUserDto
                               {
                                   RoleId = a.Id,
                                   RoleName = a.Name ?? "",
                                   RoleNameSW = a.RoleNameSW,
                                   IsSelected =GetUserInRole(Roles,a.Name)
                               }).ToListAsync();
                   
                }

              
            }

            return x;

        }

        private static bool GetUserInRole(IEnumerable<string> roles, string? name)
        {
            return roles.Any(i => i == name);
        }



        [AllowAnonymous]
        [HttpPost]
        public async Task<ActionResult<bool>>RegisterUser(CrudVardPersonal dto)
        {
           // if (dto.Password != dto.ConfiremPassword) return false;
            if(ModelState.IsValid) 
              return Ok(await _User.CreateUserAsync(dto));

            return false;
        }



        [AllowAnonymous]
        [HttpPost("logout")]
        public async Task<ActionResult<bool>> Logout()
        {
             await _signInManager.SignOutAsync();
            return true;
        }
        [AllowAnonymous]
        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody]  LoginDto dto)
        {
            
            var result= await _User.LoginAsync(dto);

         
                if (!string.IsNullOrEmpty(result.Message))
                {
                    return Ok(result);
                }
                return BadRequest(result.Message);

        
            
        }


  

        [AllowAnonymous]
        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshToken(RefreshTokenRequest model)
        {
            try
            {
                 
                var newToken = await _User.RefreshTokenAsync(model);
                return Ok(new { token = newToken });
            }
            catch (SecurityTokenException ex)
            {
                return Unauthorized(new { message = ex.Message });
            }
           
        }
 

       


        [HttpGet("reader")]
        [Authorize(Roles = "Reader")]
        public ActionResult<string> GetReader()
        {
            return Ok("Reader Role");
        }
        [AllowAnonymous]
        [HttpGet("GetAllOmfatnings")]

        public async Task<ActionResult<List<ClsValueLabel>>> GetAllOmfatnings()
        {
          var x= await (from r in _context.Omfatnings
                        select new ClsValueLabel
                        { 
                      
                          Label = r.Name,
                          Value=r.Id

                      }).ToListAsync();
            
            return Ok(x);
 
        }


        [AllowAnonymous]
        [HttpGet("Departments")]
        public async Task<ActionResult<List<ClsValueLabel>>> Departments()
        {



            List<ClsValueLabel> x = await (from m in _context.Departments
                                            select new ClsValueLabel
                                            {
                                                  Value  = m.Id,
                                                 Label = m.Name,

                                            }).ToListAsync();

            return (x);

        }
    }
}
