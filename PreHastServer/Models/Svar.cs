namespace PreHast.Server.Models
{
    public class Svar
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public int Sort { get; set; }
        public int Degree { get; set; }

        public int FragorId { get; set; }  // Foreign Key to Frago
        public Fragor? Fragor { get; private set; }

        public List<Kontroll> Kontrolls { get; set; } = [];
    }
}
