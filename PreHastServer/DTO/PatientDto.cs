namespace PreHast.Server.Models
{
    public class PatientDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public int PersonNummer { get; set; }
 

    }

    public class PatientCrudDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public int PersonNummer { get; set; }


    }
}
