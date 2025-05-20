namespace PreHast.Server.Models
{
    public class Department
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;


        public List<VardPersonal> VardPersonals { get; set; } = [];
    }
}
