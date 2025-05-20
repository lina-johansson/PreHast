

namespace PreHast.Server.DTO
{
    public class NewsDto
    {



    }
    public class CrudNews
    {
        public int Id { get; set; }
        public string? ApplicationUserId { get; set; }
        public string? Details { get; set; }
        public bool Can { get; set; } = false;
        public bool CanAll { get; set; } = true;
    }



    public class RankList
    {
        public int Value { get; set; }
        public string  Label { get; set; }= null!;



    }
}