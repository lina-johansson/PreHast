
using PreHast.Server.Models;
using System.ComponentModel.DataAnnotations;

namespace PreHast.Server.Models
{
   
    public class News
    {
       
        public int Id { get; set; }

        public string ApplicationUserId { get; set; } = null!;
        public VardPersonal? VardPersonals { get; set; }

        [Display(Name ="تفاصيل التبليغ")]
        public string? Details { get; set; }

        [Display(Name = "اظهار التبليغ")]
        public bool Can { get; set; } = false;
        public bool CanAll { get; set; } = true;
        public DateTime DateEntry { get; set; } = DateTime.Now;
    }
    
}
