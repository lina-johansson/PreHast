namespace PreHast.Server.Models
{
    public class Kontroll
    {
        public int Id { get; set; }
        public int SvarId { get; set; }
        public Svar? Svar { get; set; }
        public bool SelectedSvarLeft { get; set; }
        public bool SelectedSvarRight { get; set; }
        public int FinalKontrollId { get; set; }
        public FinalKontroll? FinalKontrolls { get; private set; }
    }
}
