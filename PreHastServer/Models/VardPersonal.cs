using Microsoft.AspNetCore.Identity;
 

namespace PreHast.Server.Models
{
    public class VardPersonal:IdentityUser
    {

       
        public string Name { get; set; } = null!;
        public int PersonNo { get; set; }
        public int OmfatningId { get; set; }

        public int DepartmentId {  get; set; } 
        public Department? Department { get; set; }
        public string PersonPosition { get; set; } = null!;
        public DateTime LastLogin { get; set; }

        public DateTime Created_date { get; set; }
        public string Created_by { get; set; } = string.Empty;
        public DateTime Updated_date { get; set; }
        public string Updated_by { get; set; } = string.Empty;
        public bool PassChange { get; set; } = false;


        public string RefreshToken { get; set; } = string.Empty;
        public DateTime RefreshTokenExpiryTime { get; set; }

        public List<News> Newses { get; set; } = [];
        public Omfatning? Omfatning { get; set; }
        public List<FinalKontroll> FinalKontrolls { get; set; } = [];
        public List<DoctorFinalKontroll> DoctorFinalKontrolls { get; set; } = [];
    }
}
