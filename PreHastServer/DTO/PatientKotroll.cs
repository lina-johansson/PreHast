using PreHast.Server.Models;

namespace PreHast.Server.DTO
{
    public class PatientKotroll
    {
        public PatientDto PatientData { get; set; } = null!;
        public List<PatientTest> PatientTests { get; set; } = [];
    }

 
   public class PatientTest
    {
        public int Id { get; set; }
        public int PatientId { get; set; }
        public VardData VardData { get; set; } = null!;
        public string TestDate { get; set; } = null!;
        public string Notc { get; set; } = string.Empty;
        public int TestDegree { get; set; }
 
    }

    public class PatientKotrollCreate
    {
        public int Id { get; set; }
        public PatientDto PatientData { get; set; } = null!;
        public VardData VardData { get; set; } = null!;
        public List<FragorToCreate> Fragors { get; set; } = [];
        public int SumSvar { get; set; }
        public bool Sent {  get; set; } =false;
        public string Notc {  get; set; } =string.Empty;
        public string? Date {  get; set; }  

        public string? VardToSent { get; set; }
    }
    public class VardData
    {
        public string VardId { get; set; } = null!;
        public string VardOmfatning { get; set; } = null!;
        public string VardName { get; set; } = null!;
    }
   
    public class FragorToCreate
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Description { get; set; } = null!;
        public int Sort { get; set; }
        public bool HasLeftRight { get; set; } = false;
        public List<SvarDto> Svars { get; set; } = [];
        public int SvarAnswerLeft { get; set; }
        public int SvarAnswerRight { get; set; }
        public List<ManyAnswers> ManyAnswers { get; set; } = [];
   
    }
    public class ManyAnswers
    {
        public int SvarAnswerLeft { get; set; }
        public int SvarAnswerRight { get; set; }
    }
    public class KontrollVard
    {
        public string VardId { get; set; } = string.Empty;
        public string? Rsid { get; set; }    
       public string VardOmfiting {get;set;}=string.Empty;
       public string VardName {get;set;}=string.Empty;
        public bool VardIsActive { get; set; } = false;
    }

 public class DectorTest
    {
        public KontrollVard KontrollVard { get; set; } = null!;
        public List<PatientTest> PatientsTests { get; set; } = [];
    }
}
