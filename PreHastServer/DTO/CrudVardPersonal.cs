using PreHast.Server.Models;

namespace PreHast.Server.DTO
{
    public class CrudVardPersonal
    {
        public string Id { get; set; } = null!;
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? Password { get; set; }  
        public string? ConfiremPassword { get; set; }  
        public int PersonNo { get; set; }
        public int OmfatningId { get; set; }

        public int DepartmentId { get; set; }
        public string? PhoneNumber { get; set; }  
        public string? PersonPosition { get; set; } 
        public DateTime LastLogin { get; set; }


        public List<RoleWithUserDto> Roles { get; set; } = [];
    }
}
