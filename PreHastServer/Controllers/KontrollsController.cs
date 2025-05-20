using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Runtime.Intrinsics.X86;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using PreHast.Server.Data;
using PreHast.Server.DTO;
using PreHast.Server.Models;

namespace PreHast.Server.Controllers
{
    [Authorize(Roles = "Admin,Doctors,Nurses")]
    [Route("api/[controller]")]
    [ApiController]
    public class KontrollsController : ControllerBase
    {
        private readonly PreHastDbContext _context;
        private readonly SignInManager<VardPersonal> signInManager;
        private readonly IConfiguration config;
        private readonly JWT _jwt;
        private readonly UserManager<VardPersonal> userManager;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public KontrollsController(PreHastDbContext context
            , SignInManager<VardPersonal> signInManager,
            IConfiguration config,
             IOptions<JWT> jwt,
                UserManager<VardPersonal> userManager,
             IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _context = context;
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.config = config;
            _jwt = jwt.Value;
            _httpContextAccessor = httpContextAccessor;
        }

        // GET: api/Kontrolls
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PatientDto>>> GetPatients()
        {
           List<PatientDto> patients=await(from P in _context.Patients
                                             select new PatientDto
                                             {
                                                 Id = P.Id,
                                                 Name = P.Name,
                                                 PersonNummer=P.PersonNummer,
                                             }).ToListAsync();
            return  patients;                                
        }

        [HttpGet("GetPatientKontroll/{PatienId}")]
        public async Task<ActionResult<PatientKotroll>> GetPatientKontroll(int PatienId)
        {
            PatientKotroll? patient = await (from P in _context.Patients
                                             where P.Id==PatienId
                                             select new PatientKotroll
                                             {
                                                 PatientData = new()
                                                 {
                                                     Id = P.Id,
                                                     Name = P.Name,
                                                     PersonNummer = P.PersonNummer
                                                 },
                                                 PatientTests = GetHistoryTest(_context, PatienId).GetAwaiter().GetResult(),
                                             }).FirstOrDefaultAsync();
            return patient ?? new();
        }

        private async Task<List<PatientTest>> GetHistoryTest(PreHastDbContext context, int patienId)
        {
            List<PatientTest> patientTests = [];
            patientTests=await(from fn in context.FinalKontrolls
                 where fn.PatientId==patienId
                 let Vard= context.VardPersonals.Where(i => i.Id == fn.VardpersonalId).FirstOrDefault()
                 select new PatientTest
                 {
                    Id=fn.Id,
                    TestDate=fn.Datum.ToString("dd/MM/yyyy hh:mm"),
                    TestDegree=fn.Sum,
                    Notc=fn.Note??"",
                     VardData = new()
                     {
                         VardId=fn.VardpersonalId,
                         VardName=Vard.Name,
                         VardOmfatning=context.Omfatnings.Where(i=>i.Id==Vard.OmfatningId).Select(i=>i.Name).FirstOrDefault()??"",
                     }
                    
                 }).ToListAsync();
                 
            return [.. patientTests.OrderByDescending(i => i.TestDate)];
        }

        [HttpGet("GetPatientKontrollToCreate/{PatienId}/{FinallKonId}")]
        public async Task<ActionResult<PatientKotrollCreate>> GetPatientKontrollToCreate(int PatienId, int FinallKonId)
        {
            string VardLoggedId = await GetCurrentUserId();
            VardPersonal? vardPersonal = await _context.VardPersonals.FindAsync(VardLoggedId);
            if (vardPersonal == null)
                return NotFound();

            string OmfatningName = await _context.Omfatnings
                .Where(i => i.Id == vardPersonal.OmfatningId)
                .Select(i => i.Name)
                .FirstOrDefaultAsync() ?? "";

            try
            {
                PatientKotrollCreate patient;

                if (FinallKonId == 0)
                {
                    var p = await _context.Patients
                        .Where(p => p.Id == PatienId)
                        .FirstOrDefaultAsync();

                    if (p == null) return NotFound();

                    patient = new PatientKotrollCreate
                    {
                        Id = 0,
                        Sent = false,
                        SumSvar = 0,
                        Notc = string.Empty,
                        Date = DateTime.Now.ToString("dd/MM/yyyy hh:mm"),
                        PatientData = new()
                        {
                            Id = p.Id,
                            Name = p.Name,
                            PersonNummer = p.PersonNummer
                        },
                        VardData = new()
                        {
                            VardId = vardPersonal.Id,
                            VardName = vardPersonal.Name,
                            VardOmfatning = OmfatningName
                        }
                    };
                }
                else
                {
                    var query = await (from fn in _context.FinalKontrolls
                                       join k in _context.Kontrolls on fn.Id equals k.FinalKontrollId
                                       join p in _context.Patients on fn.PatientId equals p.Id
                                       where fn.Id == FinallKonId
                                       select new
                                       {
                                           fn,
                                           p
                                       }).FirstOrDefaultAsync();

                    if (query == null) return NotFound();

                    string Vard = string.Empty;
                    string Omfatining = string.Empty;


                    VardPersonal? vardPersonal2 = await _context.VardPersonals.FindAsync(query.fn.VardpersonalId);
                    if (vardPersonal2 != null)
                    {
                        Vard = vardPersonal2.Name;
                        Omfatining= await _context.Omfatnings
                        .Where(i => i.Id == vardPersonal2.OmfatningId)
                        .Select(i => i.Name)
                        .FirstOrDefaultAsync() ?? "";
                    }

                    

                    patient = new PatientKotrollCreate
                    {
                        Id = query.fn.Id,
                        Sent = false,
                        SumSvar = query.fn.Sum,
                        Date = query.fn.Datum.ToString("dd/MM/yyyy hh:mm"),
                        PatientData = new()
                        {
                            Id = query.p.Id,
                            Name = query.p.Name,
                            PersonNummer = query.p.PersonNummer
                        },
                        VardData = new()
                        {
                            VardId = query.fn.VardpersonalId,
                            VardName = Vard,
                            VardOmfatning = Omfatining
                        }
                    };
                }

                // Call method separately AFTER the main LINQ query
                patient.Fragors = await GetFragorAndSvarsToCreate(_context, PatienId, FinallKonId);
                return patient;
            }
            catch (Exception ex)
            {
                // Consider logging ex.Message or ex.ToString() for debugging
                throw;
            }
        }


        private static async Task<List<FragorToCreate>> GetFragorAndSvarsToCreate(PreHastDbContext context, int patienId,int FinallKonId)
        {
            List<FragorToCreate> ListFragor = [];
            ListFragor = await (from f in context.Fragors
                                orderby f.Sort
                                select new FragorToCreate
                                {
                                    Id = f.Id,
                                    Name = f.Name,
                                    Description = f.Description,
                                    Sort = f.Sort,
                                    HasLeftRight = f.HasLeftRight,
                                    Svars = new(),
                                    SvarAnswerLeft = 0,
                                    SvarAnswerRight = 0,
                                    ManyAnswers = new()

                                }).ToListAsync();

            if (FinallKonId == 0)
            {
               
                foreach (var item in ListFragor)
                {

                    item.Svars.AddRange(await (from s in context.Svars
                                               where s.FragorId == item.Id
                                               orderby s.Sort
                                               select new SvarDto
                                               {
                                                   Id = s.Id,
                                                   Name = s.Name,
                                                   Description = s.Description,
                                                   Degree = s.Degree,
                                                   FragorId = item.Id,
                                                   Sort = s.Sort


                                               }).ToListAsync());
                    if (item.Svars.Count > 0 )
                    {
                        int svarId= item.Svars.Where(i => i.Degree == 0).Select(i => i.Id).FirstOrDefault();
                        if (!item.HasLeftRight)
                            item.SvarAnswerLeft = svarId;

                        else
                        {
                            
                                item.ManyAnswers.Add(new()
                                {
                                    SvarAnswerLeft = svarId,
                                    SvarAnswerRight = svarId
                                });
                             
                        }
                             
                    }



                }

                return ListFragor;
            }
            else
            {
                List<Kontroll> kontrolls = [];

                foreach (var item in ListFragor)
                {
                 List<Kontroll>? kontroll=  await (from f in context.Fragors
                                             join s in context.Svars on f.Id equals s.FragorId
                                             join k in context.Kontrolls on s.Id equals k.SvarId
                                             join fn in context.FinalKontrolls on k.FinalKontrollId equals fn.Id
                                             where f.Id == item.Id && fn.Id==FinallKonId
                                             select k).ToListAsync();
                     

                    item.Svars.AddRange(await (from s in context.Svars
                                               where s.FragorId == item.Id
                                               orderby s.Sort
                                               select new SvarDto
                                               {
                                                   Id = s.Id,
                                                   Name = s.Name,
                                                   Description = s.Description,
                                                   Degree = s.Degree,
                                                   FragorId = item.Id,
                                                   Sort = s.Sort
                                               }).ToListAsync());

                    if (kontroll is not null)
                    {
                        if (item.HasLeftRight)
                        { 
                            foreach(var item2 in kontroll)
                            {
                                item.ManyAnswers.Add(new()
                                {
                                    SvarAnswerLeft= item2.SelectedSvarLeft?item2.SvarId:0,
                                    SvarAnswerRight= item2.SelectedSvarRight ? item2.SvarId : 0
                                });
                            }
                         
                        }
                        else
                        {
                            var firstKontroll = kontroll.FirstOrDefault();
                            if (firstKontroll != null && firstKontroll.SelectedSvarLeft)
                                item.SvarAnswerLeft = firstKontroll.SvarId;
                        }
                    }



                }
                return ListFragor;
            }
        }

        [HttpPost]
        public async Task<ResponseStatus> PostData(PatientKotrollCreate dto)
        {
            FinalKontroll finalKontroll = new();
            List<Kontroll> Kontrolls = [];
            int Sum=0;
            try
            {
                foreach (var item in dto.Fragors)
                {
                    if (item.HasLeftRight)
                    {
                        foreach(var subsvar in item.ManyAnswers)
                        {
                            if (subsvar.SvarAnswerLeft != 0 && subsvar.SvarAnswerRight != 0 && subsvar.SvarAnswerLeft == subsvar.SvarAnswerRight)
                            {
                                Sum += await _context.Svars.Where(i => i.Id == subsvar.SvarAnswerLeft).Select(i => i.Degree).FirstOrDefaultAsync() * 2;

                                Kontrolls.Add(new()
                                {
                                    SvarId = subsvar.SvarAnswerLeft,
                                    SelectedSvarLeft = true,
                                    SelectedSvarRight = true

                                });

                            }
                            else if (subsvar.SvarAnswerLeft != 0 && subsvar.SvarAnswerLeft != subsvar.SvarAnswerRight)
                            {
                                Sum += await _context.Svars.Where(i => i.Id == subsvar.SvarAnswerLeft).Select(i => i.Degree).FirstOrDefaultAsync();

                                Kontrolls.Add(new()
                                {
                                    SvarId = subsvar.SvarAnswerLeft,
                                    SelectedSvarLeft = true,
                                    SelectedSvarRight = false

                                });

                            }
                            else if (subsvar.SvarAnswerRight != 0 && subsvar.SvarAnswerRight != subsvar.SvarAnswerLeft)
                            {
                                Sum += await _context.Svars.Where(i => i.Id == subsvar.SvarAnswerRight).Select(i => i.Degree).FirstOrDefaultAsync();

                                Kontrolls.Add(new()
                                {
                                    SvarId = subsvar.SvarAnswerRight,
                                    SelectedSvarLeft = false,
                                    SelectedSvarRight = true

                                });
                            }
                        }
                
                
                    }
                    else if (item.SvarAnswerLeft != 0 )
                    {

                        Sum += await _context.Svars.Where(i => i.Id == item.SvarAnswerLeft).Select(i => i.Degree).FirstOrDefaultAsync();

                        if (item.SvarAnswerLeft != 0)
                        {
                            Kontrolls.Add(new()
                            {
                                SvarId=item.SvarAnswerLeft,
                                SelectedSvarLeft=true,
                                SelectedSvarRight=false

                            });
                        }
                    }
                
                }
                finalKontroll.Datum = DateTime.Now;
                finalKontroll.PatientId=dto.PatientData.Id;
                finalKontroll.VardpersonalId=dto.VardData.VardId;
                finalKontroll.Note=dto.Notc;
                finalKontroll.Sum=Sum;
                finalKontroll.Kontrolls=Kontrolls;

                if(dto.Sent && !string.IsNullOrEmpty(dto.VardToSent))
                {
                    List<DoctorFinalKontroll> doctorFinalKontrolls = [];
                    doctorFinalKontrolls.Add(new()
                    {
                        Seen = false,
                        VardpersonalId = dto.VardToSent
                    });
                    finalKontroll.DoctorFinalKontrolls.AddRange(doctorFinalKontrolls);
                }
                _context.FinalKontrolls.Add(finalKontroll);
                await _context.SaveChangesAsync();

                return new()
                {
                    Message="done",
                    Success=true,
                    StatusCode=200
                };
            }
            catch (Exception ex)
            {
                return new()
                {
                    Message = "Failed To Add Data",
                    StatusCode = 0,
                };
            }



           
        }

        [HttpPut("{id}")]//التعديل
        public async Task<ResponseStatus> PutData(int id, PatientKotrollCreate dto)
        {
            string VardLoggedId = await GetCurrentUserId();
            VardPersonal? vardPersonal = await _context.VardPersonals.FindAsync(VardLoggedId);
           
               
            if (dto.Id!=id || id==0 || dto.Id==0 || vardPersonal == null)
                return new()
                {
                    Message = "Failed To Update Data",
                    StatusCode = 0,
                };

            FinalKontroll? finalKontroll =await _context.FinalKontrolls.Where(i=>i.Id==dto.Id).Include(i=>i.Kontrolls).Include(i=>i.DoctorFinalKontrolls).FirstOrDefaultAsync();
            if (finalKontroll is null)
                return new()
                {
                    Message = "Failed To Update Data",
                    StatusCode = 0,
                };

             
         


            List<Kontroll> Kontrolls = [];
       
        
            if(finalKontroll.Kontrolls.Count != 0)
            _context.Kontrolls.RemoveRange(Kontrolls);
            if (finalKontroll.DoctorFinalKontrolls.Count != 0)
                _context.DoctorFinalKontrolls.RemoveRange(finalKontroll.DoctorFinalKontrolls);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw;
            }
            int Sum = 0;
            try
            {
                foreach (var item in dto.Fragors.ToList())
                {
                    if (item.HasLeftRight)
                    {

                        if (item.HasLeftRight)
                        {
                            foreach (var subsvar in item.ManyAnswers)
                            {
                                if (subsvar.SvarAnswerLeft != 0 && subsvar.SvarAnswerRight != 0 && subsvar.SvarAnswerLeft == subsvar.SvarAnswerRight)
                                {
                                    Sum += await _context.Svars.Where(i => i.Id == subsvar.SvarAnswerLeft).Select(i => i.Degree).FirstOrDefaultAsync() * 2;

                                    Kontrolls.Add(new()
                                    {
                                        SvarId = subsvar.SvarAnswerLeft,
                                        SelectedSvarLeft = true,
                                        SelectedSvarRight = true

                                    });

                                }
                                else if (subsvar.SvarAnswerLeft != 0 && subsvar.SvarAnswerLeft != subsvar.SvarAnswerRight)
                                {
                                    Sum += await _context.Svars.Where(i => i.Id == subsvar.SvarAnswerLeft).Select(i => i.Degree).FirstOrDefaultAsync();

                                    Kontrolls.Add(new()
                                    {
                                        SvarId = subsvar.SvarAnswerLeft,
                                        SelectedSvarLeft = true,
                                        SelectedSvarRight = false

                                    });

                                }
                                else if (subsvar.SvarAnswerRight != 0 && subsvar.SvarAnswerRight != subsvar.SvarAnswerLeft)
                                {
                                    Sum += await _context.Svars.Where(i => i.Id == subsvar.SvarAnswerRight).Select(i => i.Degree).FirstOrDefaultAsync();

                                    Kontrolls.Add(new()
                                    {
                                        SvarId = subsvar.SvarAnswerRight,
                                        SelectedSvarLeft = false,
                                        SelectedSvarRight = true

                                    });
                                }
                            }


                        }
                    }
                    else if(item.SvarAnswerLeft!=0)
                    {
                        Sum += await _context.Svars.Where(i => i.Id == item.SvarAnswerLeft).Select(i => i.Degree).FirstOrDefaultAsync();

                        if (item.SvarAnswerLeft != 0)
                        {
                            Kontrolls.Add(new()
                            {
                                SvarId = item.SvarAnswerLeft,
                                SelectedSvarLeft = true,
                                SelectedSvarRight = false

                            });
                        }
                    }

                }


                    finalKontroll.Datum = DateTime.Now;
                    finalKontroll.PatientId = dto.PatientData.Id;
                    finalKontroll.VardpersonalId = VardLoggedId;
                    finalKontroll.Note = dto.Notc;
                    finalKontroll.Sum = Sum;
                    finalKontroll.Kontrolls = Kontrolls;

               
                if (dto.Sent && !string.IsNullOrEmpty(dto.VardToSent))
                {
                    List<DoctorFinalKontroll> doctorFinalKontrolls = [];
                    doctorFinalKontrolls.Add(new()
                    {
                        Seen = false,
                        VardpersonalId=dto.VardToSent
                    });
                    finalKontroll.DoctorFinalKontrolls=doctorFinalKontrolls;
                }

                _context.Attach(finalKontroll);
                _context.Entry(finalKontroll).State = EntityState.Modified;
                try
                {
                    await _context.SaveChangesAsync();
                }
                catch (Exception ex)
                {
                    throw;
                }

                return new()
                {
                    Message = "Update Report",
                    Success = true,
                    StatusCode = 200
                };
            }
            catch (Exception ex)
            {
                return new()
                {
                    Message = "Failed To Update Data",
                    StatusCode = 0,
                };
            }
        }
        private async Task<string> GetCurrentUserId()
        {
            var x = _httpContextAccessor?.HttpContext?.Request.Headers.Authorization.ToString().Split(' ')[1];
            if (!string.IsNullOrEmpty(x))
            {
                var principal = GetPrincipalFromExpiredToken(x);
                if (principal != null)
                {
                    var username = principal.Identity?.Name ?? "";
                    var user = await userManager.FindByEmailAsync(username);
                    if (user != null)
                        return user.Id ?? "";


                }

            }
            return "";
        }
        private ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwt.Key)),
                ValidateLifetime = false // No need to validate lifetime since it's handled in JWT middleware
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken securityToken);

            var jwtSecurityToken = securityToken as JwtSecurityToken;
            if (jwtSecurityToken == null || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
                throw new SecurityTokenException("Invalid token");

            return principal;
        }

        [HttpGet("GetVards")] 
        public async Task<List<KontrollVard>> GetVard()
        {
           IList<VardPersonal> vardPersonalsDectors=await userManager.GetUsersInRoleAsync("Doctors");
            List<KontrollVard> kontrollVards = [];
            

            kontrollVards=await (from v in _context.VardPersonals
             join o in _context.Omfatnings on v.OmfatningId equals o.Id
             
             where !string.IsNullOrEmpty(v.Email) 
             select new KontrollVard
             {
                 VardId=v.Id,
                 Rsid =  v.Email,
                 VardName = v.Name,
                 VardOmfiting = o.Name,
                 VardIsActive = true
             }).ToListAsync();

            return kontrollVards.Where(j => vardPersonalsDectors.Any(i => i.Id == j.VardId)).ToList();
        }
        [HttpGet("GetDoctorTests")]
        public async Task<DectorTest> GetDoctorTests()
        {
            string VardLoggedId = await GetCurrentUserId();
            VardPersonal? vardPersonal = await _context.VardPersonals.FindAsync(VardLoggedId);
            if (vardPersonal == null)
                return new();

            try
            {
                string OmfatningName = await _context.Omfatnings
                    .Where(i => i.Id == vardPersonal.OmfatningId)
                    .Select(i => i.Name)
                    .FirstOrDefaultAsync() ?? "";

                DectorTest dectorTest = new()
                {
                    KontrollVard = new()
                    {
                        VardId = vardPersonal.Id,
                        Rsid = vardPersonal.Email,
                        VardName = vardPersonal.Name,
                        VardOmfiting = OmfatningName,
                        VardIsActive = true
                    },
                    PatientsTests = []
                };

                // Fetch raw data without calling ToString() inside the query
                var patientData = await (from fn in _context.FinalKontrolls
                                         join d in _context.DoctorFinalKontrolls on fn.Id equals d.FinalKontrollId
                                         join v in _context.VardPersonals on d.VardpersonalId equals v.Id
                                         where v.Id == vardPersonal.Id
                                         select new
                                         {
                                             fn.Id,
                                             fn.PatientId,
                                             fn.Datum,
                                             fn.Note,
                                             fn.Sum,
                                             fn.VardpersonalId
                                         }).OrderByDescending(i => i.Datum).ToListAsync();

                foreach (var item in patientData)
                {
                    var vardData = await (from v in _context.VardPersonals
                                          join o in _context.Omfatnings on v.OmfatningId equals o.Id
                                          where v.Id == item.VardpersonalId
                                          select new VardData
                                          {
                                              VardId = v.Id,
                                              VardName = v.Name,
                                              VardOmfatning = o.Name
                                          }).FirstOrDefaultAsync();

                    dectorTest.PatientsTests.Add(new PatientTest
                    {
                        Id = item.Id,
                        PatientId = item.PatientId,
                        TestDate = item.Datum.ToString("dd/MM/yyyy hh:mm"), // Safely outside LINQ
                        Notc = item.Note ?? "",
                        TestDegree = item.Sum,
                        VardData = vardData ?? new VardData()
                    });
                }

                return dectorTest;
            }
            catch (Exception ex)
            {
                throw;
            }
        }



    }
}
