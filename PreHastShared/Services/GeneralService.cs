using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using PreHast.Server.Data;
using PreHast.Server.DTO;
using PreHast.Server.Models;
using PreHastShared.Interfaces;

namespace PreHastShared.Services
{
    public class GeneralService : IGeneral
    {
        public readonly PreHastDbContext _context;
        private readonly UserManager<VardPersonal> _userManager;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly JWT _jwt;

        public GeneralService(PreHastDbContext context,
                  UserManager<VardPersonal> userManager,
                  IHttpContextAccessor httpContextAccessor, IOptions<JWT> jwt)
        {
            _context = context;
            _userManager = userManager;
            _jwt = jwt.Value;
            _httpContextAccessor = httpContextAccessor;
        }
 
        private static async Task<HowDto> GetUserInfo(string userid, PreHastDbContext _context, UserManager<VardPersonal> _userManager)
        {
            //   HowDto = GetUserInfo(b.ApplicationUserId, context,_userManager).GetAwaiter().GetResult()

            VardPersonal? applicationUser = await _userManager.FindByIdAsync(userid ?? "");
            HowDto howDto = new()
            {
                RankName = "",
                UnitName = "",
                UserName = ""
            };
            if (applicationUser is not null)
                howDto = new()
                {
                    RankName = await _context.Omfatnings.Where(i => i.Id == applicationUser.OmfatningId).Select(i => i.Name).FirstOrDefaultAsync() ?? "",
                    UserName = applicationUser.Name,
                    UnitName = await _context.Departments.Where(i => i.Id == applicationUser.DepartmentId).Select(i => i.Name).FirstOrDefaultAsync() ?? ""

                };

            return howDto;
        }
 

        public async Task<string> GetCurrentUserId()
        {
            var x = _httpContextAccessor?.HttpContext?.Request.Headers.Authorization.ToString().Split(' ')[1];
            if (!string.IsNullOrEmpty(x))
            {
                var principal = GetPrincipalFromExpiredToken(x);
                if (principal != null)
                {
                    var username = principal.Identity?.Name ?? "";
                    var user = await _userManager.FindByEmailAsync(username);
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
    }
}
