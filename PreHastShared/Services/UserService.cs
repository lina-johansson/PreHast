
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
 
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using PreHast.Server.DTO;
using PreHast.Server.Models;
using PreHast.Server.Data;
using Microsoft.JSInterop.Infrastructure;
using PreHastShared.Interfaces;



namespace PreHastShared.Services
{
    public class UserService :  IUser
    {
   
        private readonly SignInManager<VardPersonal> signInManager;
        private readonly PreHastDbContext _context;
        private readonly IConfiguration config;
        private readonly JWT _jwt;
        private readonly UserManager<VardPersonal> userManager;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public UserService(
            PreHastDbContext context,
         
            SignInManager<VardPersonal> signInManager,
            IConfiguration config,
             IOptions<JWT> jwt,
                UserManager<VardPersonal> userManager,
             IHttpContextAccessor httpContextAccessor

            )
        {
            _context = context;
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.config = config;
            _jwt = jwt.Value;
            _httpContextAccessor = httpContextAccessor;
        }


        public async Task<string> GetCurrentUserId()
        {
           var x=  _httpContextAccessor?.HttpContext?.Request.Headers.Authorization.ToString().Split(' ')[1];
            if (!string.IsNullOrEmpty(x))
            {
                var principal = GetPrincipalFromExpiredToken(x);
                if (principal != null)
                {
                    var username = principal.Identity?.Name??"";
                    var user=await userManager.FindByEmailAsync(username);
                    if (user != null)
                      return user.Id ?? "";

                   
                }
               
            }
            return "";
        }




        public async Task<bool> CreateUserAsync(CrudVardPersonal dto)
        {
            //if(dto.Password== null) return false;   
            List<string> rolesNeed = dto.Roles.Where(i => i.IsSelected).Select(i => i.RoleName).ToList();


            VardPersonal applicationUser = new()
            {
                Name = dto.Name,
                PersonNo = dto.PersonNo,
                OmfatningId = dto.OmfatningId,
                Email = dto.Email,
                PersonPosition = string.Empty,
                PhoneNumber = dto.PhoneNumber,
                DepartmentId = dto.DepartmentId,
                Created_date = DateTime.UtcNow,
                Created_by = GetCurrentUserId().GetAwaiter().GetResult(),
                Updated_date = DateTime.UtcNow,
                Updated_by = string.Empty,
                RefreshToken = string.Empty,
                LockoutEnabled = false,
                UserName = dto.Email,
                PassChange = false
                
        };

         
            try
            {

            
            
                //await userManager.CreateAsync(applicationUser);

                var res = await userManager.CreateAsync(applicationUser, "Apex_1234");
                if (res.Succeeded)
                {
                    var user=await userManager.FindByEmailAsync(dto.Email);


                    if (user != null)
                    {
               


                       var set= SetPasswordAsync(user.Id);
                        if (rolesNeed.Count > 0)
                        {
                            try
                            {
                                var result = await userManager.AddToRolesAsync(applicationUser!, rolesNeed);
                                return result.Succeeded;
                            }
                         catch (Exception ex)
                            {
                                throw;
                            }
                        }
                     
                    }
                    return true;
                }
                return false;
            }
            catch (Exception ex)
            {
                return false;
            }
        }


        public async Task<LoginResponse> LoginAsync([FromBody] LoginDto dto)
        {
            LoginResponse loginResponse = new();
            var result = await signInManager.PasswordSignInAsync(
                  dto.Email!, dto.Password!, dto.RememberMe,false);

            if (result.Succeeded)
            {
                var user = await userManager.FindByEmailAsync(dto.Email);
               if(user == null)
                    loginResponse.Message = "Error In Login";
               

                IList<string> Roles = await userManager.GetRolesAsync(user!);
                var jwtSecurityToken = await GenerateJwtToken(user!);

                user.RefreshToken = GenerateRefreshToken();
                user.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(5); // Refresh token valid for 5 days
                await userManager.UpdateAsync(user);

                loginResponse.BasicUserInfo=new();
                loginResponse.UserRoles = [.. Roles];
                loginResponse.Token = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken);
                loginResponse.Expiration = jwtSecurityToken.ValidTo;
                loginResponse.Refresh_token = user.RefreshToken;
                loginResponse.Refresh_token_expiry = user.RefreshTokenExpiryTime;
                loginResponse.LoginStatus =true;
                loginResponse.passwordChange = user.PassChange;
               
                loginResponse.Message = "Login Success";
                loginResponse.BasicUserInfo = new()
                {
                    UserName = user.Name,
                    OmfatningName = _context.Omfatnings.Where(i => i.Id == user.OmfatningId).Select(i => i.Name).FirstOrDefault() ?? "",
                    DeparmentName = _context.Departments.Where(i => i.Id == user.DepartmentId).Select(i => i.Name).FirstOrDefault() ?? ""
                    
                };
                return loginResponse;
            }
            loginResponse.Message = "Error In Login";
            return loginResponse;
        }

        private string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                return Convert.ToBase64String(randomNumber);
            }
        }

        private async Task<JwtSecurityToken> GenerateJwtToken(VardPersonal user)
        {

            IList<string> Roles = await userManager.GetRolesAsync(user!);
           // UserSession userSession = new(user.Id, user.UserName, user.Email, [.. Roles]);
          
            List<Claim> userClaims = [];


        
         
            userClaims.Add(new Claim(ClaimTypes.Email, user.Email!));
            userClaims.Add(new Claim(JwtRegisteredClaimNames.Sub, user.UserName??""));
            userClaims.Add(new Claim(ClaimTypes.NameIdentifier, user.Id));
            userClaims.Add(new Claim(ClaimTypes.Name, user.UserName!));
            userClaims.Add(new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()));
            userClaims.Add(new Claim(JwtRegisteredClaimNames.Email, user.Email??""));
            userClaims.Add(new Claim("rol", "api_access"));

            if (Roles is not null)
                foreach (var item in Roles)
                {
                    userClaims.Add(new Claim(ClaimTypes.Role, item));

                }


            var symmetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwt.Key));
            var signingCredentials = new SigningCredentials(symmetricSecurityKey, SecurityAlgorithms.HmacSha256);

            var jwtSecurityToken = new JwtSecurityToken(
                issuer: _jwt.Issuer,
                audience: _jwt.Audience,
                claims: userClaims,
                expires: DateTime.UtcNow.AddMinutes(_jwt.DurationInMinutes),
                signingCredentials: signingCredentials
             
                );
           
            return jwtSecurityToken;
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


        public async Task<string> RefreshTokenAsync([FromBody]  RefreshTokenRequest model)
        {
        

            var principal = GetPrincipalFromExpiredToken(model.Token);
            var username = principal.Identity?.Name; // retrieve the username from the expired token

            var user = await userManager.FindByNameAsync(username!);

            if (user == null || user.RefreshToken != model.RefreshToken || user.RefreshTokenExpiryTime <= DateTime.Now)
            {
                throw new SecurityTokenException("Invalid refresh token");
            }
            var jwtToken = await GenerateJwtToken(user);

            return new JwtSecurityTokenHandler().WriteToken(jwtToken);
        }

        public async Task<bool> UpdateUserAsync(string id,CrudVardPersonal dto)
        {
             
          
            var user = await userManager.FindByIdAsync(id);

            if (user == null || id != user.Id)
            {
                return false;
            }
            user.Name = dto.Name;
            user.PersonNo = dto.PersonNo;
            user.OmfatningId = dto.OmfatningId;
            user.PersonPosition = dto.PersonPosition;
            user.PhoneNumber = dto.PhoneNumber;
            user.DepartmentId = dto.DepartmentId;
            user.Updated_date = DateTime.UtcNow;
            user.Updated_by = GetCurrentUserId().GetAwaiter().GetResult();

            _context.VardPersonals.Update(user);
            var res = await _context.SaveChangesAsync() > 0;
            if (res)
            {

                IList<string> Roles = await userManager.GetRolesAsync(user);
                var res1 = await userManager.RemoveFromRolesAsync(user, Roles);
                if (res1.Succeeded)
                {
                    await userManager.AddToRolesAsync(user!, dto.Roles.Where(i => i.IsSelected).Select(i => i.RoleName));
                }

                return true;
            }

            return false;
        }
        
        public async Task<bool> LockInOutAsync(string UserId)
        {
            var user = await userManager.FindByIdAsync(UserId);
            //var colsed = await userManager.FindByIdAsync(GetCurrentUserId().GetAwaiter().GetResult());

            if (user is null)
            {
                return false;
            }
            user.LockoutEnabled = !user.LockoutEnabled;

            if(user.LockoutEnabled)
            {
                user.AccessFailedCount = 0;
            }
            else
            {
                user.AccessFailedCount = 6;
            }
            if (user.LockoutEnabled) {

                user.LockoutEnd = DateTime.Now;
                _context.VardPersonals.Update(user);
                return await _context.SaveChangesAsync() > 0;
            }
            else
            {
          
                     user.LockoutEnd = null;
                user.Updated_by = GetCurrentUserId().GetAwaiter().GetResult();
                user.Updated_date = DateTime.Now;
                _context.VardPersonals.Update(user);
                return await _context.SaveChangesAsync() > 0;
            }
           
            

             
        }
        public async Task<bool> SetPasswordAsync(string Id)
        {
            var user = await userManager.FindByIdAsync(Id);

            if (user is null)
            {
                return false;
            }

            user.PasswordHash = "AQAAAAEAACcQAAAAEEoZHfYt7fsFBomfdo3wNF5sSijVixufjlJuwyu8Cv8td4LL4YWvn0x59RnCd0ia4g==";
            user.PassChange = false;

            _context.VardPersonals.Update(user);
            return await _context.SaveChangesAsync() > 0;


             
        }
        public async Task<string> SetPasswordNewAsync(resetPass resPass)
        {
            if (!StrongPassword(resPass.NewPassword))
            {
                return "يجب ادخال كلمة مرور قوية ";
            }

            var principal = GetPrincipalFromExpiredToken(resPass.token);
            var username = principal.Claims.First().Value; // retrieve the username from the expired token

            var user = await userManager.FindByNameAsync(username);


            if (user is null)
            {
                return "المستخدم غير موجود";
            }

            await userManager.RemovePasswordAsync(user);
            var res = await userManager.AddPasswordAsync(user, resPass.NewPassword);
            if (res.Succeeded)
            {
                // user.Password = Encrypt(resPass.NewPassword);
                //user.PassChangeDate = DateTime.Now;
                user.PassChange = true;
                await userManager.UpdateAsync(user);
                _context.VardPersonals.Update(user);
                var ress = await _context.SaveChangesAsync() > 0;
                if (ress)
                    return string.Empty;
            }
            return "حدث خطأ اثناء تغير كلمة المرور";



        }

        private bool StrongPassword(string newPassword)
        {

            if (
                 newPassword.Length < 6 ||
                !newPassword.Any(char.IsUpper) ||
                !newPassword.Any(ch => !char.IsLetterOrDigit(ch)) ||
                newPassword.ToLower().Contains("pass") ||
                newPassword.ToLower().Contains("word")

                )
                return false;


            return true;
        }
        public string Encrypt(string clearText)
        {
            string encryptionKey = "MAKV2SPBNI99212";
            byte[] clearBytes = Encoding.Unicode.GetBytes(clearText);
            using (Aes encryptor = Aes.Create())
            {
                Rfc2898DeriveBytes pdb = new(encryptionKey, new byte[] { 0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76 });
                encryptor.Key = pdb.GetBytes(32);
                encryptor.IV = pdb.GetBytes(16);
                using MemoryStream ms = new();
                using (CryptoStream cs = new(ms, encryptor.CreateEncryptor(), CryptoStreamMode.Write))
                {
                    cs.Write(clearBytes, 0, clearBytes.Length);
                    cs.Close();
                }
                clearText = Convert.ToBase64String(ms.ToArray());
            }

            return clearText;
        }

        public string Decrypt(string cipherText)
        {
            string encryptionKey = "MAKV2SPBNI99212";
            byte[] cipherBytes = Convert.FromBase64String(cipherText);
            using (Aes encryptor = Aes.Create())
            {
                Rfc2898DeriveBytes pdb = new(encryptionKey, new byte[] { 0x49, 0x76, 0x61, 0x6e, 0x20, 0x4d, 0x65, 0x64, 0x76, 0x65, 0x64, 0x65, 0x76 });
                encryptor.Key = pdb.GetBytes(32);
                encryptor.IV = pdb.GetBytes(16);
                using MemoryStream ms = new();
                using (CryptoStream cs = new(ms, encryptor.CreateDecryptor(), CryptoStreamMode.Write))
                {
                    cs.Write(cipherBytes, 0, cipherBytes.Length);
                    cs.Close();
                }
                cipherText = Encoding.Unicode.GetString(ms.ToArray());
            }

            return cipherText;
        }

    }
}
