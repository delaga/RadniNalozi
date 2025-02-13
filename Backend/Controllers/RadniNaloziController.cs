using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RadniNaloziController : ControllerBase
    {
        private readonly RadniNaloziContext _context;

        public RadniNaloziController(RadniNaloziContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_context.RadniNalozi
                .Include(r => r.Djelatnik)
                .Include(r => r.Klijent)
                .ToList());
        }

        [HttpPost]
        public IActionResult Post(RadniNalog radniNalog)
        {
            _context.RadniNalozi.Add(radniNalog);
            _context.SaveChanges();
            return Ok(radniNalog);
        }

        [HttpPut("{sifra}")]
        public IActionResult Put(int sifra, RadniNalog radniNalog)
        {
            var postojeciNalog = _context.RadniNalozi
                .Include(r => r.Djelatnik)
                .Include(r => r.Klijent)
                .FirstOrDefault(r => r.Sifra == sifra);

            if (postojeciNalog == null)
            {
                return BadRequest("Radni nalog nije pronađen");
            }

            postojeciNalog.Djelatnik = radniNalog.Djelatnik;
            postojeciNalog.Klijent = radniNalog.Klijent;
            postojeciNalog.VrijemePocetka = radniNalog.VrijemePocetka;
            postojeciNalog.VrijemeZavrsetka = radniNalog.VrijemeZavrsetka;
            postojeciNalog.RadnihSati = radniNalog.RadnihSati;
            postojeciNalog.Napomena = radniNalog.Napomena;

            _context.SaveChanges();
            return Ok(postojeciNalog);
        }

        [HttpDelete("{sifra}")]
        public IActionResult Delete(int sifra)
        {
            var nalog = _context.RadniNalozi.Find(sifra);
            if (nalog == null)
            {
                return BadRequest("Radni nalog nije pronađen");
            }

            _context.RadniNalozi.Remove(nalog);
            _context.SaveChanges();
            return Ok();
        }
    }
}
