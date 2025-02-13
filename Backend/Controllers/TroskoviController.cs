using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TroskoviController : ControllerBase
    {
        private readonly RadniNaloziContext _context;

        public TroskoviController(RadniNaloziContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_context.Troskovi
                .Include(t => t.Vrsta)
                .Include(t => t.RadniNalog)
                .ToList());
        }

        [HttpPost]
        public IActionResult Post(Trosak trosak)
        {
            _context.Troskovi.Add(trosak);
            _context.SaveChanges();
            return Ok(trosak);
        }

        [HttpPut("{sifra}")]
        public IActionResult Put(int sifra, Trosak trosak)
        {
            var postojeciTrosak = _context.Troskovi
                .Include(t => t.Vrsta)
                .Include(t => t.RadniNalog)
                .FirstOrDefault(t => t.Sifra == sifra);

            if (postojeciTrosak == null)
            {
                return BadRequest("Trosak nije pronađen");
            }

            postojeciTrosak.Naziv = trosak.Naziv;
            postojeciTrosak.Vrsta = trosak.Vrsta;
            postojeciTrosak.RadniNalog = trosak.RadniNalog;
            postojeciTrosak.Kolicina = trosak.Kolicina;
            postojeciTrosak.Cijena = trosak.Cijena;

            _context.SaveChanges();
            return Ok(postojeciTrosak);
        }

        [HttpDelete("{sifra}")]
        public IActionResult Delete(int sifra)
        {
            var trosak = _context.Troskovi.Find(sifra);
            if (trosak == null)
            {
                return BadRequest("Trosak nije pronađen");
            }

            _context.Troskovi.Remove(trosak);
            _context.SaveChanges();
            return Ok();
        }
    }
}
