using PreHast.Server.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.AspNetCore.Http.HttpResults;
namespace PreHast.Server.DTO
{
    public class FragorCrudDto
    {
        //لان الجدول صغير جدا ومابيه تعقيد لذلك مودل العرض رح يصي نفس مودل الاضافة  ok
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Description { get; set; } = null!;
        public int Sort { get; set; }
        public bool HasLeftRight { get; set; }
        public List<SvarCrudDto> SvarsCrudDto { get; set; } = []; //هذه لستة بمجموعة من الاجوبة التي تضاف مع السوال الفوك في قاعدة البيانات
    }


}
