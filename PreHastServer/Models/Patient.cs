namespace PreHast.Server.Models
{
    public class Patient
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public int PersonNummer { get; set; }

        public List<FinalKontroll> FinalKontrolls { get; set; } = [];

    }
}
