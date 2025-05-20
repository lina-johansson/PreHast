using PreHast.Server.Models;

namespace PreHast.Server.DTO
{
    public class FragorDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Description { get; set; } = null!;
        public int Sort { get; set; }
        public bool HasLeftRight { get; set; }
        //كل الفوك خصائص مرتبطة بسوال واحد فقط yee
        public  List<SvarDto> SvarsDto { get; set; } = []; //هذه لستة بالاجوبة التابعة لهذا السوال
        //العرض فقط dto
        //الاضافة CrudDto الاضافة والتعديل
    }
}
