using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class KlijentiController : ControllerBase
    {
        private readonly RadniNaloziContext _context;

        public KlijentiController(RadniNaloziContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_context.Klijenti.ToList());
        }

        [HttpPost]
        public IActionResult Post(Klijent klijent)
        {
            _context.Klijenti.Add(klijent);
            _context.SaveChanges();
            return Ok(klijent);
        }

        [HttpPut("{sifra}")]
        public IActionResult Put(int sifra, Klijent klijent)
        {
            var postojeciKlijent = _context.Klijenti.Find(sifra);
            if (postojeciKlijent == null)
            {
                return BadRequest("Klijent nije pronađen");
            }

            postojeciKlijent.Naziv = klijent.Naziv;
            postojeciKlijent.Oib = klijent.Oib;
            postojeciKlijent.Adresa = klijent.Adresa;
            postojeciKlijent.Email = klijent.Email;
            postojeciKlijent.OdgovornaOsoba = klijent.OdgovornaOsoba;

            _context.SaveChanges();
            return Ok(postojeciKlijent);
        }

        [HttpDelete("{sifra}")]
        public IActionResult Delete(int sifra)
        {
            var klijent = _context.Klijenti.Find(sifra);
            if (klijent == null)
            {
                return BadRequest("Klijent nije pronađen");
            }

            _context.Klijenti.Remove(klijent);
            _context.SaveChanges();
            return Ok();
        }
    }
}
