using PreHast.Server.Models;

namespace PreHast.Server.DTO
{
    public class SvarCrudDto
    {
        //مودل اضافة الاجوبة 
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public int Sort { get; set; }
        public int Degree { get; set; }
 
        public int FragorId { get; set; }  // Foreign Key to Frago
     
        //فقط هذا ما نحتاجه عند الاضافة
        //كلشي واضح لو اتصل افهمج وبعدين نكمل؟لا واضح باباتي الحمد لله 
    }
}
