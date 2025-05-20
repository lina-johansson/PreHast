using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PreHast.Server.DTO;
using PreHastShared.Interfaces;

namespace PreHast.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GeneralApi(IGeneral general) : ControllerBase
    {
        private readonly IGeneral _general = general;


        
    }
}
