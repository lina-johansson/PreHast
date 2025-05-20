

namespace PreHast.Server.DTO
{
    public class LoginResponse
    {
        public BasicUserInfo BasicUserInfo { get; set; } = new();
        public string Token { get; set; }=string.Empty;
        public bool passwordChange { get; set; } 
        public DateTime Expiration {  get; set; }

        public string Refresh_token { get; set; }
        public DateTime Refresh_token_expiry { get; set; }

        public string Message { get; set; }=string.Empty;
        public bool LoginStatus { get; set; }=false;
        public List<string> UserRoles { get; set; } = [];
        
    }

    public class BasicUserInfo
    {
       
        public string UserName { get; set; }=string.Empty;
        public string OmfatningName { get; set; }=string.Empty;
        public string DeparmentName { get; set; }=string.Empty;
    }
}
