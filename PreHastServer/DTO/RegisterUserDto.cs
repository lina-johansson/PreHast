namespace PreHast.Server.DTO
{
 
    public class resetPass
    {
   
        public string token { get; set; } = null!;
        
        public string NewPassword { get; set; } = null!;
        public string ConfirmPassword { get; set; } = null!;


    }
}
