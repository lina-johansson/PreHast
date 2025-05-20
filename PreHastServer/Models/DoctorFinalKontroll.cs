namespace PreHast.Server.Models
{
    public class DoctorFinalKontroll
    {
        public int Id { get; set; }
        public string VardpersonalId { get; set; } = null!;
        public VardPersonal? VardPersonal { get; set; }
        public bool Seen { get; set; } = false;
        public DateTime? SeenDate { get; set; }
        public int FinalKontrollId { get; set; }
        public FinalKontroll? FinalKontrolls { get; private set; }
    }
}
