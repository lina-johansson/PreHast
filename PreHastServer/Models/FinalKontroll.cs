namespace PreHast.Server.Models
{
    public class FinalKontroll
    {
        public  int Id { get; set; }
        public int PatientId { get; set; }
        public Patient? Patient { get; set; }
        public string VardpersonalId { get; set; } = null!;
        public VardPersonal? VardPersonal{ get; set; }
        public DateTime Datum { get; set; } = DateTime.Now;
        public string? Note { get; set; }
        public  int  Sum { get; set; }
        public virtual List<Kontroll> Kontrolls { get; set; } = [];
        public virtual List<DoctorFinalKontroll> DoctorFinalKontrolls { get; set; } = [];
    }

}
