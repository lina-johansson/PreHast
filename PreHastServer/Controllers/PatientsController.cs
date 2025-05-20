using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PreHast.Server.Data;
using PreHast.Server.Models;

namespace PreHast.Server.Controllers
{
    [Authorize(Roles = "Admin,Doctors,Nurses")]
    [Route("api/[controller]")]
    [ApiController]
    public class PatientsController : ControllerBase
    {
        private readonly PreHastDbContext _context;

        public PatientsController(PreHastDbContext context)
        {
            _context = context;
        }

        // GET: api/Patients
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PatientDto>>> GetPatients()
        {
            List<PatientDto> patientDtos = [];

            var x= await _context.Patients.ToListAsync();
            foreach (var item in x)
            {
                patientDtos.Add(new()
                {
                    Id = item.Id,
                    Name = item.Name,
                    PersonNummer=item.PersonNummer
                });

            }

            return Ok(patientDtos);
        }

        // GET: api/Patients/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PatientDto>> GetPatient(int id)
        {
            PatientDto patientDto = new();
            var patient = await _context.Patients.FindAsync(id);

            if (patient == null)
            {
                return NotFound();
            }
            patientDto.Id=patient.Id;
            patientDto.Name=patient.Name;
            patientDto.PersonNummer=patient.PersonNummer;

            return patientDto;
        }

        // PUT: api/Patients/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPatient(int id, PatientCrudDto patient)
        {
            if (id != patient.Id)
            {
                return BadRequest();
            }
            Patient patient1 = new();
            patient1.Id=patient.Id;
            patient1.Name=patient.Name;
            patient1.PersonNummer = patient.PersonNummer;


            _context.Entry(patient1).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PatientExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }


        [HttpPost]
        public async Task<ActionResult<Patient>> PostPatient(PatientCrudDto patient)
        {
            Patient patient1 = new()
            {
                Id=patient.Id,  
                Name=patient.Name,  
                PersonNummer=patient.PersonNummer,  

            };
            _context.Patients.Add(patient1);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPatient", new { id = patient.Id }, patient);
        }

        // DELETE: api/Patients/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePatient(int id)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null)
            {
                return NotFound();
            }

            _context.Patients.Remove(patient);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool PatientExists(int id)
        {
            return _context.Patients.Any(e => e.Id == id);
        }
    }
}
