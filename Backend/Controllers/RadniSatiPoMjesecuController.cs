using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RadniSatiPoMjesecuController : ControllerBase
    {
        private readonly RadniNaloziContext _context;

        public RadniSatiPoMjesecuController(RadniNaloziContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(_context.RadniSatiPoMjesecu.ToList());
        }

        [HttpPost]
        public IActionResult Post(RadniSatiPoMjesecu sati)
        {
            _context.RadniSatiPoMjesecu.Add(sati);
            _context.SaveChanges();
            return Ok(sati);
        }

        [HttpPut("{sifra}")]
        public IActionResult Put(int sifra, RadniSatiPoMjesecu sati)
        {
            var postojeciSati = _context.RadniSatiPoMjesecu.Find(sifra);
            if (postojeciSati == null)
            {
                return BadRequest("Zapis nije pronađen");
            }

            postojeciSati.Godina = sati.Godina;
            postojeciSati.Mjesec = sati.Mjesec;
            postojeciSati.Sati = sati.Sati;

            _context.SaveChanges();
            return Ok(postojeciSati);
        }

        [HttpDelete("{sifra}")]
        public IActionResult Delete(int sifra)
        {
            var sati = _context.RadniSatiPoMjesecu.Find(sifra);
            if (sati == null)
            {
                return BadRequest("Zapis nije pronađen");
            }

            _context.RadniSatiPoMjesecu.Remove(sati);
            _context.SaveChanges();
            return Ok();
        }
    }
}
