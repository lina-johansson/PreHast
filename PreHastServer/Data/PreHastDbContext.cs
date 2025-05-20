

using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using PreHast.Server.Models;







namespace PreHast.Server.Data
{
    public class PreHastDbContext : IdentityDbContext<VardPersonal>
    {
        public PreHastDbContext(DbContextOptions<PreHastDbContext> options)
             : base(options) { }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);


 
           
      
        }

        public DbSet<FinalKontroll> FinalKontrolls { get; set; }
        public DbSet<Kontroll> Kontrolls { get; set; }
        public DbSet<DoctorFinalKontroll> DoctorFinalKontrolls { get; set; }
        public DbSet<Fragor> Fragors { get; set; }
       
        public DbSet<Omfatning> Omfatnings { get; set; }
        public DbSet<Patient> Patients { get; set; }
        public DbSet<Svar> Svars { get; set; }
        public DbSet<VardPersonal> VardPersonals { get; set; }
        public DbSet<VardRole> ApplicationRoles { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<News> Newses { get; set; }
 
 


    }

}