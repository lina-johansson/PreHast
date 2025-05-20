using PreHast.Server.Models;

namespace PreHast.Server.DTO
{
    public class ListVardPersonal
    {
        
        public string Id { get; set; } = null!;
        public string Name { get; set; } = null!;
        public int PersonNo { get; set; }
        public int OmfatningId { get; set; }
        public string? OmfatningName { get; set; }
        public string Email { get; set; }=null!;    

        public int DepartmentId { get; set; }
        public string? DepartmentName { get; set; }
        public string? PhoneNumber { get; set; }
        public string PersonPosition { get; set; } = null!;
        public DateTime LastLogin { get; set; }

        public DateTime Created_date { get; set; }
        public string Created_by { get; set; } = string.Empty;
        public DateTime Updated_date { get; set; }
        public string Updated_by { get; set; } = string.Empty;
        public bool LockoutEnabled { get; set; } 
        public DateTimeOffset? LockoutEnabledDate { get; set; }

        public List<RoleWithUserDto> Roles { get; set; } = [];

       
    }
}
