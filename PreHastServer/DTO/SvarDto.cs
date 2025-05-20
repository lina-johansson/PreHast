using PreHast.Server.Models;

namespace PreHast.Server.DTO
{
    public class SvarDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!; // الجواب
        public string? Description { get; set; }//وصف الجواب
        public int Sort { get; set; }//ترتيب الجواب بالنسبة لبقية الاجوبة من نفس السوال
        public int Degree { get; set; }//درجة الجواب
      
        public int FragorId { get; set; }  // Foreign Key to Frago //الجواب مرتبط باي سوال
       //بس هاي الخصائص نحتاجها بالعرض
    }
}
