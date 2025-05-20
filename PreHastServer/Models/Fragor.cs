namespace PreHast.Server.Models
{
    public class Fragor
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Description { get; set; }=null!;
        public int Sort { get; set; }
        public bool HasLeftRight { get; set; }
        public virtual List<Svar> Svars { get; set; } = [];
    }
}
